import { Component, computed, inject } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { HonourTile, HonourTileType } from '../../model/honour-tile';
import { TileType } from '../../model/tile-type';
import { WindType } from '../../model/wind-type';
import { DragonType } from '../../model/dragon-type';
import { Tile } from '../../model/tile';
import { TableStore } from '../../store/table-store';

const DEFAULT_NO_SCORE = 0;
const SPECIAL_HAND_SCORE = 15;
const REQUIRED_TILES = 14;
const MAX_TILES_WITH_KONGS = 18;
const SUITE_COUNT = 3;

@Component({
  selector: 'app-special-hands',
  imports: [MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
  templateUrl: './special-hands.html',
  styleUrl: './special-hands.scss',
})
export class SpecialHands {
  private tableStore = inject(TableStore);

  // Computed signal for suited tile counts (reused from hand-score pattern)
  private counts = computed<number[][]>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;
    const counts: number[][] = Array.from({ length: SUITE_COUNT }, () =>
      Array(10).fill(0),
    );
    tiles
      .filter((t) => t.type === TileType.SUITED)
      .forEach((t) => {
        const st = t as SuitedTile;
        counts[st.suite][st.number]++;
      });
    return counts;
  });

  private isValidHandSize = computed<boolean>(() => {
    const tiles = this.tableStore.entities()[0].tiles;
    return (
      tiles.length >= REQUIRED_TILES && tiles.length <= MAX_TILES_WITH_KONGS
    );
  });

  // Special Hand 1: 13 Orphans
  thirteenOrphans = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (tiles.length !== REQUIRED_TILES) {
      return DEFAULT_NO_SCORE;
    }

    // Need: 4 winds, 3 dragons, 6 terminals (1,9 of each suit), 1 duplicate
    const tileCount = new Map<string, number>();

    tiles.forEach((tile) => {
      const key = this.getTileKey(tile);
      tileCount.set(key, (tileCount.get(key) ?? 0) + 1);
    });

    // Count winds
    const windCounts = this.countWinds(tiles);
    const hasAllWinds =
      windCounts.get(WindType.EAST)! >= 1 &&
      windCounts.get(WindType.SOUTH)! >= 1 &&
      windCounts.get(WindType.WEST)! >= 1 &&
      windCounts.get(WindType.NORTH)! >= 1;

    // Count dragons
    const dragonCounts = this.countDragons(tiles);
    const hasAllDragons =
      dragonCounts.get(DragonType.RED)! >= 1 &&
      dragonCounts.get(DragonType.GREEN)! >= 1 &&
      dragonCounts.get(DragonType.WHITE)! >= 1;

    // Count terminals (1 and 9 of each suit)
    const suitedTiles = tiles.filter(
      (t) => t.type === TileType.SUITED,
    ) as SuitedTile[];
    const hasAllTerminals =
      suitedTiles.some(
        (t) => t.suite === SuitedTileType.BAMBOO && t.number === 1,
      ) &&
      suitedTiles.some(
        (t) => t.suite === SuitedTileType.BAMBOO && t.number === 9,
      ) &&
      suitedTiles.some(
        (t) => t.suite === SuitedTileType.CHARACTER && t.number === 1,
      ) &&
      suitedTiles.some(
        (t) => t.suite === SuitedTileType.CHARACTER && t.number === 9,
      ) &&
      suitedTiles.some(
        (t) => t.suite === SuitedTileType.DOTS && t.number === 1,
      ) &&
      suitedTiles.some(
        (t) => t.suite === SuitedTileType.DOTS && t.number === 9,
      );

    if (!hasAllWinds || !hasAllDragons || !hasAllTerminals) {
      return DEFAULT_NO_SCORE;
    }

    // Must have exactly 13 unique tile types, with one having count of 2
    if (tileCount.size !== 13) {
      return DEFAULT_NO_SCORE;
    }

    const counts = Array.from(tileCount.values());
    const hasPair = counts.filter((c) => c === 2).length === 1;
    const hasElevenSingles = counts.filter((c) => c === 1).length === 12;

    return hasPair && hasElevenSingles ? SPECIAL_HAND_SCORE : DEFAULT_NO_SCORE;
  });

  // Special Hand 2: Heaven's Hand
  heavensHand = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const discard = this.tableStore.discard();

    if (currentPlayer.wind !== WindType.EAST || discard.length !== 0) {
      return DEFAULT_NO_SCORE;
    }

    // Check if player has a valid winning hand
    if (!this.hasValidWinningHand()) {
      return DEFAULT_NO_SCORE;
    }

    return SPECIAL_HAND_SCORE;
  });

  // Special Hand 3: Earth's Hand
  earthsHand = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const discard = this.tableStore.discard();
    const drawnFromDeadWall = this.tableStore.drawnFromDeadWall();

    if (
      currentPlayer.wind !== WindType.EAST ||
      !drawnFromDeadWall ||
      discard.length !== 0
    ) {
      return DEFAULT_NO_SCORE;
    }

    // Check if player has a valid winning hand
    if (!this.hasValidWinningHand()) {
      return DEFAULT_NO_SCORE;
    }

    return SPECIAL_HAND_SCORE;
  });

  // Special Hand 4: All Hidden Pung/Kong Hand
  allHiddenPungKong = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;
    const exposedTiles = currentPlayer.exposedTiles;

    if (!this.isValidHandSize() || exposedTiles.length !== 0) {
      return DEFAULT_NO_SCORE;
    }

    // All tiles must be suited (no honours)
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
        const clone = this.counts().map((arr) => arr.slice());
        clone[suitIndex][n] -= 2; // remove pair (eyes)

        if (this.canFormAllPungs(clone)) {
          return SPECIAL_HAND_SCORE;
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Special Hand 5: 4 Small Winds
  fourSmallWinds = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (!this.isValidHandSize()) {
      return DEFAULT_NO_SCORE;
    }

    const windCounts = this.countWinds(tiles);
    const windCountValues = [
      windCounts.get(WindType.EAST) ?? 0,
      windCounts.get(WindType.SOUTH) ?? 0,
      windCounts.get(WindType.WEST) ?? 0,
      windCounts.get(WindType.NORTH) ?? 0,
    ];

    // Need 3 pungs/kongs (count >= 3) and 1 pair (count === 2)
    const pungCount = windCountValues.filter((c) => c >= 3).length;
    const pairCount = windCountValues.filter((c) => c === 2).length;

    if (pungCount !== 3 || pairCount !== 1) {
      return DEFAULT_NO_SCORE;
    }

    // Remaining tiles must form 1 meld (3 for pung/chi, 4 for kong)
    const windTileCount = windCountValues.reduce((sum, c) => sum + c, 0);
    const remainingTileCount = tiles.length - windTileCount;

    if (remainingTileCount < 3 || remainingTileCount > 4) {
      return DEFAULT_NO_SCORE;
    }

    // Check if remaining tiles can form a meld (chi, pung, or kong)
    const nonWindTiles = tiles.filter((t) => {
      if (t.type !== TileType.HONOUR) return true;
      const ht = t as HonourTile;
      return ht.honour !== HonourTileType.WIND;
    });

    if (!this.canFormSingleMeld(nonWindTiles)) {
      return DEFAULT_NO_SCORE;
    }

    return SPECIAL_HAND_SCORE;
  });

  // Special Hand 6: 4 Big Winds
  fourBigWinds = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (!this.isValidHandSize()) {
      return DEFAULT_NO_SCORE;
    }

    const windCounts = this.countWinds(tiles);

    // All 4 winds must have count >= 3 (pungs/kongs)
    const hasAllWindPungs =
      (windCounts.get(WindType.EAST) ?? 0) >= 3 &&
      (windCounts.get(WindType.SOUTH) ?? 0) >= 3 &&
      (windCounts.get(WindType.WEST) ?? 0) >= 3 &&
      (windCounts.get(WindType.NORTH) ?? 0) >= 3;

    if (!hasAllWindPungs) {
      return DEFAULT_NO_SCORE;
    }

    // Remaining 2 tiles must form a pair
    const windTileCount = Array.from(windCounts.values()).reduce(
      (sum, c) => sum + c,
      0,
    );

    if (tiles.length - windTileCount !== 2) {
      return DEFAULT_NO_SCORE;
    }

    // Get remaining tiles and check if they form a pair
    const nonWindTiles = tiles.filter((t) => {
      if (t.type !== TileType.HONOUR) return true;
      const ht = t as HonourTile;
      return ht.honour !== HonourTileType.WIND;
    });

    if (nonWindTiles.length === 2) {
      const key1 = this.getTileKey(nonWindTiles[0]);
      const key2 = this.getTileKey(nonWindTiles[1]);
      if (key1 === key2) {
        return SPECIAL_HAND_SCORE;
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Special Hand 7: 3 Big Dragons
  threeBigDragons = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (!this.isValidHandSize()) {
      return DEFAULT_NO_SCORE;
    }

    const dragonCounts = this.countDragons(tiles);

    // All 3 dragons must have count >= 3 (pungs/kongs)
    const hasAllDragonPungs =
      (dragonCounts.get(DragonType.RED) ?? 0) >= 3 &&
      (dragonCounts.get(DragonType.GREEN) ?? 0) >= 3 &&
      (dragonCounts.get(DragonType.WHITE) ?? 0) >= 3;

    if (!hasAllDragonPungs) {
      return DEFAULT_NO_SCORE;
    }

    // Remaining tiles must form 1 meld + 1 pair (5 tiles for pung/chi, 6 for kong)
    const dragonTileCount = Array.from(dragonCounts.values()).reduce(
      (sum, c) => sum + c,
      0,
    );

    const remainingTileCount = tiles.length - dragonTileCount;
    if (remainingTileCount < 5 || remainingTileCount > 6) {
      return DEFAULT_NO_SCORE;
    }

    // Get remaining tiles and check if they form 1 meld + 1 pair
    const nonDragonTiles = tiles.filter((t) => {
      if (t.type !== TileType.HONOUR) return true;
      const ht = t as HonourTile;
      return ht.honour !== HonourTileType.DRAGON;
    });

    // Try each possible pair
    for (let i = 0; i < nonDragonTiles.length; i++) {
      for (let j = i + 1; j < nonDragonTiles.length; j++) {
        const key1 = this.getTileKey(nonDragonTiles[i]);
        const key2 = this.getTileKey(nonDragonTiles[j]);

        if (key1 === key2) {
          // Found a pair, check if remaining tiles form a meld (3 for pung/chi, 4 for kong)
          const remaining = nonDragonTiles.filter(
            (_, idx) => idx !== i && idx !== j,
          );
          if (this.canFormSingleMeld(remaining)) {
            return SPECIAL_HAND_SCORE;
          }
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Special Hand 8: All Terminal Hand
  allTerminalHand = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (!this.isValidHandSize()) {
      return DEFAULT_NO_SCORE;
    }

    // All tiles must be suited (no honours)
    if (tiles.some((t) => t.type !== TileType.SUITED)) {
      return DEFAULT_NO_SCORE;
    }

    // All suited tiles must be terminals (1 or 9)
    const suitedTiles = tiles as SuitedTile[];
    if (suitedTiles.some((t) => t.number !== 1 && t.number !== 9)) {
      return DEFAULT_NO_SCORE;
    }

    // Must form 4 pungs + eyes (can't have chis with only 1s and 9s)
    // Try every possible pair choice
    for (let s = 0; s < SUITE_COUNT; s++) {
      for (let n of [1, 9]) {
        if (this.counts()[s][n] >= 2) {
          const clone = this.counts().map((arr) => arr.slice());
          clone[s][n] -= 2; // remove pair (eyes)

          if (this.canFormAllPungs(clone)) {
            return SPECIAL_HAND_SCORE;
          }
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Special Hand 9: All Honours Hand
  allHonoursHand = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (!this.isValidHandSize()) {
      return DEFAULT_NO_SCORE;
    }

    // All tiles must be honours (winds or dragons)
    if (tiles.some((t) => t.type !== TileType.HONOUR)) {
      return DEFAULT_NO_SCORE;
    }

    // Count each honour tile type
    const tileCount = new Map<string, number>();
    tiles.forEach((tile) => {
      const key = this.getTileKey(tile);
      tileCount.set(key, (tileCount.get(key) ?? 0) + 1);
    });

    // Try each possible pair for eyes
    for (const [key, count] of tileCount.entries()) {
      if (count >= 2) {
        // Try this as the pair
        const tempCount = new Map(tileCount);
        tempCount.set(key, count - 2);

        // Check if remaining tiles form 4 pungs/kongs (each count must be 0, 3, or 4)
        let canFormPungs = true;
        for (const [_, c] of tempCount.entries()) {
          if (c === 1 || c === 2) {
            canFormPungs = false;
            break;
          }
        }

        if (canFormPungs) {
          return SPECIAL_HAND_SCORE;
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Special Hand 10: 9 Connected Sons
  nineConnectedSons = computed<number>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (tiles.length !== REQUIRED_TILES) {
      return DEFAULT_NO_SCORE;
    }

    // All tiles must be suited (no honours)
    if (tiles.some((t) => t.type !== TileType.SUITED)) {
      return DEFAULT_NO_SCORE;
    }

    // All tiles must be from the same suit
    const suitsUsed = new Set<number>();
    tiles.forEach((t) => suitsUsed.add((t as SuitedTile).suite));
    if (suitsUsed.size !== 1) {
      return DEFAULT_NO_SCORE;
    }

    // Need: 3x1, 1x2, 1x3, 1x4, 1x5, 1x6, 1x7, 1x8, 3x9, plus 1 more for eyes
    const suitIndex = Array.from(suitsUsed)[0];
    const counts = this.counts()[suitIndex];

    // Check base requirements
    if (
      counts[1] < 3 ||
      counts[2] < 1 ||
      counts[3] < 1 ||
      counts[4] < 1 ||
      counts[5] < 1 ||
      counts[6] < 1 ||
      counts[7] < 1 ||
      counts[8] < 1 ||
      counts[9] < 3
    ) {
      return DEFAULT_NO_SCORE;
    }

    // Total should be 14 tiles
    const total = counts.reduce((sum, c) => sum + c, 0);
    if (total !== REQUIRED_TILES) {
      return DEFAULT_NO_SCORE;
    }

    // One number should have 1 extra for the eye
    // Valid configurations:
    // - 4x1, 1x2-8, 3x9 (eye is 1)
    // - 3x1, 2x(any 2-8), 1x(others 2-8), 3x9 (eye is 2-8)
    // - 3x1, 1x2-8, 4x9 (eye is 9)
    const hasValidEye =
      counts[1] === 4 || // eye is 1
      counts[9] === 4 || // eye is 9
      [2, 3, 4, 5, 6, 7, 8].some((n) => counts[n] === 2); // eye is 2-8

    return hasValidEye ? SPECIAL_HAND_SCORE : DEFAULT_NO_SCORE;
  });

  // Total points (mutually exclusive - return first detected)
  totalPoints = computed<number>(() => {
    return (
      this.thirteenOrphans() ||
      this.heavensHand() ||
      this.earthsHand() ||
      this.allHiddenPungKong() ||
      this.fourSmallWinds() ||
      this.fourBigWinds() ||
      this.threeBigDragons() ||
      this.allTerminalHand() ||
      this.allHonoursHand() ||
      this.nineConnectedSons()
    );
  });

  hasSpecialHand(): boolean {
    return this.totalPoints() > 0;
  }

  // Helper Methods

  private getTileKey(tile: Tile): string {
    const type = tile.type;
    if (tile.type === TileType.SUITED) {
      const st = tile as SuitedTile;
      return `${type}-${st.suite}-${st.number}`;
    } else if (tile.type === TileType.HONOUR) {
      const ht = tile as HonourTile;
      return `${type}-${ht.honour}-${ht.value}`;
    }
    return `${type}`;
  }

  private countWinds(tiles: Tile[]): Map<WindType, number> {
    const windCounts = new Map<WindType, number>([
      [WindType.EAST, 0],
      [WindType.SOUTH, 0],
      [WindType.WEST, 0],
      [WindType.NORTH, 0],
    ]);

    tiles
      .filter((t) => t.type === TileType.HONOUR)
      .forEach((t) => {
        const ht = t as HonourTile;
        if (ht.honour === HonourTileType.WIND) {
          const currentCount = windCounts.get(ht.value as WindType) ?? 0;
          windCounts.set(ht.value as WindType, currentCount + 1);
        }
      });

    return windCounts;
  }

  private countDragons(tiles: Tile[]): Map<DragonType, number> {
    const dragonCounts = new Map<DragonType, number>([
      [DragonType.RED, 0],
      [DragonType.GREEN, 0],
      [DragonType.WHITE, 0],
    ]);

    tiles
      .filter((t) => t.type === TileType.HONOUR)
      .forEach((t) => {
        const ht = t as HonourTile;
        if (ht.honour === HonourTileType.DRAGON) {
          const currentCount = dragonCounts.get(ht.value as DragonType) ?? 0;
          dragonCounts.set(ht.value as DragonType, currentCount + 1);
        }
      });

    return dragonCounts;
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

  private canFormSingleMeld(tiles: Tile[]): boolean {
    // Check for kong (4 of the same)
    if (tiles.length === 4) {
      const key = this.getTileKey(tiles[0]);
      return tiles.every((t) => this.getTileKey(t) === key);
    }

    if (tiles.length !== 3) {
      return false;
    }

    // Check if it's a pung (3 of the same)
    const key1 = this.getTileKey(tiles[0]);
    const key2 = this.getTileKey(tiles[1]);
    const key3 = this.getTileKey(tiles[2]);

    if (key1 === key2 && key2 === key3) {
      return true; // Pung
    }

    // Check if it's a chi (sequence)
    const suitedTiles = tiles.filter(
      (t) => t.type === TileType.SUITED,
    ) as SuitedTile[];

    if (suitedTiles.length === 3) {
      // All suited, check if same suit and consecutive
      const suite = suitedTiles[0].suite;
      if (suitedTiles.every((t) => t.suite === suite)) {
        const numbers = suitedTiles.map((t) => t.number).sort((a, b) => a - b);
        if (numbers[1] === numbers[0] + 1 && numbers[2] === numbers[1] + 1) {
          return true; // Chi
        }
      }
    }

    return false;
  }

  private hasValidWinningHand(): boolean {
    // Simplified check: any hand with valid structure could be a winning hand
    // This checks if tiles can form 4 melds + 1 pair
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    if (!this.isValidHandSize()) {
      return false;
    }

    // Try to form any valid hand structure
    // For simplicity, we'll check if it matches any of the basic patterns
    // A complete implementation would need to check all possible meld combinations

    // Check for 7 pairs
    const tileCount = new Map<string, number>();
    tiles.forEach((tile) => {
      const key = this.getTileKey(tile);
      tileCount.set(key, (tileCount.get(key) ?? 0) + 1);
    });

    if (
      tileCount.size === 7 &&
      Array.from(tileCount.values()).every((c) => c === 2)
    ) {
      return true;
    }

    // Check for standard 4 melds + pair pattern
    // This is simplified - a full implementation would need recursive checking
    return tileCount.size >= 5 && tileCount.size <= 13;
  }
}
