import { Component, computed, inject } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { HonourTile } from '../../model/honour-tile';
import { SuitedTile } from '../../model/suited-tile';
import { Tile } from '../../model/tile';
import { TileType } from '../../model/tile-type';
import { TableStore } from '../../store/table-store';

const DEFAULT_NO_SCORE = 0;
const SUITE_COUNT = 3;
const MIN_HAND_SIZE = 14;
const MAX_HAND_SIZE = 18;

@Component({
  selector: 'app-hand-score',
  imports: [MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
  templateUrl: './hand-score.html',
  styleUrl: './hand-score.scss',
})
export class HandScore {
  private tableStore = inject(TableStore);

  /** Hand tiles excluding bonus tiles (flowers/seasons) */
  private handTiles = computed<Tile[]>(() => {
    return this.tableStore
      .entities()[0]
      .tiles.filter((t) => t.type !== TileType.BONUS);
  });

  private counts = computed<number[][]>(() => {
    const counts: number[][] = Array.from({ length: SUITE_COUNT }, () =>
      Array(10).fill(0),
    );
    this.handTiles().forEach((t) => {
      if (t.type !== TileType.SUITED) return;
      const st = t as SuitedTile;
      counts[st.suite][st.number]++;
    });

    return counts;
  });

  private isValidHandSize = computed<boolean>(() => {
    const tiles = this.handTiles();
    return tiles.length >= MIN_HAND_SIZE && tiles.length <= MAX_HAND_SIZE;
  });

  allChi = computed<number>(() => {
    const baseScore = 1;
    const tiles = this.handTiles();

    // All-chi requires exactly 14 tiles (no kongs allowed)
    if (!this.isValidHandSize() || tiles.length !== MIN_HAND_SIZE) {
      return DEFAULT_NO_SCORE;
    }

    // All tiles must be suited (no winds/dragons/bonus)
    if (tiles.some((t) => t.type !== TileType.SUITED)) {
      return DEFAULT_NO_SCORE;
    }

    // Try every possible pair choice
    for (let s = 0; s < SUITE_COUNT; s++) {
      for (let n = 1; n <= 9; n++) {
        if (this.counts()[s][n] >= 2) {
          // You need a pair (eyes) for a valid hand. Don't bother checking without it.
          const clone = this.counts().map((arr) => arr.slice());
          clone[s][n] -= 2; // remove the pair (eyes)
          if (this.canFormChis(clone)) {
            return baseScore;
          }
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  mixedTwoSuit = computed<number>(() => {
    const baseScore = 1;
    const tiles = this.handTiles();

    if (!this.isValidHandSize()) {
      return DEFAULT_NO_SCORE;
    }

    // No honours or dragons allowed
    if (tiles.some((t) => t.type !== TileType.SUITED)) {
      return DEFAULT_NO_SCORE;
    }

    // Must use exactly two suits
    const suitsUsed = new Set<number>();
    tiles.forEach((t) => suitsUsed.add((t as SuitedTile).suite));
    if (suitsUsed.size !== 2) {
      return DEFAULT_NO_SCORE;
    }

    // Try every possible pair choice
    for (let s = 0; s < SUITE_COUNT; s++) {
      for (let n = 1; n <= 9; n++) {
        if (this.counts()[s][n] >= 2) {
          // You need a pair (eyes) for a valid hand. Don't bother checking without it.
          const clone = this.counts().map((arr) => arr.slice());
          clone[s][n] -= 2; // remove pair
          if (this.canFormMelds(clone)) {
            return baseScore;
          }
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  mixedHand = computed<number>(() => {
    const baseScore = 2;
    const tiles = this.handTiles();

    if (!this.isValidHandSize()) {
      return DEFAULT_NO_SCORE;
    }

    const suitedTiles = tiles.filter(
      (t) => t.type === TileType.SUITED,
    ) as SuitedTile[];
    const honourTiles = tiles.filter(
      (t) => t.type === TileType.HONOUR,
    ) as HonourTile[];

    // Must have both suited and honour tiles, no other types
    if (
      suitedTiles.length === 0 ||
      honourTiles.length === 0 ||
      tiles.length !== suitedTiles.length + honourTiles.length
    ) {
      return DEFAULT_NO_SCORE;
    }

    // Suited tiles must be from exactly one suit
    const suitsUsed = new Set(suitedTiles.map((t) => t.suite));
    if (suitsUsed.size !== 1) {
      return DEFAULT_NO_SCORE;
    }

    const suitIndex = Array.from(suitsUsed)[0];

    const buildSuitedCounts = (): number[][] => {
      const c: number[][] = Array.from({ length: SUITE_COUNT }, () =>
        Array(10).fill(0),
      );
      suitedTiles.forEach((t) => c[t.suite][t.number]++);
      return c;
    };

    // Count honour tiles by identity
    const honourGroups = new Map<string, number>();
    honourTiles.forEach((t) => {
      const key = `${t.honour}-${t.value}`;
      honourGroups.set(key, (honourGroups.get(key) ?? 0) + 1);
    });

    const honoursFormMelds = (groups: Map<string, number>): boolean => {
      for (const count of groups.values()) {
        if (count !== 0 && count !== 3 && count !== 4) return false;
      }
      return true;
    };

    // Try pair from suited tiles
    for (let n = 1; n <= 9; n++) {
      const c = buildSuitedCounts();
      if (c[suitIndex][n] >= 2) {
        c[suitIndex][n] -= 2;
        if (this.canFormMelds(c, suitIndex) && honoursFormMelds(honourGroups)) {
          return baseScore;
        }
      }
    }

    // Try pair from honour tiles
    for (const [key, count] of honourGroups) {
      if (count >= 2) {
        const clone = new Map(honourGroups);
        clone.set(key, count - 2);
        if (honoursFormMelds(clone)) {
          const c = buildSuitedCounts();
          if (this.canFormMelds(c, suitIndex)) {
            return baseScore;
          }
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  allPung = computed<number>(() => {
    const baseScore = 2;
    const bonusScore = 3;
    const tiles = this.handTiles();

    if (!this.isValidHandSize()) {
      return 0;
    }

    const suitedTiles = tiles.filter(
      (t) => t.type === TileType.SUITED,
    ) as SuitedTile[];
    const honourTiles = tiles.filter(
      (t) => t.type === TileType.HONOUR,
    ) as HonourTile[];

    // Only suited and honour tiles allowed
    if (tiles.length !== suitedTiles.length + honourTiles.length) {
      return DEFAULT_NO_SCORE;
    }

    // Count honour tiles by identity
    const honourGroups = new Map<string, number>();
    honourTiles.forEach((t) => {
      const key = `${t.honour}-${t.value}`;
      honourGroups.set(key, (honourGroups.get(key) ?? 0) + 1);
    });

    const honoursFormPungs = (groups: Map<string, number>): boolean => {
      for (const count of groups.values()) {
        if (count !== 0 && count !== 3 && count !== 4) return false;
      }
      return true;
    };

    const checkEvenOddBonus = (): number => {
      if (suitedTiles.length > 0) {
        const allNumbers = suitedTiles.map((t) => t.number);
        const allEven = allNumbers.every((n) => n % 2 === 0);
        const allOdd = allNumbers.every((n) => n % 2 === 1);
        if (allEven || allOdd) {
          return baseScore + bonusScore;
        }
      }
      return baseScore;
    };

    // Try pair from suited tiles
    for (let s = 0; s < SUITE_COUNT; s++) {
      for (let n = 1; n <= 9; n++) {
        if (this.counts()[s][n] >= 2) {
          const clone = this.counts().map((arr) => arr.slice());
          clone[s][n] -= 2;
          if (this.canFormAllPungs(clone) && honoursFormPungs(honourGroups)) {
            return checkEvenOddBonus();
          }
        }
      }
    }

    // Try pair from honour tiles
    for (const [key, count] of honourGroups) {
      if (count >= 2) {
        const clone = new Map(honourGroups);
        clone.set(key, count - 2);
        if (
          honoursFormPungs(clone) &&
          this.canFormAllPungs(this.counts().map((arr) => arr.slice()))
        ) {
          return checkEvenOddBonus();
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  littleSevenPairs = computed<number>(() => {
    const baseScore = 6;
    const tiles = this.handTiles();

    if (tiles.length !== 14) {
      return DEFAULT_NO_SCORE;
    }

    // Count tiles - need exactly 7 pairs (each tile appears exactly 2 times)
    const tileCount = new Map<string, number>();
    tiles.forEach((tile) => {
      const key = this.getTileKey(tile);
      tileCount.set(key, (tileCount.get(key) ?? 0) + 1);
    });

    // Must have exactly 7 entries (7 pairs) with each count being exactly 2
    if (tileCount.size !== 7) {
      return DEFAULT_NO_SCORE;
    }

    const allPairs = Array.from(tileCount.values()).every(
      (count) => count === 2,
    );
    return allPairs ? baseScore : DEFAULT_NO_SCORE;
  });

  bigSevenPairs = computed<number>(() => {
    const baseScore = 9;
    const tiles = this.handTiles();

    if (tiles.length !== 14) {
      return DEFAULT_NO_SCORE;
    }

    // Only suited tiles allowed (no winds or dragons)
    if (tiles.some((t) => t.type !== TileType.SUITED)) {
      return DEFAULT_NO_SCORE;
    }

    // Try consecutive numbers 1-7, 2-8, 3-9
    for (let startNum = 1; startNum <= 3; startNum++) {
      const endNum = startNum + 6; // 7 consecutive numbers
      if (this.hasPairsInSequence(startNum, endNum)) {
        return baseScore;
      }
    }

    return DEFAULT_NO_SCORE;
  });

  purityHand = computed<number>(() => {
    const baseScore = 9;
    const tiles = this.handTiles();

    if (!this.isValidHandSize()) {
      return DEFAULT_NO_SCORE;
    }

    // Only suited tiles allowed (no winds or dragons)
    if (tiles.some((t) => t.type !== TileType.SUITED)) {
      return DEFAULT_NO_SCORE;
    }

    // All tiles must be from the same suit
    const suitsUsed = new Set<number>();
    tiles.forEach((t) => suitsUsed.add((t as SuitedTile).suite));
    if (suitsUsed.size !== 1) {
      return DEFAULT_NO_SCORE;
    }

    // Try every possible pair choice
    const suitIndex = Array.from(suitsUsed)[0];
    for (let n = 1; n <= 9; n++) {
      if (this.counts()[suitIndex][n] >= 2) {
        // Try removing this pair and forming chis/pungs/kongs with remaining
        const clone = this.counts().map((arr) => arr.slice());
        clone[suitIndex][n] -= 2; // remove pair (eyes)

        if (this.canFormMelds(clone, suitIndex)) {
          return baseScore;
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  totalPoints = computed<number>(() => {
    return (
      this.allChi() +
      this.mixedTwoSuit() +
      this.mixedHand() +
      this.allPung() +
      this.littleSevenPairs() +
      this.bigSevenPairs() +
      this.purityHand()
    );
  });

  hasHandScore(): boolean {
    return (
      this.allChi() > 0 ||
      this.mixedTwoSuit() > 0 ||
      this.mixedHand() > 0 ||
      this.allPung() > 0 ||
      this.littleSevenPairs() > 0 ||
      this.bigSevenPairs() > 0 ||
      this.purityHand() > 0
    );
  }

  private canFormChis(c: number[][]): boolean {
    for (let s = 0; s < SUITE_COUNT; s++) {
      for (let n = 1; n <= 9; n++) {
        while (c[s][n] > 0) {
          const take = c[s][n];
          if (n + 2 > 9 || c[s][n + 1] < take || c[s][n + 2] < take) {
            return false;
          }
          c[s][n] -= take;
          c[s][n + 1] -= take;
          c[s][n + 2] -= take;
        }
      }
    }
    return true;
  }

  private canFormMelds(c: number[][], suitIndex?: number): boolean {
    // If suitIndex is specified, only check that suite; otherwise check all suites
    const startSuite = suitIndex ?? 0;
    const endSuite = suitIndex ?? SUITE_COUNT - 1;

    for (let s = startSuite; s <= endSuite; s++) {
      for (let n = 1; n <= 9; n++) {
        if (c[s][n] > 0) {
          // Try kong (remove 4)
          if (c[s][n] >= 4) {
            c[s][n] -= 4;
            if (this.canFormMelds(c, suitIndex)) {
              return true;
            }
            c[s][n] += 4;
          }

          // Try pung (remove 3)
          if (c[s][n] >= 3) {
            c[s][n] -= 3;
            if (this.canFormMelds(c, suitIndex)) {
              return true;
            }
            c[s][n] += 3;
          }

          // Try chi (sequence)
          if (n + 2 <= 9 && c[s][n + 1] > 0 && c[s][n + 2] > 0) {
            c[s][n]--;
            c[s][n + 1]--;
            c[s][n + 2]--;
            if (this.canFormMelds(c, suitIndex)) {
              return true;
            }
            c[s][n]++;
            c[s][n + 1]++;
            c[s][n + 2]++;
          }

          return false;
        }
      }
    }
    return true;
  }

  private canFormAllPungs(counts: number[][]): boolean {
    for (let s = 0; s < SUITE_COUNT; s++) {
      for (let n = 0; n <= 9; n++) {
        if (counts[s][n] > 0) {
          // Try kong (remove 4)
          if (counts[s][n] >= 4) {
            counts[s][n] -= 4;
            const result = this.canFormAllPungs(counts);
            counts[s][n] += 4;
            if (result) {
              return true;
            }
          }

          // Try pung (remove 3)
          if (counts[s][n] >= 3) {
            counts[s][n] -= 3;
            const result = this.canFormAllPungs(counts);
            counts[s][n] += 3;
            if (result) {
              return true;
            }
          }

          return false;
        }
      }
    }
    return true;
  }

  private getTileKey(tile: Tile): string {
    const type = tile.type;
    if (type === TileType.SUITED) {
      const st = tile as SuitedTile;
      return `${type}-${st.suite}-${st.number}`;
    } else if (type === TileType.HONOUR) {
      const ht = tile as HonourTile;
      return `${type}-${ht.honour}-${ht.value}`;
    }
    return `${type}`;
  }

  private hasPairsInSequence(startNum: number, endNum: number): boolean {
    // Check if we have pairs for each number in the sequence startNum to endNum
    for (let n = startNum; n <= endNum; n++) {
      let pairFound = false;
      // Check across all suites for a pair of this number
      for (let s = 0; s < SUITE_COUNT; s++) {
        if (this.counts()[s][n] >= 2) {
          pairFound = true;
          break;
        }
      }
      if (!pairFound) {
        return false;
      }
    }
    return true;
  }
}
