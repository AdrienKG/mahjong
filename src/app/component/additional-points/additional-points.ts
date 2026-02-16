import { Component, computed, inject } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { BonusTile, BonusTileType } from '../../model/bonus-tile';
import { DragonType } from '../../model/dragon-type';
import { HonourTile, HonourTileType } from '../../model/honour-tile';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { Tile } from '../../model/tile';
import { TileType } from '../../model/tile-type';
import { WindType } from '../../model/wind-type';
import { TableStore } from '../../store/table-store';

const DEFAULT_NO_SCORE = 0;
const SUITE_COUNT = 3;

interface Chi {
  suite: SuitedTileType;
  startNumber: number;
  tiles: Tile[];
}

interface Pung {
  tile: Tile;
  count: number;
  isExposed: boolean;
}

@Component({
  selector: 'app-additional-points',
  imports: [MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
  templateUrl: './additional-points.html',
  styleUrl: './additional-points.scss',
})
export class AdditionalPoints {
  private tableStore = inject(TableStore);

  // Shared computed for tile counting
  private counts = computed<number[][]>(() => {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];
    const counts: number[][] = Array.from({ length: SUITE_COUNT }, () =>
      Array(10).fill(0),
    );
    allTiles.forEach((t) => {
      if (t.type === TileType.SUITED) {
        const st = t as SuitedTile;
        counts[st.suite][st.number]++;
      }
    });
    return counts;
  });

  // Helper: Generate unique tile key for counting
  private getTileKey(tile: Tile): string {
    const type = tile.type;

    if (type === TileType.SUITED) {
      const st = tile as SuitedTile;
      return `${type}-${st.suite}-${st.number}`;
    } else if (type === TileType.HONOUR) {
      const ht = tile as HonourTile;
      return `${type}-${ht.honour}-${ht.value}`;
    } else if (type === TileType.BONUS) {
      const bt = tile as BonusTile;
      return `${type}-${bt.bonus}-${bt.number}`;
    }

    return `${type}`;
  }

  // Helper: Count winds in tiles
  private countWinds(tiles: Tile[]): Map<WindType, number> {
    const windCounts = new Map<WindType, number>();
    windCounts.set(WindType.EAST, 0);
    windCounts.set(WindType.SOUTH, 0);
    windCounts.set(WindType.WEST, 0);
    windCounts.set(WindType.NORTH, 0);

    tiles.forEach((tile) => {
      if (tile.type === TileType.HONOUR) {
        const ht = tile as HonourTile;
        if (ht.honour === HonourTileType.WIND) {
          const currentCount = windCounts.get(ht.value as WindType) ?? 0;
          windCounts.set(ht.value as WindType, currentCount + 1);
        }
      }
    });

    return windCounts;
  }

  // Helper: Count dragons in tiles
  private countDragons(tiles: Tile[]): Map<DragonType, number> {
    const dragonCounts = new Map<DragonType, number>();
    dragonCounts.set(DragonType.GREEN, 0);
    dragonCounts.set(DragonType.RED, 0);
    dragonCounts.set(DragonType.WHITE, 0);

    tiles.forEach((tile) => {
      if (tile.type === TileType.HONOUR) {
        const ht = tile as HonourTile;
        if (ht.honour === HonourTileType.DRAGON) {
          const currentCount = dragonCounts.get(ht.value as DragonType) ?? 0;
          dragonCounts.set(ht.value as DragonType, currentCount + 1);
        }
      }
    });

    return dragonCounts;
  }

  // Helper: Detect all pungs (3+ identical tiles)
  private detectPungs(): Pung[] {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];
    const tileMap = new Map<string, { tile: Tile; count: number }>();

    allTiles.forEach((tile) => {
      const key = this.getTileKey(tile);
      const entry = tileMap.get(key);
      if (entry) {
        entry.count++;
      } else {
        tileMap.set(key, { tile, count: 1 });
      }
    });

    const pungs: Pung[] = [];
    tileMap.forEach((entry, key) => {
      if (entry.count >= 3) {
        const isExposed = player.exposedTiles.some(
          (t) => this.getTileKey(t) === key,
        );
        pungs.push({ tile: entry.tile, count: entry.count, isExposed });
      }
    });

    return pungs;
  }

  // Helper: Detect all kongs (4 identical tiles)
  private detectKongs(): Pung[] {
    return this.detectPungs().filter((p) => p.count === 4);
  }

  // Helper: Detect all chis (consecutive sequences)
  private detectChis(): Chi[] {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];
    const chis: Chi[] = [];

    // For each suite, detect consecutive sequences
    for (let suite = 0; suite < SUITE_COUNT; suite++) {
      const suiteTiles = allTiles.filter(
        (t) => t.type === TileType.SUITED && (t as SuitedTile).suite === suite,
      ) as SuitedTile[];

      // Count tiles per number in this suite
      const counts = Array(10).fill(0);
      suiteTiles.forEach((t) => counts[t.number]++);

      // Find all possible chis (starting from 1-7)
      for (let start = 1; start <= 7; start++) {
        const available = Math.min(
          counts[start],
          counts[start + 1],
          counts[start + 2],
        );

        // Add all instances of this chi pattern
        for (let i = 0; i < available; i++) {
          const chiTiles = suiteTiles.filter(
            (t) =>
              t.number === start ||
              t.number === start + 1 ||
              t.number === start + 2,
          );
          if (chiTiles.length >= 3) {
            chis.push({
              suite: suite as SuitedTileType,
              startNumber: start,
              tiles: chiTiles.slice(0, 3),
            });
          }
        }
      }
    }

    return chis;
  }

  // Helper: Check if tiles cover range 1-9 in a suite
  private coversRange1to9InSuite(suite: SuitedTileType): boolean {
    const c = this.counts();
    for (let num = 1; num <= 9; num++) {
      if (c[suite][num] === 0) return false;
    }
    return true;
  }

  // Helper: Count how many suites are used
  private countSuitesUsed(): number {
    const c = this.counts();
    let suitesUsed = 0;

    for (let s = 0; s < SUITE_COUNT; s++) {
      const hasTiles = c[s].some((count) => count > 0);
      if (hasTiles) suitesUsed++;
    }

    return suitesUsed;
  }

  // ========== 1-POINT RULES ==========

  // Rule 1: Eyes (2, 5, 8 only)
  eyesSpecial = computed<number>(() => {
    const specialNumbers = [2, 5, 8];
    const c = this.counts();

    for (let s = 0; s < SUITE_COUNT; s++) {
      for (const num of specialNumbers) {
        if (c[s][num] === 2) return 1;
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Rule 2: Pung of Dragons
  pungOfDragons = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];
    const dragonCounts = this.countDragons(allTiles);

    const hasPung = Array.from(dragonCounts.values()).some((c) => c >= 3);
    return hasPung ? 1 : DEFAULT_NO_SCORE;
  });

  // Rule 3: Pung of Table Wind or Own Wind
  pungOfTableOrOwnWind = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];
    const windCounts = this.countWinds(allTiles);

    const tableWind = this.tableStore.wind();
    const ownWind = player.wind;

    const tableWindCount = windCounts.get(tableWind) ?? 0;
    const ownWindCount = windCounts.get(ownWind) ?? 0;

    return tableWindCount >= 3 || ownWindCount >= 3 ? 1 : DEFAULT_NO_SCORE;
  });

  // Rule 4: Self Touch (drawn from wall)
  selfTouch = computed<number>(() => {
    return this.tableStore.drawnFromWall() ? 1 : DEFAULT_NO_SCORE;
  });

  // Rule 5: Single Call [STUB]
  singleCall = computed<number>(() => {
    // TODO: Requires hand completion analysis to determine if only one tile type
    // would complete the hand. This is complex tenpai detection.
    // Future implementation needs: analyze all possible winning tiles
    return DEFAULT_NO_SCORE;
  });

  // Rule 6: Winning tile from dead wall
  deadWallDraw = computed<number>(() => {
    return this.tableStore.drawnFromDeadWall() ? 1 : DEFAULT_NO_SCORE;
  });

  // Rule 7: 15th from end
  drawn15FromEnd = computed<number>(() => {
    return this.tableStore.wall() === 14 ? 1 : DEFAULT_NO_SCORE;
  });

  // Rule 8: All simple numbers (2-8 only)
  allSimpleNumbers = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];

    const hasTerminalOrHonour = allTiles.some((t) => {
      if (t.type === TileType.HONOUR) return true;
      if (t.type === TileType.SUITED) {
        const st = t as SuitedTile;
        return st.number === 1 || st.number === 9;
      }
      return false;
    });

    return hasTerminalOrHonour ? DEFAULT_NO_SCORE : 1;
  });

  // Rule 9: Robbing the Kong [STUB]
  robbingKong = computed<number>(() => {
    // TODO: Requires game event tracking. Need to add 'robbedKong: boolean'
    // flag to TableState that gets set when player wins off another's kong declaration
    return DEFAULT_NO_SCORE;
  });

  // Rule 10: No Winds or Dragons (unless in hands 3, 4, 5)
  noWindsOrDragons = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];

    const hasHonours = allTiles.some((t) => t.type === TileType.HONOUR);
    if (hasHonours) return DEFAULT_NO_SCORE;

    // Check if exempt (hands 3, 4, 5 from hand-score)
    const inExemptHands =
      this.tableStore.allPungHand() > 0 ||
      this.tableStore.mixedHand() > 0 ||
      this.tableStore.little7PairsHand() > 0;

    return inExemptHands ? DEFAULT_NO_SCORE : 1;
  });

  // Rule 11: Terminal Pungs in All Pung hand
  terminalPungs = computed<number>(() => {
    const pungs = this.detectPungs();
    if (pungs.length === 0) return DEFAULT_NO_SCORE;

    const allTerminals = pungs.every((p) => {
      if (p.tile.type === TileType.SUITED) {
        const st = p.tile as SuitedTile;
        return st.number === 1 || st.number === 9;
      }
      return false;
    });

    return allTerminals && pungs.length >= 4 ? 1 : DEFAULT_NO_SCORE;
  });

  // Rule 12: Two Suit Dragon (1-9 using exactly 2 suits)
  twoSuitDragon = computed<number>(() => {
    const suitesUsed = this.countSuitesUsed();
    if (suitesUsed !== 2) return DEFAULT_NO_SCORE;

    // Check if both suites cover 1-9
    let suitesCovering1to9 = 0;
    for (let s = 0; s < SUITE_COUNT; s++) {
      if (this.coversRange1to9InSuite(s as SuitedTileType)) {
        suitesCovering1to9++;
      }
    }

    return suitesCovering1to9 === 2 ? 1 : DEFAULT_NO_SCORE;
  });

  // Rule 13: Little Flower (2 identical consecutive chis from different suits)
  littleFlower = computed<number>(() => {
    const chis = this.detectChis();

    for (let i = 0; i < chis.length; i++) {
      for (let j = i + 1; j < chis.length; j++) {
        if (
          chis[i].startNumber === chis[j].startNumber &&
          chis[i].suite !== chis[j].suite
        ) {
          // Found similar chis, check if there's a consecutive one
          const consecutiveChi = chis.find(
            (c) =>
              c.suite === chis[i].suite &&
              c.startNumber === chis[i].startNumber + 3,
          );
          if (consecutiveChi) return 1;
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Rule 14: Own Flower
  ownFlower = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const bonusTiles = player.tiles.filter((t) => t.type === TileType.BONUS);

    // Wind mapping: EAST=0, SOUTH=1, WEST=2, NORTH=3
    // Flower numbers: 1-4
    const windToFlowerNumber: Record<WindType, number> = {
      [WindType.EAST]: 1,
      [WindType.SOUTH]: 2,
      [WindType.WEST]: 3,
      [WindType.NORTH]: 4,
    };

    const expectedNumber = windToFlowerNumber[player.wind];
    const hasOwnFlower = bonusTiles.some(
      (t) =>
        t.type === TileType.BONUS &&
        (t as BonusTile).bonus === BonusTileType.FLOWER &&
        (t as BonusTile).number === expectedNumber,
    );

    return hasOwnFlower ? 1 : DEFAULT_NO_SCORE;
  });

  // Rule 14b: Own Season
  ownSeason = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const bonusTiles = player.tiles.filter((t) => t.type === TileType.BONUS);

    const windToSeasonNumber: Record<WindType, number> = {
      [WindType.EAST]: 1,
      [WindType.SOUTH]: 2,
      [WindType.WEST]: 3,
      [WindType.NORTH]: 4,
    };

    const expectedNumber = windToSeasonNumber[player.wind];
    const hasOwnSeason = bonusTiles.some(
      (t) =>
        t.type === TileType.BONUS &&
        (t as BonusTile).bonus === BonusTileType.SEASON &&
        (t as BonusTile).number === expectedNumber,
    );

    return hasOwnSeason ? 1 : DEFAULT_NO_SCORE;
  });

  // ========== 2-POINT RULES ==========

  // Rule 15: Bouquet/Garden (4 flowers OR 4 seasons, max 2 points)
  bouquetGarden = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const bonusTiles = player.tiles.filter((t) => t.type === TileType.BONUS);

    const flowers = bonusTiles.filter(
      (t) =>
        t.type === TileType.BONUS &&
        (t as BonusTile).bonus === BonusTileType.FLOWER,
    );
    const seasons = bonusTiles.filter(
      (t) =>
        t.type === TileType.BONUS &&
        (t as BonusTile).bonus === BonusTileType.SEASON,
    );

    return flowers.length === 4 || seasons.length === 4 ? 2 : DEFAULT_NO_SCORE;
  });

  // Rule 16: Double Winds (pung/kong of any 2 winds)
  doubleWinds = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];
    const windCounts = this.countWinds(allTiles);

    const windPungsCount = Array.from(windCounts.values()).filter(
      (c) => c >= 3,
    ).length;

    return windPungsCount >= 2 ? 2 : DEFAULT_NO_SCORE;
  });

  // Rule 17: Twelve Exposed Tiles
  twelveExposed = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    return player.exposedTiles.length === 12 ? 2 : DEFAULT_NO_SCORE;
  });

  // Rule 18: Twins (2 identical chis from same suit)
  twins = computed<number>(() => {
    const chis = this.detectChis();

    for (let i = 0; i < chis.length; i++) {
      for (let j = i + 1; j < chis.length; j++) {
        if (
          chis[i].suite === chis[j].suite &&
          chis[i].startNumber === chis[j].startNumber
        ) {
          return 2;
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Rule 19: Three Suit Dragon (chis covering 1-9 from all 3 suits)
  threeSuitDragon = computed<number>(() => {
    const suitesUsed = this.countSuitesUsed();
    if (suitesUsed !== 3) return DEFAULT_NO_SCORE;

    // Check if all 3 suites cover 1-9
    let suitesCovering1to9 = 0;
    for (let s = 0; s < SUITE_COUNT; s++) {
      if (this.coversRange1to9InSuite(s as SuitedTileType)) {
        suitesCovering1to9++;
      }
    }

    return suitesCovering1to9 === 3 ? 2 : DEFAULT_NO_SCORE;
  });

  // Rule 20: Any Kong
  anyKong = computed<number>(() => {
    const kongs = this.detectKongs();
    return kongs.length * 2;
  });

  // ========== 3-POINT RULES ==========

  // Rule 21: Five Doors (all 5 elements: Wind, Dragon, Bamboo, Character, Dots)
  fiveDoors = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    const allTiles = [...player.tiles, ...player.exposedTiles];

    const hasWind = allTiles.some(
      (t) =>
        t.type === TileType.HONOUR &&
        (t as HonourTile).honour === HonourTileType.WIND,
    );
    const hasDragon = allTiles.some(
      (t) =>
        t.type === TileType.HONOUR &&
        (t as HonourTile).honour === HonourTileType.DRAGON,
    );
    const hasBamboo = allTiles.some(
      (t) =>
        t.type === TileType.SUITED &&
        (t as SuitedTile).suite === SuitedTileType.BAMBOO,
    );
    const hasCharacter = allTiles.some(
      (t) =>
        t.type === TileType.SUITED &&
        (t as SuitedTile).suite === SuitedTileType.CHARACTER,
    );
    const hasDots = allTiles.some(
      (t) =>
        t.type === TileType.SUITED &&
        (t as SuitedTile).suite === SuitedTileType.DOTS,
    );

    return hasWind && hasDragon && hasBamboo && hasCharacter && hasDots
      ? 3
      : DEFAULT_NO_SCORE;
  });

  // Rule 22: Clear Dragon (1-9 same suit)
  clearDragon = computed<number>(() => {
    for (let s = 0; s < SUITE_COUNT; s++) {
      if (this.coversRange1to9InSuite(s as SuitedTileType)) {
        // Check if all tiles are from this suite
        const player = this.tableStore.entities()[0];
        const allTiles = [...player.tiles, ...player.exposedTiles];
        const suitedTiles = allTiles.filter(
          (t) => t.type === TileType.SUITED,
        ) as SuitedTile[];

        const allSameSuite = suitedTiles.every((t) => t.suite === s);
        if (allSameSuite) return 3;
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Rule 23: Three Sisters (3 similar chis from all 3 suits)
  threeSisters = computed<number>(() => {
    const chis = this.detectChis();

    // Group chis by startNumber
    const chisByStartNumber = new Map<number, Chi[]>();
    chis.forEach((chi) => {
      const existing = chisByStartNumber.get(chi.startNumber) ?? [];
      existing.push(chi);
      chisByStartNumber.set(chi.startNumber, existing);
    });

    // Check if any startNumber has chis from all 3 suites
    for (const [_, chisAtStart] of chisByStartNumber) {
      const suitesInGroup = new Set(chisAtStart.map((c) => c.suite));
      if (suitesInGroup.size === 3) return 3;
    }

    return DEFAULT_NO_SCORE;
  });

  // Rule 24: Concealed Mahjong
  concealedMahjong = computed<number>(() => {
    const player = this.tableStore.entities()[0];
    return player.exposedTiles.length === 0 ? 3 : DEFAULT_NO_SCORE;
  });

  // ========== 4-POINT RULES ==========

  // Rule 25: Sisters Pung (3 identical pung numbers same suit)
  sistersPung = computed<number>(() => {
    const pungs = this.detectPungs();
    const suitedPungs = pungs.filter(
      (p) => p.tile.type === TileType.SUITED,
    ) as { tile: SuitedTile; count: number; isExposed: boolean }[];

    // Group by suite
    const pungsBySuite = new Map<SuitedTileType, SuitedTile[]>();
    suitedPungs.forEach((p) => {
      const existing = pungsBySuite.get(p.tile.suite) ?? [];
      existing.push(p.tile);
      pungsBySuite.set(p.tile.suite, existing);
    });

    // Check if any suite has 3+ pungs with consecutive numbers
    for (const [_, tiles] of pungsBySuite) {
      if (tiles.length >= 3) {
        // Check for consecutive numbers
        const numbers = tiles.map((t) => t.number).sort((a, b) => a - b);
        for (let i = 0; i <= numbers.length - 3; i++) {
          if (
            numbers[i + 1] === numbers[i] + 1 &&
            numbers[i + 2] === numbers[i] + 2
          ) {
            return 4;
          }
        }
      }
    }

    return DEFAULT_NO_SCORE;
  });

  // Rule 26: Brothers Pung (3 same number pungs from each suit)
  brothersPung = computed<number>(() => {
    const pungs = this.detectPungs();
    const suitedPungs = pungs.filter(
      (p) => p.tile.type === TileType.SUITED,
    ) as { tile: SuitedTile; count: number; isExposed: boolean }[];

    // Group by number
    const pungsByNumber = new Map<number, SuitedTile[]>();
    suitedPungs.forEach((p) => {
      const existing = pungsByNumber.get(p.tile.number) ?? [];
      existing.push(p.tile);
      pungsByNumber.set(p.tile.number, existing);
    });

    // Check if any number has pungs from all 3 suites
    for (const [_, tiles] of pungsByNumber) {
      const suitesInGroup = new Set(tiles.map((t) => t.suite));
      if (suitesInGroup.size === 3) return 4;
    }

    return DEFAULT_NO_SCORE;
  });

  // ========== 6-POINT RULES ==========

  // Rule 27: Three identical chis same suit
  threeIdenticalChis = computed<number>(() => {
    const chis = this.detectChis();

    // Group chis by suite and startNumber
    const chiMap = new Map<string, number>();
    chis.forEach((chi) => {
      const key = `${chi.suite}-${chi.startNumber}`;
      chiMap.set(key, (chiMap.get(key) ?? 0) + 1);
    });

    // Check if any chi pattern appears 3 times
    for (const count of chiMap.values()) {
      if (count >= 3) return 6;
    }

    return DEFAULT_NO_SCORE;
  });

  // Rule 28: Kong on Kong [STUB]
  kongOnKong = computed<number>(() => {
    // TODO: Requires kong declaration tracking. Need to track when replacement
    // tile from one kong leads to declaring another kong.
    // Future implementation needs: MeldDeclaration[] tracking in Player model
    return DEFAULT_NO_SCORE;
  });

  // ========== TOTAL POINTS ==========

  totalPoints = computed<number>(() => {
    return (
      this.eyesSpecial() +
      this.pungOfDragons() +
      this.pungOfTableOrOwnWind() +
      this.selfTouch() +
      this.singleCall() +
      this.deadWallDraw() +
      this.drawn15FromEnd() +
      this.allSimpleNumbers() +
      this.robbingKong() +
      this.noWindsOrDragons() +
      this.terminalPungs() +
      this.twoSuitDragon() +
      this.littleFlower() +
      this.ownFlower() +
      this.ownSeason() +
      this.bouquetGarden() +
      this.doubleWinds() +
      this.twelveExposed() +
      this.twins() +
      this.threeSuitDragon() +
      this.anyKong() +
      this.fiveDoors() +
      this.clearDragon() +
      this.threeSisters() +
      this.concealedMahjong() +
      this.sistersPung() +
      this.brothersPung() +
      this.threeIdenticalChis() +
      this.kongOnKong()
    );
  });
}
