import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HandScore } from './hand-score';
import { TableStore } from '../../store/table-store';
import { PlayerSeat } from '../../model/player-seat';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { TileType } from '../../model/tile-type';
import { HonourTile, HonourTileType } from '../../model/honour-tile';
import { WindType } from '../../model/wind-type';
import { DragonType } from '../../model/dragon-type';
import {
  BonusTile,
  BonusTileColor,
  BonusTileType,
} from '../../model/bonus-tile';
import { v4 as uuidv4 } from 'uuid';

describe('HandScore', () => {
  let component: HandScore;
  let fixture: ComponentFixture<HandScore>;
  let tableStore: InstanceType<typeof TableStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandScore],
    }).compileComponents();

    fixture = TestBed.createComponent(HandScore);
    component = fixture.componentInstance;
    tableStore = TestBed.inject(TableStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Helper function to create suited tiles
  function createSuitedTile(suite: SuitedTileType, number: number): SuitedTile {
    return {
      id: uuidv4(),
      type: TileType.SUITED,
      suite,
      number,
    };
  }

  // Helper function to create honor tiles (winds)
  function createWindTile(wind: WindType): HonourTile {
    return {
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.WIND,
      value: wind,
    } as HonourTile;
  }

  // Helper function to create dragon tiles
  function createDragonTile(dragon: DragonType): HonourTile {
    return {
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.DRAGON,
      value: dragon,
    } as HonourTile;
  }

  // Helper function to create bonus tiles
  function createBonusTile(): BonusTile {
    return {
      id: uuidv4(),
      type: TileType.BONUS,
      bonus: BonusTileType.FLOWER,
      number: 1,
      color: BonusTileColor.BLACK,
    } as BonusTile;
  }

  // Helper function to set player tiles
  function setPlayerTiles(tiles: any[]) {
    const currentPlayer = tableStore.entities()[0];
    tableStore.entityMap()[currentPlayer.id] = {
      ...currentPlayer,
      tiles,
    };
  }

  describe('allChi computed signal - Comprehensive Tests', () => {
    // ============ VALID ALL-CHI HANDS ============

    describe('Valid All-Chi Hands', () => {
      it('should score 1 for simple all-chi hand in single suit (Bamboo)', () => {
        const tiles = [
          // Chi 1: 1-2-3 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Chi 2: 4-5-6 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          // Chi 3: 4-5-6 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          // Chi 4: 7-8-9 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          // Pair (eyes): 2-2 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand in Characters', () => {
        const tiles = [
          // Chi 1: 1-2-3 Character
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          // Chi 2: 2-3-4 Character
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          // Chi 3: 5-6-7 Character
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          // Chi 4: 6-7-8 Character
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          // Pair (eyes): 1-1 Character
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand in Dots', () => {
        const tiles = [
          // Chi 1: 3-4-5 Dots
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          // Chi 2: 3-4-5 Dots
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          // Chi 3: 6-7-8 Dots
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          // Chi 4: 7-8-9 Dots
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 9),
          // Pair (eyes): 9-9 Dots
          createSuitedTile(SuitedTileType.DOTS, 9),
          createSuitedTile(SuitedTileType.DOTS, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand with mixed suits (Bamboo and Character)', () => {
        const tiles = [
          // Chi 1: 1-2-3 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Chi 2: 2-3-4 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          // Chi 3: 1-2-3 Character
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          // Chi 4: 4-5-6 Character
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          // Pair (eyes): 7-7 Character
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand with all three suits', () => {
        const tiles = [
          // Chi 1: 1-2-3 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Chi 2: 2-3-4 Character
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          // Chi 3: 5-6-7 Character
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          // Chi 4: 3-4-5 Dots
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          // Pair (eyes): 6-6 Dots
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 6),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand with pair at number 1', () => {
        const tiles = [
          // Pair (eyes): 1-1 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          // Chi 1: 2-3-4 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          // Chi 2: 3-4-5 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          // Chi 3: 5-6-7 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          // Chi 4: 7-8-9 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand with pair at number 9', () => {
        const tiles = [
          // Chi 1: 1-2-3 Dots
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          // Chi 2: 3-4-5 Dots
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          // Chi 3: 5-6-7 Dots
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          // Chi 4: 7-8-9 Dots
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 9),
          // Pair (eyes): 9-9 Dots
          createSuitedTile(SuitedTileType.DOTS, 9),
          createSuitedTile(SuitedTileType.DOTS, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand with consecutive sequences', () => {
        const tiles = [
          // Chi 1: 1-2-3 Character
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          // Chi 2: 1-2-3 Character
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          // Chi 3: 1-2-3 Character
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          // Chi 4: 1-2-3 Character
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          // Pair (eyes): 4-4 Character
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand with 7-8-9 sequences', () => {
        const tiles = [
          // Chi 1: 7-8-9 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          // Chi 2: 7-8-9 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          // Chi 3: 7-8-9 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          // Chi 4: 7-8-9 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          // Pair (eyes): 5-5 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand with overlapping number ranges', () => {
        const tiles = [
          // Chi 1: 2-3-4 Dots
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          // Chi 2: 3-4-5 Dots
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          // Chi 3: 4-5-6 Dots
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          // Chi 4: 5-6-7 Dots
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          // Pair (eyes): 8-8 Dots
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });
    });

    // ============ INVALID HANDS - TILE COUNT ============

    describe('Invalid Hands - Tile Count', () => {
      it('should score 0 for hand with 0 tiles', () => {
        setPlayerTiles([]);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with 1 tile', () => {
        const tiles = [createSuitedTile(SuitedTileType.BAMBOO, 1)];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with 13 tiles', () => {
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
          createSuitedTile(SuitedTileType.BAMBOO, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with 15 tiles', () => {
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
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with 3 tiles', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with 20 tiles', () => {
        const tiles = Array(20)
          .fill(null)
          .map(() => createSuitedTile(SuitedTileType.BAMBOO, 1));
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });
    });

    // ============ INVALID HANDS - NON-SUITED TILES ============

    describe('Invalid Hands - Non-Suited Tiles', () => {
      it('should score 0 for hand with wind tiles', () => {
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
          createWindTile(WindType.EAST), // Wind tile
          createWindTile(WindType.EAST),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with dragon tiles', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 9),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createDragonTile(DragonType.RED), // Dragon tile
          createDragonTile(DragonType.RED),
          createDragonTile(DragonType.RED),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with bonus tiles', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 9),
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createBonusTile(), // Bonus tile
          createBonusTile(),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with mixed honour tiles', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createWindTile(WindType.NORTH),
          createWindTile(WindType.NORTH),
          createWindTile(WindType.NORTH),
          createDragonTile(DragonType.GREEN),
          createDragonTile(DragonType.GREEN),
          createDragonTile(DragonType.GREEN),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with all wind tiles', () => {
        const tiles = [
          createWindTile(WindType.EAST),
          createWindTile(WindType.EAST),
          createWindTile(WindType.EAST),
          createWindTile(WindType.SOUTH),
          createWindTile(WindType.SOUTH),
          createWindTile(WindType.SOUTH),
          createWindTile(WindType.WEST),
          createWindTile(WindType.WEST),
          createWindTile(WindType.WEST),
          createWindTile(WindType.NORTH),
          createWindTile(WindType.NORTH),
          createWindTile(WindType.NORTH),
          createWindTile(WindType.EAST),
          createWindTile(WindType.EAST),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });
    });

    // ============ INVALID HANDS - CANNOT FORM CHIS ============

    describe('Invalid Hands - Cannot Form All Chis', () => {
      it('should score 0 for all-pung hand (3-3-3, 4-4-4, 5-5-5, 6-6-6, pair 7-7)', () => {
        const tiles = [
          // Pung 1: 3-3-3
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Pung 2: 4-4-4
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          // Pung 3: 5-5-5
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          // Pung 4: 6-6-6
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          // Pair: 7-7
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for seven pairs hand', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with no pair', () => {
        const tiles = [
          // 4 chis worth of tiles but no valid pair
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with gap in sequence (1,2,4 instead of 1,2,3)', () => {
        const tiles = [
          // Gap in sequence: 1-2-4 (missing 3)
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with random suited tiles that cannot form sequences', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with sequence crossing boundary (8-9-1)', () => {
        const tiles = [
          // Invalid sequence: trying to wrap 8-9-1
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
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
          createSuitedTile(SuitedTileType.BAMBOO, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with mixed pungs and chis (not all chi)', () => {
        const tiles = [
          // Pung: 1-1-1
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          // Chi: 2-3-4
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          // Chi: 5-6-7
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          // Chi: 6-7-8
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          // Pair: 9-9
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with too many of the same tile', () => {
        const tiles = [
          // 4 copies of tile 5 (impossible to form all chis)
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });
    });

    // ============ EDGE CASES ============

    describe('Edge Cases', () => {
      it('should score 0 for completely empty hand', () => {
        setPlayerTiles([]);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with only pair (2 tiles)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 0 for hand with only one chi (5 tiles including pair)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });

      it('should score 1 for minimal valid all-chi hand with same tiles repeated', () => {
        const tiles = [
          // Chi 1: 1-2-3
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Chi 2: 1-2-3
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Chi 3: 1-2-3
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Chi 4: 1-2-3
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Pair: 4-4
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for complex overlapping valid hand', () => {
        const tiles = [
          // This represents: 1-1-1-2-2-2-3-3-3-4-4-4-5-5
          // Can be: (1-2-3)(1-2-3)(1-2-3)(4-4-4) + pair(5-5)? No, that's a pung
          // Or: (1-2-3)(1-2-3)(2-3-4)(2-3-4) + pair(1-1)
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi hand with mixed suits in specific pattern', () => {
        const tiles = [
          // Bamboo: 1-2-3, 4-5-6
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          // Character: 7-8-9
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 9),
          // Dots: 2-3-4
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          // Pair: 5-5 Dots
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 5),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 0 for hand with suit mismatch in sequence', () => {
        const tiles = [
          // Trying invalid cross-suit sequence
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2), // Wrong suit
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
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });
    });

    // ============ SPECIAL PATTERNS ============

    describe('Special Patterns', () => {
      it('should score 1 for all-chi with only low numbers (1-5)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi with only high numbers (5-9)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 9),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 9),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi spanning full range (1-9)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 9),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });

      it('should score 1 for all-chi with pair in middle of hand', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(1);
      });
    });

    describe('All-Chi Rejects Kong Hands', () => {
      it('should score 0 for 15-tile hand (Kong not valid for all-chi)', () => {
        const tiles = [
          // Chi 1: 1-2-3 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Chi 2: 4-5-6 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          // Chi 3: 4-5-6 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          // Chi 4: 7-8-9 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          // Pair (eyes): 2-2 Bamboo
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          // Extra tile to make 15
          createSuitedTile(SuitedTileType.BAMBOO, 1),
        ];
        setPlayerTiles(tiles);
        expect(component.allChi()).toBe(0);
      });
    });
  });

  describe('allPung computed signal - Kong Support', () => {
    describe('Valid All-Pung Hands with Kongs', () => {
      it('should score 2 for all-pung hand with one Kong (15 tiles)', () => {
        const tiles = [
          // Kong: 4x Bamboo-1
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          // Pung: 3x Bamboo-3
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Pung: 3x Bamboo-5
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          // Pung: 3x Bamboo-7
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          // Pair: 2x Bamboo-9
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.allPung()).toBe(2);
      });

      it('should score 2 for all-pung hand with two Kongs (16 tiles)', () => {
        const tiles = [
          // Kong: 4x Bamboo-1
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          // Kong: 4x Bamboo-3
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Pung: 3x Bamboo-5
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          // Pung: 3x Bamboo-7
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          // Pair: 2x Bamboo-9
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.allPung()).toBe(2);
      });

      it('should score 2 for all-pung hand with four Kongs (18 tiles)', () => {
        const tiles = [
          // Kong: 4x Bamboo-1
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          // Kong: 4x Bamboo-3
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          // Kong: 4x Bamboo-5
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          // Kong: 4x Bamboo-7
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          // Pair: 2x Bamboo-9
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.allPung()).toBe(2);
      });

      it('should score 5 (2+3 bonus) for all-pung even-number hand with Kong', () => {
        const tiles = [
          // Kong: 4x Bamboo-2
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          // Pung: 3x Bamboo-4
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          // Pung: 3x Bamboo-6
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          // Pung: 3x Dots-8
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 8),
          // Pair: 2x Dots-2
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allPung()).toBe(5);
      });

      it('should score 0 for 15 tiles that cannot form valid melds', () => {
        const tiles = [
          // Random tiles that don't form proper melds
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
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.allPung()).toBe(0);
      });
    });
  });

  describe('mixedTwoSuit computed signal - Kong Support', () => {
    it('should score 1 for mixed two suit hand with one Kong (15 tiles)', () => {
      const tiles = [
        // Kong: 4x Bamboo-1
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        // Chi: 2-3-4 Bamboo
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        // Chi: 5-6-7 Character
        createSuitedTile(SuitedTileType.CHARACTER, 5),
        createSuitedTile(SuitedTileType.CHARACTER, 6),
        createSuitedTile(SuitedTileType.CHARACTER, 7),
        // Chi: 7-8-9 Character
        createSuitedTile(SuitedTileType.CHARACTER, 7),
        createSuitedTile(SuitedTileType.CHARACTER, 8),
        createSuitedTile(SuitedTileType.CHARACTER, 9),
        // Pair: 2x Character-1
        createSuitedTile(SuitedTileType.CHARACTER, 1),
        createSuitedTile(SuitedTileType.CHARACTER, 1),
      ];
      setPlayerTiles(tiles);
      expect(component.mixedTwoSuit()).toBe(1);
    });
  });

  describe('purityHand computed signal - Kong Support', () => {
    it('should score 9 for purity hand with one Kong (15 tiles)', () => {
      const tiles = [
        // Kong: 4x Bamboo-1
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        // Chi: 2-3-4 Bamboo
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        // Chi: 5-6-7 Bamboo
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        // Chi: 7-8-9 Bamboo
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 8),
        createSuitedTile(SuitedTileType.BAMBOO, 9),
        // Pair: 2x Bamboo-5
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
      ];
      setPlayerTiles(tiles);
      expect(component.purityHand()).toBe(9);
    });

    it('should score 9 for purity hand with all Kongs (18 tiles)', () => {
      const tiles = [
        // Kong: 4x Bamboo-1
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        // Kong: 4x Bamboo-3
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        // Kong: 4x Bamboo-5
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        // Kong: 4x Bamboo-7
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        // Pair: 2x Bamboo-9
        createSuitedTile(SuitedTileType.BAMBOO, 9),
        createSuitedTile(SuitedTileType.BAMBOO, 9),
      ];
      setPlayerTiles(tiles);
      expect(component.purityHand()).toBe(9);
    });
  });

  describe('bigSevenPairs computed signal - Comprehensive Tests', () => {
    // ============ VALID BIG SEVEN PAIRS HANDS ============

    describe('Valid Big Seven Pairs Hands', () => {
      it('should score 9 for 1-7 consecutive pairs in Bamboo', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 1-7 consecutive pairs in Character', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 1-7 consecutive pairs in Dots', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 2-8 consecutive pairs in Bamboo', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 2-8 consecutive pairs in Character', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 3-9 consecutive pairs in Bamboo', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 3-9 consecutive pairs in Dots', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 9),
          createSuitedTile(SuitedTileType.DOTS, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 1-7 with pairs spread across different suits', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 2-8 with pairs in two suits', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 9 for 3-9 with all three suits used', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 9),
          createSuitedTile(SuitedTileType.DOTS, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });
    });

    // ============ INVALID HANDS - TILE COUNT ============

    describe('Invalid Hands - Tile Count', () => {
      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for 13 tiles (one short of a pair)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for 15 tiles', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for 12 tiles (6 pairs)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for 16 tiles (8 pairs)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });
    });

    // ============ INVALID HANDS - NON-SUITED TILES ============

    describe('Invalid Hands - Non-Suited Tiles', () => {
      it('should score 0 when hand contains wind tiles', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createWindTile(WindType.EAST),
          createWindTile(WindType.EAST),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 when hand contains dragon tiles', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createDragonTile(DragonType.RED),
          createDragonTile(DragonType.RED),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 when hand contains bonus tiles', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createBonusTile(),
          createBonusTile(),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 when even a single honour tile is present', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createWindTile(WindType.NORTH),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });
    });

    // ============ INVALID HANDS - NOT CONSECUTIVE ============

    describe('Invalid Hands - Not Consecutive Pairs', () => {
      it('should score 0 for 7 pairs with a gap (1,2,3,4,5,6,8 - missing 7)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for 7 pairs with a gap (2,3,4,5,6,8,9 - missing 7)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 9),
          createSuitedTile(SuitedTileType.CHARACTER, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for 7 pairs spanning 1-9 with gaps (1,2,3,5,7,8,9)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 1),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 9),
          createSuitedTile(SuitedTileType.DOTS, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for 7 pairs of all odd numbers (1,3,5,7,9 only 5 unique)', () => {
        // Only 5 unique odd numbers exist, so need duplicates which won't be pairs of 7 different numbers
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for 7 pairs of even numbers (2,4,6,8 only 4 unique)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for consecutive 1-6 pairs plus non-consecutive pair 9', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });
    });

    // ============ INVALID HANDS - PAIR SPLIT ACROSS SUITS ============

    describe('Invalid Hands - Pair Split Across Suits', () => {
      it('should score 0 when a pair is split across two suits (1 in each)', () => {
        // Number 7 has 1 Bamboo + 1 Character = 2 tiles total, but no single suite has >= 2
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 when multiple pairs are split across suits', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });
    });

    // ============ INVALID HANDS - NOT PAIRS ============

    describe('Invalid Hands - Not Pairs', () => {
      it('should score 0 for hand with melds instead of pairs (chi + pung pattern)', () => {
        const tiles = [
          // This is 4 chis + pair, not 7 pairs
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
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for all-pung hand in consecutive range', () => {
        // 3-3-3, 4-4-4, 5-5-5, 6-6 = only 11 tiles. Need 14.
        // Let's try: 1-1-1, 2-2-2, 3-3-3, 4-4-4, 5-5 = 14 tiles
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
        ];
        setPlayerTiles(tiles);
        // Has pairs for 1-5, but not 6 or 7. Only 5 numbers covered, not 7 consecutive.
        expect(component.bigSevenPairs()).toBe(0);
      });
    });

    // ============ EDGE CASES ============

    describe('Edge Cases', () => {
      it('should also trigger littleSevenPairs (both hands can score simultaneously)', () => {
        // A valid 1-7 big seven pairs hand is also a valid little seven pairs hand
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
        expect(component.littleSevenPairs()).toBe(6);
      });

      it('should score 9 even when tiles are not in sorted order', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });

      it('should score 0 for littleSevenPairs that is NOT consecutive', () => {
        // Valid littleSevenPairs but not bigSevenPairs (not consecutive)
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.littleSevenPairs()).toBe(6);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 when all 14 tiles are the same number (not 7 pairs of different numbers)', () => {
        // 14 tiles of bamboo-5 - but mahjong only has 4 copies of each tile
        // Still, the code should handle it: counts[BAMBOO][5] = 14, passes pair check for number 5
        // But would fail for numbers 1-4 or 6-7 etc. since they have 0 tiles
        // Actually this is impossible in a real game but testing the logic
        const tiles = Array(14)
          .fill(null)
          .map(() => createSuitedTile(SuitedTileType.BAMBOO, 5));
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should only accept the three valid ranges (1-7, 2-8, 3-9)', () => {
        // Verify 4-10 would not work (numbers only go to 9)
        // Test a hand that's consecutive but starts at 4: 4,5,6,7,8,9 = only 6 numbers
        // Need 7 pairs so add a non-consecutive pair
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
        ];
        setPlayerTiles(tiles);
        // 4-9 is only 6 consecutive, and 1 is not adjacent. No valid range matches.
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 9 when all pairs are in different suits for 3-9', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.DOTS, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(9);
      });
    });

    // ============ BOUNDARY OF VALID RANGES ============

    describe('Boundary of Valid Ranges', () => {
      it('should score 0 for pairs 1-6 only (one short of 1-7)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          // 12 tiles - would need 2 more but not number 7
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
        ];
        setPlayerTiles(tiles);
        expect(component.bigSevenPairs()).toBe(0);
      });

      it('should score 0 for pairs 4-9 only (6 consecutive, not 7)', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
        ];
        setPlayerTiles(tiles);
        // 4-9 is 6 consecutive. Second pair of 4s doesn't extend the range.
        // Range 1-7: no 1,2,3. Fail.
        // Range 2-8: no 2,3. Fail.
        // Range 3-9: no 3. Fail.
        expect(component.bigSevenPairs()).toBe(0);
      });
    });
  });

  describe('littleSevenPairs and bigSevenPairs - Reject Kong Hands', () => {
    it('littleSevenPairs should score 0 for 15 tiles', () => {
      const tiles = [
        // 7 pairs + 1 extra
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 8),
      ];
      setPlayerTiles(tiles);
      expect(component.littleSevenPairs()).toBe(0);
    });

    it('bigSevenPairs should score 0 for 15 tiles', () => {
      const tiles = [
        // 7 pairs consecutive + 1 extra
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 8),
      ];
      setPlayerTiles(tiles);
      expect(component.bigSevenPairs()).toBe(0);
    });
  });
});
