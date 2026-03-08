import { BonusTile } from '../model/bonus-tile';
import { HonourTile } from '../model/honour-tile';
import { MeldType, SelectedMeld } from '../model/player';
import { SuitedTile, SuitedTileType } from '../model/suited-tile';
import { Tile } from '../model/tile';
import { TileType } from '../model/tile-type';

export interface PossibleMeld {
  meldType: MeldType;
  tiles: Tile[];
  tileKey?: string;
  suite?: SuitedTileType;
  startNumber?: number;
  label: string;
}

export interface MeldTransition {
  meldId: string;
  newTileId?: string;
  removedTileId?: string;
}

export function getTileKey(tile: Tile): string {
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

function getUsedTileIds(selectedMelds: SelectedMeld[]): Set<string> {
  const usedTileIds = new Set<string>();
  selectedMelds.forEach((m) => {
    m.tileIds.forEach((id) => usedTileIds.add(id));
  });
  return usedTileIds;
}

function detectPossibleChis(
  hovered: SuitedTile,
  freeTiles: Tile[],
): PossibleMeld[] {
  const suite = hovered.suite;
  const number = hovered.number;
  const options: PossibleMeld[] = [];

  const suitedFreeTiles = freeTiles.filter(
    (t) => t.type === TileType.SUITED && (t as SuitedTile).suite === suite,
  ) as SuitedTile[];

  const tilesByNumber = new Map<number, SuitedTile[]>();
  suitedFreeTiles.forEach((tile) => {
    if (!tilesByNumber.has(tile.number)) {
      tilesByNumber.set(tile.number, []);
    }
    tilesByNumber.get(tile.number)!.push(tile);
  });

  const patterns = [
    { start: number - 2, nums: [number - 2, number - 1, number] },
    { start: number - 1, nums: [number - 1, number, number + 1] },
    { start: number, nums: [number, number + 1, number + 2] },
  ];

  for (const pattern of patterns) {
    if (pattern.nums[0] < 1 || pattern.nums[2] > 9) continue;

    const t1 = tilesByNumber.get(pattern.nums[0]);
    const t2 = tilesByNumber.get(pattern.nums[1]);
    const t3 = tilesByNumber.get(pattern.nums[2]);

    if (t1?.length && t2?.length && t3?.length) {
      options.push({
        meldType: 'chi',
        tiles: [t1[0], t2[0], t3[0]],
        suite,
        startNumber: pattern.start,
        label: 'CHI',
      });
    }
  }

  return options;
}

function detectPossiblePungsKongs(
  hovered: Tile,
  freeTiles: Tile[],
): PossibleMeld[] {
  const options: PossibleMeld[] = [];
  const hoveredKey = getTileKey(hovered);

  const matchingTiles = freeTiles.filter((t) => getTileKey(t) === hoveredKey);

  if (matchingTiles.length >= 3) {
    options.push({
      meldType: 'pung',
      tiles: matchingTiles.slice(0, 3),
      tileKey: hoveredKey,
      label: 'Pung',
    });
  }

  if (matchingTiles.length >= 4) {
    options.push({
      meldType: 'kong',
      tiles: matchingTiles.slice(0, 4),
      tileKey: hoveredKey,
      label: 'Kong',
    });
  }

  return options;
}

export function computeTransitionOptions(
  hovered: Tile,
  meld: SelectedMeld,
  availableTiles: Tile[],
  selectedMelds: SelectedMeld[],
): PossibleMeld[] {
  const options: PossibleMeld[] = [];

  if (meld.meldType === 'pung') {
    const tileKey = getTileKey(hovered);
    const usedTileIds = getUsedTileIds(selectedMelds);
    const freeTiles = availableTiles.filter(
      (t) => !usedTileIds.has(t.id) && getTileKey(t) === tileKey,
    );

    if (freeTiles.length > 0) {
      const meldTiles = availableTiles.filter((t) =>
        meld.tileIds.includes(t.id),
      );
      options.push({
        meldType: 'kong',
        tiles: [...meldTiles, freeTiles[0]],
        tileKey,
        label: 'Upgrade to Kong',
      });
    }
  } else if (meld.meldType === 'kong') {
    const meldTiles = availableTiles.filter((t) => meld.tileIds.includes(t.id));
    if (meldTiles.length === 4) {
      options.push({
        meldType: 'pung',
        tiles: meldTiles.slice(0, 3),
        tileKey: meld.tileKey,
        label: 'Downgrade to Pung',
      });
    }
  }

  return options;
}

export function computePossibleMelds(
  hovered: Tile,
  availableTiles: Tile[],
  selectedMelds: SelectedMeld[],
): PossibleMeld[] {
  const usedTileIds = getUsedTileIds(selectedMelds);
  const freeTiles = availableTiles.filter((t) => !usedTileIds.has(t.id));
  const options: PossibleMeld[] = [];

  if (hovered.type === TileType.SUITED) {
    options.push(...detectPossibleChis(hovered as SuitedTile, freeTiles));
  }

  if (hovered.type !== TileType.UNKNOWN && hovered.type !== TileType.BONUS) {
    options.push(...detectPossiblePungsKongs(hovered, freeTiles));
  }

  return options;
}
