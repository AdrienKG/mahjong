import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalPoints } from './additional-points';
import { TableStore } from '../../store/table-store';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { TileType } from '../../model/tile-type';
import { HonourTile, HonourTileType } from '../../model/honour-tile';
import {
  BonusTile,
  BonusTileColor,
  BonusTileType,
} from '../../model/bonus-tile';
import { WindType } from '../../model/wind-type';
import { DragonType } from '../../model/dragon-type';
import { v4 as uuidv4 } from 'uuid';
import { patchState } from '@ngrx/signals';
import { updateEntity } from '@ngrx/signals/entities';

describe('AdditionalPoints', () => {
  let component: AdditionalPoints;
  let fixture: ComponentFixture<AdditionalPoints>;
  let tableStore: InstanceType<typeof TableStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalPoints],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalPoints);
    component = fixture.componentInstance;
    tableStore = TestBed.inject(TableStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Helper functions
  function createSuitedTile(suite: SuitedTileType, number: number): SuitedTile {
    return { id: uuidv4(), type: TileType.SUITED, suite, number };
  }

  function createWindTile(wind: WindType): HonourTile {
    return {
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.WIND,
      value: wind,
    } as HonourTile;
  }

  function createDragonTile(dragon: DragonType): HonourTile {
    return {
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.DRAGON,
      value: dragon,
    } as HonourTile;
  }

  function createFlowerTile(number: number): BonusTile {
    return {
      id: uuidv4(),
      type: TileType.BONUS,
      bonus: BonusTileType.FLOWER,
      number,
      color: BonusTileColor.BLACK,
    } as BonusTile;
  }

  function createSeasonTile(number: number): BonusTile {
    return {
      id: uuidv4(),
      type: TileType.BONUS,
      bonus: BonusTileType.SEASON,
      number,
      color: BonusTileColor.RED,
    } as BonusTile;
  }

  function setPlayerTiles(tiles: any[]) {
    const currentPlayer = tableStore.entities()[0];
    patchState(
      tableStore as any,
      updateEntity({ id: currentPlayer.id, changes: { tiles } as any }),
    );
  }

  function setPlayerState(overrides: {
    tiles?: any[];
    exposedTiles?: any[];
    wind?: WindType;
  }) {
    const currentPlayer = tableStore.entities()[0];
    patchState(
      tableStore as any,
      updateEntity({ id: currentPlayer.id, changes: overrides as any }),
    );
  }

  // ==================== OWN FLOWER ====================

  describe('ownFlower', () => {
    it('should score 1 for East wind player with flower 1 in tiles', () => {
      const tiles = [
        // Valid hand tiles
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 8),
        createSuitedTile(SuitedTileType.BAMBOO, 9),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        // Own flower (flower 1 = East)
        createFlowerTile(1),
      ];
      setPlayerState({ tiles, wind: WindType.EAST });
      expect(component.ownFlower()).toBe(1);
    });

    it('should score 0 for East wind player with flower 2 (not own)', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 8),
        createSuitedTile(SuitedTileType.BAMBOO, 9),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createFlowerTile(2), // South's flower, not East's
      ];
      setPlayerState({ tiles, wind: WindType.EAST });
      expect(component.ownFlower()).toBe(0);
    });

    it('should score 1 for South wind player with flower 2', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.DOTS, 1),
        createSuitedTile(SuitedTileType.DOTS, 1),
        createFlowerTile(2),
      ];
      setPlayerState({ tiles, wind: WindType.SOUTH });
      expect(component.ownFlower()).toBe(1);
    });
  });

  // ==================== OWN SEASON ====================

  describe('ownSeason', () => {
    it('should score 1 for East wind player with season 1 in tiles', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSeasonTile(1),
      ];
      setPlayerState({ tiles, wind: WindType.EAST });
      expect(component.ownSeason()).toBe(1);
    });

    it('should score 0 for East wind player with season 2 (not own)', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSeasonTile(2),
      ];
      setPlayerState({ tiles, wind: WindType.EAST });
      expect(component.ownSeason()).toBe(0);
    });

    it('should score 1 for West wind player with season 3', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.DOTS, 1),
        createSuitedTile(SuitedTileType.DOTS, 1),
        createSeasonTile(3),
      ];
      setPlayerState({ tiles, wind: WindType.WEST });
      expect(component.ownSeason()).toBe(1);
    });
  });

  // ==================== BOUQUET/GARDEN ====================

  describe('bouquetGarden', () => {
    it('should score 2 for 4 flowers in tiles', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createFlowerTile(1),
        createFlowerTile(2),
        createFlowerTile(3),
        createFlowerTile(4),
      ];
      setPlayerTiles(tiles);
      expect(component.bouquetGarden()).toBe(2);
    });

    it('should score 2 for 4 seasons in tiles', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSeasonTile(1),
        createSeasonTile(2),
        createSeasonTile(3),
        createSeasonTile(4),
      ];
      setPlayerTiles(tiles);
      expect(component.bouquetGarden()).toBe(2);
    });

    it('should score 0 for only 3 flowers', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createFlowerTile(1),
        createFlowerTile(2),
        createFlowerTile(3),
      ];
      setPlayerTiles(tiles);
      expect(component.bouquetGarden()).toBe(0);
    });
  });

  // ==================== ANY KONG ====================

  describe('anyKong', () => {
    it('should score 2 for 1 kong', () => {
      const tiles = [
        // Kong: 4x Bamboo 1
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        // Other tiles
        createSuitedTile(SuitedTileType.DOTS, 2),
        createSuitedTile(SuitedTileType.DOTS, 3),
        createSuitedTile(SuitedTileType.DOTS, 4),
        createSuitedTile(SuitedTileType.DOTS, 5),
        createSuitedTile(SuitedTileType.DOTS, 6),
        createSuitedTile(SuitedTileType.DOTS, 7),
        createSuitedTile(SuitedTileType.DOTS, 8),
        createSuitedTile(SuitedTileType.DOTS, 9),
        createSuitedTile(SuitedTileType.DOTS, 9),
        createSuitedTile(SuitedTileType.DOTS, 2),
        createSuitedTile(SuitedTileType.DOTS, 3),
      ];
      setPlayerTiles(tiles);
      expect(component.anyKong()).toBe(2);
    });

    it('should score 4 for 2 kongs', () => {
      const tiles = [
        // Kong 1: 4x Bamboo 1
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        // Kong 2: 4x Dots 9
        createSuitedTile(SuitedTileType.DOTS, 9),
        createSuitedTile(SuitedTileType.DOTS, 9),
        createSuitedTile(SuitedTileType.DOTS, 9),
        createSuitedTile(SuitedTileType.DOTS, 9),
        // Other tiles
        createSuitedTile(SuitedTileType.CHARACTER, 2),
        createSuitedTile(SuitedTileType.CHARACTER, 3),
        createSuitedTile(SuitedTileType.CHARACTER, 4),
        createSuitedTile(SuitedTileType.CHARACTER, 5),
        createSuitedTile(SuitedTileType.CHARACTER, 6),
        createSuitedTile(SuitedTileType.CHARACTER, 7),
        createSuitedTile(SuitedTileType.CHARACTER, 8),
        createSuitedTile(SuitedTileType.CHARACTER, 8),
      ];
      setPlayerTiles(tiles);
      expect(component.anyKong()).toBe(4);
    });

    it('should score 0 for no kongs', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 8),
        createSuitedTile(SuitedTileType.BAMBOO, 9),
        createSuitedTile(SuitedTileType.BAMBOO, 9),
        createSuitedTile(SuitedTileType.BAMBOO, 9),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
      ];
      setPlayerTiles(tiles);
      expect(component.anyKong()).toBe(0);
    });
  });
});
