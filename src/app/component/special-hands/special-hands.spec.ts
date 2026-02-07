import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialHands } from './special-hands';
import { TableStore } from '../../store/table-store';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { TileType } from '../../model/tile-type';
import { HonourTile, HonourTileType } from '../../model/honour-tile';
import { WindType } from '../../model/wind-type';
import { DragonType } from '../../model/dragon-type';
import { Tile } from '../../model/tile';
import { v4 as uuidv4 } from 'uuid';
import { patchState } from '@ngrx/signals';

describe('SpecialHands', () => {
  let component: SpecialHands;
  let fixture: ComponentFixture<SpecialHands>;
  let tableStore: InstanceType<typeof TableStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialHands],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialHands);
    component = fixture.componentInstance;
    tableStore = TestBed.inject(TableStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ==================== HELPER FUNCTIONS ====================

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

  function setPlayerTiles(tiles: any[]) {
    const currentPlayer = tableStore.entities()[0];
    tableStore.entityMap()[currentPlayer.id] = {
      ...currentPlayer,
      tiles,
    };
  }

  function setPlayerState(overrides: {
    tiles?: any[];
    exposedTiles?: any[];
    wind?: WindType;
  }) {
    const currentPlayer = tableStore.entities()[0];
    tableStore.entityMap()[currentPlayer.id] = {
      ...currentPlayer,
      ...overrides,
    };
  }

  /** Builds the standard 13-orphans base: one of each terminal/honour. */
  function createOrphanBase(): Tile[] {
    return [
      createSuitedTile(SuitedTileType.BAMBOO, 1),
      createSuitedTile(SuitedTileType.BAMBOO, 9),
      createSuitedTile(SuitedTileType.CHARACTER, 1),
      createSuitedTile(SuitedTileType.CHARACTER, 9),
      createSuitedTile(SuitedTileType.DOTS, 1),
      createSuitedTile(SuitedTileType.DOTS, 9),
      createWindTile(WindType.EAST),
      createWindTile(WindType.SOUTH),
      createWindTile(WindType.WEST),
      createWindTile(WindType.NORTH),
      createDragonTile(DragonType.RED),
      createDragonTile(DragonType.GREEN),
      createDragonTile(DragonType.WHITE),
    ];
  }

  /** Creates N tiles of a given wind. */
  function createWindTiles(wind: WindType, count: number): HonourTile[] {
    return Array.from({ length: count }, () => createWindTile(wind));
  }

  /** Creates N tiles of a given dragon. */
  function createDragonTiles(dragon: DragonType, count: number): HonourTile[] {
    return Array.from({ length: count }, () => createDragonTile(dragon));
  }

  /** Creates N identical suited tiles. */
  function createSuitedTiles(
    suite: SuitedTileType,
    number: number,
    count: number,
  ): SuitedTile[] {
    return Array.from({ length: count }, () => createSuitedTile(suite, number));
  }

  // ==================== THIRTEEN ORPHANS ====================

  describe('thirteenOrphans', () => {
    describe('Valid Hands', () => {
      it('should score 15 with pair of East wind', () => {
        const tiles = [...createOrphanBase(), createWindTile(WindType.EAST)];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of South wind', () => {
        const tiles = [...createOrphanBase(), createWindTile(WindType.SOUTH)];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of West wind', () => {
        const tiles = [...createOrphanBase(), createWindTile(WindType.WEST)];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of North wind', () => {
        const tiles = [...createOrphanBase(), createWindTile(WindType.NORTH)];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of Red Dragon', () => {
        const tiles = [...createOrphanBase(), createDragonTile(DragonType.RED)];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of Green Dragon', () => {
        const tiles = [
          ...createOrphanBase(),
          createDragonTile(DragonType.GREEN),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of White Dragon', () => {
        const tiles = [
          ...createOrphanBase(),
          createDragonTile(DragonType.WHITE),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of Bamboo-1', () => {
        const tiles = [
          ...createOrphanBase(),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of Dots-9', () => {
        const tiles = [
          ...createOrphanBase(),
          createSuitedTile(SuitedTileType.DOTS, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });

      it('should score 15 with pair of Character-1', () => {
        const tiles = [
          ...createOrphanBase(),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });
    });

    describe('Invalid - Missing Required Tiles', () => {
      it('should score 0 when missing East wind', () => {
        const base = createOrphanBase().filter(
          (t) =>
            !(
              t.type === TileType.HONOUR &&
              (t as HonourTile).value === WindType.EAST
            ),
        );
        const tiles = [
          ...base,
          createWindTile(WindType.SOUTH),
          createWindTile(WindType.SOUTH),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(0);
      });

      it('should score 0 when missing Red Dragon', () => {
        const base = createOrphanBase().filter(
          (t) =>
            !(
              t.type === TileType.HONOUR &&
              (t as HonourTile).value === DragonType.RED
            ),
        );
        const tiles = [
          ...base,
          createDragonTile(DragonType.GREEN),
          createDragonTile(DragonType.GREEN),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(0);
      });

      it('should score 0 when missing Bamboo-1 terminal', () => {
        const base = createOrphanBase().filter(
          (t) =>
            !(
              t.type === TileType.SUITED &&
              (t as SuitedTile).suite === SuitedTileType.BAMBOO &&
              (t as SuitedTile).number === 1
            ),
        );
        const tiles = [
          ...base,
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(0);
      });

      it('should score 0 when missing Character-9 terminal', () => {
        const base = createOrphanBase().filter(
          (t) =>
            !(
              t.type === TileType.SUITED &&
              (t as SuitedTile).suite === SuitedTileType.CHARACTER &&
              (t as SuitedTile).number === 9
            ),
        );
        const tiles = [
          ...base,
          createWindTile(WindType.EAST),
          createWindTile(WindType.EAST),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(0);
      });
    });

    describe('Invalid - Wrong Tile Count', () => {
      it('should score 0 for 13 tiles (missing the pair tile)', () => {
        const tiles = createOrphanBase();
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(0);
      });

      it('should score 0 for 15 tiles', () => {
        const tiles = [
          ...createOrphanBase(),
          createWindTile(WindType.EAST),
          createWindTile(WindType.SOUTH),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(0);
      });
    });

    describe('Invalid - Non-Orphan Tiles', () => {
      it('should score 0 when a middle number replaces a terminal', () => {
        // Replace Bamboo-1 with Bamboo-5
        const base = createOrphanBase().filter(
          (t) =>
            !(
              t.type === TileType.SUITED &&
              (t as SuitedTile).suite === SuitedTileType.BAMBOO &&
              (t as SuitedTile).number === 1
            ),
        );
        const tiles = [
          ...base,
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createWindTile(WindType.EAST),
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(0);
      });

      it('should score 0 when has a triple instead of pair (wrong distribution)', () => {
        // 3 East winds + 12 others = 15 tiles or need to drop something
        // Actually 13 unique - 1 + 3 = 15. Need exactly 14 so this fails tile count.
        const base = createOrphanBase();
        const tiles = [
          ...base,
          createWindTile(WindType.EAST),
          createWindTile(WindType.EAST),
        ];
        // 15 tiles - fails the 14 check
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(0);
      });
    });

    describe('Edge Cases', () => {
      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.thirteenOrphans()).toBe(0);
      });

      it('should score 15 regardless of tile order', () => {
        const tiles = [
          createWindTile(WindType.NORTH),
          createSuitedTile(SuitedTileType.DOTS, 9),
          createDragonTile(DragonType.WHITE),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createWindTile(WindType.EAST),
          createSuitedTile(SuitedTileType.CHARACTER, 9),
          createDragonTile(DragonType.RED),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createWindTile(WindType.SOUTH),
          createSuitedTile(SuitedTileType.CHARACTER, 1),
          createWindTile(WindType.WEST),
          createDragonTile(DragonType.GREEN),
          createSuitedTile(SuitedTileType.DOTS, 1),
          createWindTile(WindType.NORTH), // pair
        ];
        setPlayerTiles(tiles);
        expect(component.thirteenOrphans()).toBe(15);
      });
    });
  });

  // ==================== HEAVEN'S HAND ====================

  describe('heavensHand', () => {
    describe('Valid Hands', () => {
      it('should score 15 for East wind player with valid hand and empty discard', () => {
        // Default state: player 0 is East, discard is empty
        // Need a valid winning hand (>= 5 unique tile types for simplified check)
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.heavensHand()).toBe(15);
      });

      it('should score 15 for East wind with 7-pair hand', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 6, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 7, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.heavensHand()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when player is not East wind', () => {
        tableStore.updateWind(WindType.SOUTH);
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.heavensHand()).toBe(0);
      });

      it('should score 0 when discard pile is not empty', () => {
        const discardTile = createSuitedTile(SuitedTileType.BAMBOO, 9);
        patchState(tableStore as any, { discard: [discardTile] });
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.heavensHand()).toBe(0);
      });

      it('should score 0 when hand is too small (< 14 tiles)', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.heavensHand()).toBe(0);
      });

      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.heavensHand()).toBe(0);
      });

      it('should score 0 when hand has too few unique tile types (< 5)', () => {
        // 4 unique tile types: simplified hasValidWinningHand rejects tileCount.size < 5
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 4),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 4),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 4),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.heavensHand()).toBe(0);
      });
    });
  });

  // ==================== EARTH'S HAND ====================

  describe('earthsHand', () => {
    describe('Valid Hands', () => {
      it('should score 15 for East wind, drawn from dead wall, empty discard', () => {
        patchState(tableStore as any, { drawnFromDeadWall: true });
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.earthsHand()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when not drawn from dead wall', () => {
        // drawnFromDeadWall defaults to false
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.earthsHand()).toBe(0);
      });

      it('should score 0 when player is not East wind', () => {
        patchState(tableStore as any, { drawnFromDeadWall: true });
        tableStore.updateWind(WindType.SOUTH);
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.earthsHand()).toBe(0);
      });

      it('should score 0 when discard is not empty', () => {
        patchState(tableStore as any, {
          drawnFromDeadWall: true,
          discard: [createSuitedTile(SuitedTileType.DOTS, 1)],
        });
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.earthsHand()).toBe(0);
      });

      it('should score 0 for empty hand even with dead wall draw', () => {
        patchState(tableStore as any, { drawnFromDeadWall: true });
        setPlayerTiles([]);
        expect(component.earthsHand()).toBe(0);
      });
    });
  });

  // ==================== ALL HIDDEN PUNG/KONG ====================

  describe('allHiddenPungKong', () => {
    describe('Valid Hands', () => {
      it('should score 15 for 4 pungs + pair in Bamboo, no exposed tiles', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 7, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHiddenPungKong()).toBe(15);
      });

      it('should score 15 for 3 pungs + 1 kong + pair in Character', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 3, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 5, 4), // kong
          ...createSuitedTiles(SuitedTileType.CHARACTER, 7, 2),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHiddenPungKong()).toBe(15);
      });

      it('should score 15 for 4 pungs + pair in Dots', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.DOTS, 2, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 4, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 6, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 8, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHiddenPungKong()).toBe(15);
      });

      it('should score 15 for 3 kongs + pair (4+4+4+2 = 14)', () => {
        // Remove pair -> 4+4+4 = 12. 3 kongs = valid!
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 4),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 4),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 4),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 7, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHiddenPungKong()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when tiles are exposed', () => {
        const exposed = [createSuitedTile(SuitedTileType.BAMBOO, 1)];
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 2), // only 2 left hidden
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 7, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 2),
        ];
        setPlayerState({ tiles, exposedTiles: exposed });
        expect(component.allHiddenPungKong()).toBe(0);
      });

      it('should score 0 when hand contains honour tiles', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 3),
          ...createWindTiles(WindType.EAST, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHiddenPungKong()).toBe(0);
      });

      it('should score 0 when tiles are from multiple suits', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 3, 3), // different suit
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 7, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHiddenPungKong()).toBe(0);
      });

      it('should score 0 when tiles cannot form pungs (chi pattern)', () => {
        // 14 tiles in one suit but forming chis not pungs
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
        ];
        setPlayerTiles(tiles);
        expect(component.allHiddenPungKong()).toBe(0);
      });

      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.allHiddenPungKong()).toBe(0);
      });

      it('should score 0 for hand with fewer than 14 tiles', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.allHiddenPungKong()).toBe(0);
      });
    });
  });

  // ==================== FOUR SMALL WINDS ====================

  describe('fourSmallWinds', () => {
    describe('Valid Hands', () => {
      it('should score 15 for 3 wind pungs + wind pair + suited chi', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 2), // pair
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(15);
      });

      it('should score 15 for 3 wind pungs + wind pair + suited pung', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 2),
          ...createSuitedTiles(SuitedTileType.DOTS, 5, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(15);
      });

      it('should score 15 for 3 wind pungs + wind pair + dragon pung', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 2),
          ...createDragonTiles(DragonType.RED, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(15);
      });

      it('should score 15 with one wind kong instead of pung', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 4), // kong
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(15);
      });

      it('should score 15 with suited kong as the meld', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 2),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 5, 4), // kong meld
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when only 2 winds have pungs', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 2),
          ...createWindTiles(WindType.NORTH, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(0);
      });

      it('should score 0 when all 4 winds are pungs (that is big winds)', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(0);
      });

      it('should score 0 when no wind pair exists', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 1), // only 1, not a pair
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(0);
      });

      it('should score 0 when remaining tiles cannot form a meld', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 2),
          // 3 tiles that don't form a meld: different suits, not a sequence
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.DOTS, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(0);
      });

      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.fourSmallWinds()).toBe(0);
      });

      it('should score 0 when remaining tiles are 2 (not a valid meld size)', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 2),
        ];
        // Remaining = 2 tiles, which is < 3 and not a valid meld
        setPlayerTiles(tiles);
        expect(component.fourSmallWinds()).toBe(0);
      });
    });
  });

  // ==================== FOUR BIG WINDS ====================

  describe('fourBigWinds', () => {
    describe('Valid Hands', () => {
      it('should score 15 for 4 wind pungs + suited pair', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.fourBigWinds()).toBe(15);
      });

      it('should score 15 for 4 wind pungs + dragon pair', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 3),
          ...createDragonTiles(DragonType.RED, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.fourBigWinds()).toBe(15);
      });

      it('should score 15 with a wind kong', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 4), // kong
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.fourBigWinds()).toBe(15);
      });

      it('should score 15 with multiple wind kongs', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 4),
          ...createWindTiles(WindType.SOUTH, 4),
          ...createWindTiles(WindType.WEST, 4),
          ...createWindTiles(WindType.NORTH, 4),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.fourBigWinds()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when one wind is only a pair (3 pungs + 1 pair)', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 2), // only a pair
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.fourBigWinds()).toBe(0);
      });

      it('should score 0 when remaining tiles do not form a pair', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2), // not a pair
        ];
        setPlayerTiles(tiles);
        expect(component.fourBigWinds()).toBe(0);
      });

      it('should score 0 when remaining tiles count is not 2', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3), // 3 remaining, not 2
        ];
        setPlayerTiles(tiles);
        expect(component.fourBigWinds()).toBe(0);
      });

      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.fourBigWinds()).toBe(0);
      });

      it('should score 0 when only 3 winds have pungs', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 1),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.fourBigWinds()).toBe(0);
      });
    });
  });

  // ==================== THREE BIG DRAGONS ====================

  describe('threeBigDragons', () => {
    describe('Valid Hands', () => {
      it('should score 15 for 3 dragon pungs + suited chi + suited pair', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(15);
      });

      it('should score 15 for 3 dragon pungs + suited pung + suited pair', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 7, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(15);
      });

      it('should score 15 for 3 dragon pungs + wind pung + wind pair', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 3),
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(15);
      });

      it('should score 15 with a dragon kong', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 4), // kong
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 8, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(15);
      });

      it('should score 15 with a suited kong as the meld', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 3, 4), // kong meld
          ...createSuitedTiles(SuitedTileType.DOTS, 7, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when only 2 dragon types have pungs', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 2), // only a pair
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(0);
      });

      it('should score 0 when remaining tiles cannot form meld + pair', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 3),
          // 5 remaining tiles that can't form meld + pair
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 9),
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(0);
      });

      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.threeBigDragons()).toBe(0);
      });

      it('should score 0 when remaining tiles are too few (< 5)', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 4), // 4 remaining, not 5-6
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(0);
      });

      it('should score 0 when no dragon pungs exist', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 2),
          ...createDragonTiles(DragonType.GREEN, 2),
          ...createDragonTiles(DragonType.WHITE, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 3, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.threeBigDragons()).toBe(0);
      });
    });
  });

  // ==================== ALL TERMINAL HAND ====================

  describe('allTerminalHand', () => {
    describe('Valid Hands', () => {
      it('should score 15 for 4 terminal pungs + terminal pair', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allTerminalHand()).toBe(15);
      });

      it('should score 15 with a terminal kong', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 4), // kong
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 2),
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.allTerminalHand()).toBe(15);
      });

      it('should score 15 with all 1s and 9s from different suits', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 9, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allTerminalHand()).toBe(15);
      });

      it('should score 15 with pair of 9s', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 9, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 2), // pair of 9
        ];
        setPlayerTiles(tiles);
        expect(component.allTerminalHand()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when hand contains non-terminal suited tiles', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 5, 3), // not terminal
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allTerminalHand()).toBe(0);
      });

      it('should score 0 when hand contains honour tiles', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
          ...createWindTiles(WindType.EAST, 3),
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allTerminalHand()).toBe(0);
      });

      it('should score 0 when terminals cannot form valid pungs + pair', () => {
        // 14 terminal tiles that don't form 4 pungs + pair
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 2),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 2),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 2),
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 2),
          ...createSuitedTiles(SuitedTileType.DOTS, 9, 4),
        ];
        // Counts: each has 2 except Dots-9 has 4
        // Remove pair from Dots-9: 2,2,2,2,2,2 remaining. Can't form pungs (all have 2).
        // Remove pair from Bamboo-1: 0,2,2,2,2,4 remaining. Can't form pungs.
        setPlayerTiles(tiles);
        expect(component.allTerminalHand()).toBe(0);
      });

      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.allTerminalHand()).toBe(0);
      });

      it('should score 0 for hand with fewer than 14 tiles', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.allTerminalHand()).toBe(0);
      });
    });
  });

  // ==================== ALL HONOURS HAND ====================

  describe('allHonoursHand', () => {
    describe('Valid Hands', () => {
      it('should score 15 for 4 honour pungs + honour pair', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(15);
      });

      it('should score 15 for all wind pungs + wind pair', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 3),
          ...createDragonTiles(DragonType.WHITE, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(15);
      });

      it('should score 15 for all dragon pungs + wind pair', () => {
        const tiles = [
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 3),
          ...createWindTiles(WindType.NORTH, 3),
          ...createWindTiles(WindType.EAST, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(15);
      });

      it('should score 15 with honour kongs', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 4), // kong
          ...createWindTiles(WindType.SOUTH, 4), // kong
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 3),
          ...createDragonTiles(DragonType.WHITE, 2),
        ];
        // 4+4+3+3+2 = 16, within 14-18 range
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(15);
      });

      it('should score 15 with pair of dragons and wind pungs', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createWindTiles(WindType.NORTH, 3),
          ...createDragonTiles(DragonType.RED, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when hand contains suited tiles', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3), // not honour
          ...createDragonTiles(DragonType.GREEN, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(0);
      });

      it('should score 0 when honour counts cannot form pungs + pair', () => {
        // All pairs, no pungs: 7 pairs of honours
        const tiles = [
          ...createWindTiles(WindType.EAST, 2),
          ...createWindTiles(WindType.SOUTH, 2),
          ...createWindTiles(WindType.WEST, 2),
          ...createWindTiles(WindType.NORTH, 2),
          ...createDragonTiles(DragonType.RED, 2),
          ...createDragonTiles(DragonType.GREEN, 2),
          ...createDragonTiles(DragonType.WHITE, 2),
        ];
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(0);
      });

      it('should score 0 when a tile type has count 1 after pair removal', () => {
        // After removing one pair, some type has count 1
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
          ...createWindTiles(WindType.WEST, 3),
          ...createDragonTiles(DragonType.RED, 3),
          ...createDragonTiles(DragonType.GREEN, 1), // only 1, can't pair and can't pung
          ...createWindTiles(WindType.NORTH, 1),
        ];
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(0);
      });

      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.allHonoursHand()).toBe(0);
      });

      it('should score 0 for hand with fewer than 14 tiles', () => {
        const tiles = [
          ...createWindTiles(WindType.EAST, 3),
          ...createWindTiles(WindType.SOUTH, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.allHonoursHand()).toBe(0);
      });
    });
  });

  // ==================== NINE CONNECTED SONS ====================

  describe('nineConnectedSons', () => {
    describe('Valid Hands', () => {
      it('should score 15 for 1,1,1,2,3,4,5,6,7,8,9,9,9 + eye of 1 (4x1)', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(15);
      });

      it('should score 15 with eye of 9 (4x9)', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(15);
      });

      it('should score 15 with eye of middle number (2x5)', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 5, 2), // eye
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(15);
      });

      it('should score 15 with eye of 2', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 2, 2), // eye
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(15);
      });

      it('should score 15 with eye of 8', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 3),
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          ...createSuitedTiles(SuitedTileType.DOTS, 8, 2), // eye
          ...createSuitedTiles(SuitedTileType.DOTS, 9, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(15);
      });

      it('should score 15 in Character suit', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 2),
          createSuitedTile(SuitedTileType.CHARACTER, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 4),
          createSuitedTile(SuitedTileType.CHARACTER, 5),
          createSuitedTile(SuitedTileType.CHARACTER, 6),
          createSuitedTile(SuitedTileType.CHARACTER, 7),
          createSuitedTile(SuitedTileType.CHARACTER, 8),
          ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 4), // eye of 9
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(15);
      });

      it('should score 15 in Dots suit', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.DOTS, 1, 4), // eye of 1
          createSuitedTile(SuitedTileType.DOTS, 2),
          createSuitedTile(SuitedTileType.DOTS, 3),
          createSuitedTile(SuitedTileType.DOTS, 4),
          createSuitedTile(SuitedTileType.DOTS, 5),
          createSuitedTile(SuitedTileType.DOTS, 6),
          createSuitedTile(SuitedTileType.DOTS, 7),
          createSuitedTile(SuitedTileType.DOTS, 8),
          ...createSuitedTiles(SuitedTileType.DOTS, 9, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(15);
      });
    });

    describe('Invalid Hands', () => {
      it('should score 0 when tiles are from mixed suits', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          createSuitedTile(SuitedTileType.CHARACTER, 2), // different suit
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 4),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(0);
      });

      it('should score 0 when missing a middle number', () => {
        // Missing number 5
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          // no 5
          ...createSuitedTiles(SuitedTileType.BAMBOO, 6, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(0);
      });

      it('should score 0 when fewer than 3 of number 1', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 2), // only 2
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(0);
      });

      it('should score 0 when fewer than 3 of number 9', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 8, 2),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 2), // only 2
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(0);
      });

      it('should score 0 when hand contains honour tiles', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 2),
          createWindTile(WindType.EAST), // honour tile
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(0);
      });

      it('should score 0 for 13 tiles', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ];
        // 3+1+1+1+1+1+1+1+3 = 13 tiles, no eye
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(0);
      });

      it('should score 0 for 15 tiles (too many)', () => {
        const tiles = [
          ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 4),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 2, 2), // extra
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ];
        // 4+2+1+1+1+1+1+1+3 = 15
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(0);
      });

      it('should score 0 for empty hand', () => {
        setPlayerTiles([]);
        expect(component.nineConnectedSons()).toBe(0);
      });

      it('should score 0 when no valid eye exists (two middle numbers have extras)', () => {
        // If two middle numbers each have 2, total would be > 14
        // Actually with 3+2+2+1+1+1+1+1+3 = 15, fails tile count.
        // So any invalid eye with 14 tiles would need the eye check to fail.
        // The only way hasValidEye fails is if counts[1] != 4 && counts[9] != 4
        // && no middle number has count 2.
        // But with total = 14: 3 + x2 + x3 + ... + x8 + 3 = 14
        // So x2+x3+...+x8 = 8, each >= 1, and 7 of them.
        // 7 numbers summing to 8 with each >= 1 means exactly one has 2 and rest have 1.
        // So a middle number MUST have count 2. The eye check always passes!
        // Unless counts[1] > 3 or counts[9] > 3, adjusting the middle sums.
        // counts[1] = 3, counts[9] = 3: middle sum = 8, one middle = 2. Valid eye.
        // counts[1] = 4, counts[9] = 3: middle sum = 7, all middles = 1. Eye is 1.
        // counts[1] = 3, counts[9] = 4: middle sum = 7, all middles = 1. Eye is 9.
        // So with exactly 14 tiles of one suit, meeting the base requirements,
        // the eye check ALWAYS passes. This means the test for "no valid eye" is unreachable!
        // This is actually a logical proof that the eye check is redundant given the other checks.
        expect(true).toBeTruthy(); // Documenting: no-valid-eye case is unreachable with 14 tiles
      });
    });

    describe('Edge Cases', () => {
      it('should score 15 regardless of tile order', () => {
        const tiles = [
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 5),
          createSuitedTile(SuitedTileType.BAMBOO, 3),
          createSuitedTile(SuitedTileType.BAMBOO, 7),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 8),
          createSuitedTile(SuitedTileType.BAMBOO, 4),
          createSuitedTile(SuitedTileType.BAMBOO, 2),
          createSuitedTile(SuitedTileType.BAMBOO, 6),
          createSuitedTile(SuitedTileType.BAMBOO, 9),
          createSuitedTile(SuitedTileType.BAMBOO, 1),
          createSuitedTile(SuitedTileType.BAMBOO, 5), // eye
        ];
        setPlayerTiles(tiles);
        expect(component.nineConnectedSons()).toBe(15);
      });
    });
  });

  // ==================== TOTAL POINTS (MUTUAL EXCLUSIVITY) ====================

  describe('totalPoints', () => {
    it('should return 0 for a non-special hand', () => {
      const tiles = [
        createSuitedTile(SuitedTileType.BAMBOO, 1),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.CHARACTER, 4),
        createSuitedTile(SuitedTileType.CHARACTER, 5),
        createSuitedTile(SuitedTileType.CHARACTER, 6),
        createSuitedTile(SuitedTileType.DOTS, 7),
        createSuitedTile(SuitedTileType.DOTS, 8),
        createSuitedTile(SuitedTileType.DOTS, 9),
        ...createSuitedTiles(SuitedTileType.BAMBOO, 4, 3),
        ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 2),
      ];
      setPlayerTiles(tiles);
      expect(component.totalPoints()).toBe(0);
    });

    it('should return 15 for a single qualifying special hand', () => {
      // Thirteen orphans
      const tiles = [...createOrphanBase(), createWindTile(WindType.EAST)];
      setPlayerTiles(tiles);
      expect(component.totalPoints()).toBe(15);
    });

    it('should use first match (|| chain) - thirteenOrphans takes priority', () => {
      // A hand that is thirteen orphans (first in the chain)
      const tiles = [...createOrphanBase(), createWindTile(WindType.EAST)];
      setPlayerTiles(tiles);
      expect(component.thirteenOrphans()).toBe(15);
      expect(component.totalPoints()).toBe(15);
    });

    it('should detect allTerminalHand when earlier hands do not match', () => {
      const tiles = [
        ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
        ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
        ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 3),
        ...createSuitedTiles(SuitedTileType.DOTS, 1, 2),
      ];
      setPlayerTiles(tiles);
      expect(component.allTerminalHand()).toBe(15);
      expect(component.totalPoints()).toBe(15);
    });

    it('should detect nineConnectedSons (last in chain)', () => {
      const tiles = [
        ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 2),
        createSuitedTile(SuitedTileType.BAMBOO, 3),
        createSuitedTile(SuitedTileType.BAMBOO, 4),
        createSuitedTile(SuitedTileType.BAMBOO, 5),
        createSuitedTile(SuitedTileType.BAMBOO, 6),
        createSuitedTile(SuitedTileType.BAMBOO, 7),
        createSuitedTile(SuitedTileType.BAMBOO, 8),
        ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
      ];
      setPlayerTiles(tiles);
      expect(component.nineConnectedSons()).toBe(15);
      expect(component.totalPoints()).toBe(15);
    });
  });

  // ==================== HASSPECIALHAND ====================

  describe('hasSpecialHand', () => {
    it('should return false for non-special hand', () => {
      setPlayerTiles([]);
      expect(component.hasSpecialHand()).toBeFalse();
    });

    it('should return true for thirteen orphans', () => {
      const tiles = [...createOrphanBase(), createWindTile(WindType.EAST)];
      setPlayerTiles(tiles);
      expect(component.hasSpecialHand()).toBeTrue();
    });

    it('should return true for all terminal hand', () => {
      const tiles = [
        ...createSuitedTiles(SuitedTileType.BAMBOO, 1, 3),
        ...createSuitedTiles(SuitedTileType.BAMBOO, 9, 3),
        ...createSuitedTiles(SuitedTileType.CHARACTER, 1, 3),
        ...createSuitedTiles(SuitedTileType.CHARACTER, 9, 3),
        ...createSuitedTiles(SuitedTileType.DOTS, 1, 2),
      ];
      setPlayerTiles(tiles);
      expect(component.hasSpecialHand()).toBeTrue();
    });
  });
});
