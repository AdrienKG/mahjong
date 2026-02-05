import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HandScore } from './hand-score';
import { TableStore } from '../../store/table-store';
import { PlayerSeat } from '../../model/player-seat';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { TileType } from '../../model/tile-type';
import { HonourTile, HonourTileType } from '../../model/honour-tile';
import { WindType } from '../../model/wind-type';
import { DragonType } from '../../model/dragon-type';
import { BonusTile, BonusTileColor, BonusTileType } from '../../model/bonus-tile';
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
        const tiles = Array(20).fill(null).map(() => createSuitedTile(SuitedTileType.BAMBOO, 1));
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
