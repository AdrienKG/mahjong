import { SuitedTile, SuitedTileType } from '../model/suited-tile';
import { TileType } from '../model/tile-type';
import { HonourTileType } from '../model/honour-tile';
import { WindType } from '../model/wind-type';
import {
  getTileKey,
  computePossibleMelds,
  computeTransitionOptions,
} from './meld-detection';

function bamboo(id: string, number: number): SuitedTile {
  return { id, type: TileType.SUITED, suite: SuitedTileType.BAMBOO, number };
}

function wind(id: string, value: WindType) {
  return { id, type: TileType.HONOUR, honour: HonourTileType.WIND, value };
}

describe('meld-detection', () => {
  describe('getTileKey', () => {
    it('should generate key for suited tile', () => {
      expect(getTileKey(bamboo('1', 3))).toBe(
        `${TileType.SUITED}-${SuitedTileType.BAMBOO}-3`,
      );
    });

    it('should generate key for honour tile', () => {
      expect(getTileKey(wind('1', WindType.EAST))).toBe(
        `${TileType.HONOUR}-${HonourTileType.WIND}-${WindType.EAST}`,
      );
    });

    it('should generate key for unknown tile', () => {
      expect(getTileKey({ id: '1', type: TileType.UNKNOWN })).toBe(
        `${TileType.UNKNOWN}`,
      );
    });
  });

  describe('computePossibleMelds', () => {
    it('should detect a chi pattern', () => {
      const tiles = [bamboo('a', 1), bamboo('b', 2), bamboo('c', 3)];
      const melds = computePossibleMelds(tiles[0], tiles, []);
      const chis = melds.filter((m) => m.meldType === 'chi');
      expect(chis.length).toBeGreaterThan(0);
      expect(chis[0].tiles).toHaveLength(3);
    });

    it('should detect a pung', () => {
      const tiles = [bamboo('a', 5), bamboo('b', 5), bamboo('c', 5)];
      const melds = computePossibleMelds(tiles[0], tiles, []);
      const pungs = melds.filter((m) => m.meldType === 'pung');
      expect(pungs).toHaveLength(1);
      expect(pungs[0].tiles).toHaveLength(3);
    });

    it('should detect a kong', () => {
      const tiles = [
        bamboo('a', 5),
        bamboo('b', 5),
        bamboo('c', 5),
        bamboo('d', 5),
      ];
      const melds = computePossibleMelds(tiles[0], tiles, []);
      const kongs = melds.filter((m) => m.meldType === 'kong');
      expect(kongs).toHaveLength(1);
      expect(kongs[0].tiles).toHaveLength(4);
    });

    it('should return empty for unknown tiles', () => {
      const tile = { id: 'x', type: TileType.UNKNOWN };
      const melds = computePossibleMelds(tile, [tile], []);
      expect(melds).toHaveLength(0);
    });

    it('should exclude tiles already in selected melds', () => {
      const tiles = [bamboo('a', 5), bamboo('b', 5), bamboo('c', 5)];
      const selectedMelds = [
        {
          id: 'm1',
          meldType: 'pung' as const,
          tileIds: ['a', 'b', 'c'],
        },
      ];
      const free = bamboo('d', 5);
      const melds = computePossibleMelds(free, [...tiles, free], selectedMelds);
      const pungs = melds.filter((m) => m.meldType === 'pung');
      expect(pungs).toHaveLength(0);
    });
  });

  describe('computeTransitionOptions', () => {
    it('should offer upgrade from pung to kong', () => {
      const tiles = [
        bamboo('a', 5),
        bamboo('b', 5),
        bamboo('c', 5),
        bamboo('d', 5),
      ];
      const meld = {
        id: 'm1',
        meldType: 'pung' as const,
        tileIds: ['a', 'b', 'c'],
      };
      const options = computeTransitionOptions(tiles[0], meld, tiles, [meld]);
      expect(options).toHaveLength(1);
      expect(options[0].label).toBe('Upgrade to Kong');
    });

    it('should offer downgrade from kong to pung', () => {
      const tiles = [
        bamboo('a', 5),
        bamboo('b', 5),
        bamboo('c', 5),
        bamboo('d', 5),
      ];
      const meld = {
        id: 'm1',
        meldType: 'kong' as const,
        tileIds: ['a', 'b', 'c', 'd'],
      };
      const options = computeTransitionOptions(tiles[0], meld, tiles, [meld]);
      expect(options).toHaveLength(1);
      expect(options[0].label).toBe('Downgrade to Pung');
    });
  });
});
