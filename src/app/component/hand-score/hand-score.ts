import { Component, computed, inject } from '@angular/core';
import { SuitedTile } from '../../model/suited-tile';
import { TileType } from '../../model/tile-type';
import { TableStore } from '../../store/table-store';

const DEFAULT_NO_SCORE = 0;
const SUITE_COUNT = 3;

@Component({
  selector: 'app-hand-score',
  imports: [],
  templateUrl: './hand-score.html',
  styleUrl: './hand-score.css',
})
export class HandScore {
  private tableStore = inject(TableStore);

  private counts = computed<number[][]>(() => {
    const currentPlayer = this.tableStore.entities()[0];

    const tiles = currentPlayer.tiles;
    const counts: number[][] = Array.from({ length: SUITE_COUNT }, () =>
      Array(10).fill(0),
    );
    tiles.forEach((t) => {
      const st = t as SuitedTile;
      counts[st.suite][st.number]++;
    });

    return counts;
  });

  allChi = computed<number>(() => {
    const baseScore = 1;
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (tiles.length !== 14 ) {
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
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (tiles.length !== 14) {
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

  allPung = computed<number>(() => {
    const baseScore = 2;
    const bonusScore = 3;
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (tiles.length !== 14) {
      return 0;
    }

    // Try every possible pair (eyes)
    for (let s = 0; s < SUITE_COUNT; s++) {
      for (let n = 0; n <= 9; n++) {
        if (this.counts()[s][n] >= 2) {
          const clone = this.counts().map((arr) => arr.slice());
          clone[s][n] -= 2; // remove pair
          if (this.canFormAllPungs(clone)) {
            // Valid all pung hand found
            // Check for even/odd bonus
            const suitedTiles = tiles.filter(
              (t) => t.type === TileType.SUITED,
            ) as SuitedTile[];

            if (suitedTiles.length > 0) {
              const allNumbers = suitedTiles.map((t) => t.number);
              const allEven = allNumbers.every((n) => n % 2 === 0);
              const allOdd = allNumbers.every((n) => n % 2 === 1);

              if (allEven || allOdd) {
                return baseScore + bonusScore;
              }
            }

            return baseScore;
          }
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

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

  private canFormMelds(c: number[][]): boolean {
    for (let s = 0; s < SUITE_COUNT; s++) {
      for (let n = 1; n <= 9; n++) {
        if (c[s][n] > 0) {
          // Try pung/kong (remove 3)
          if (c[s][n] >= 3) {
            c[s][n] -= 3;
            if (this.canFormMelds(c)) {
              return true;
            }
            c[s][n] += 3;
          }

          // Try chi (sequence)
          if (n + 2 <= 9 && c[s][n + 1] > 0 && c[s][n + 2] > 0) {
            c[s][n]--;
            c[s][n + 1]--;
            c[s][n + 2]--;
            if (this.canFormMelds(c)) {
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
}
