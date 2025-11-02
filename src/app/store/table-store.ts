import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { v4 as uuidv4 } from 'uuid';
import { BonusTile, BonusTileColor, BonusTileType } from '../model/bonus-tile';
import { DragonType } from '../model/dragon-type';
import { HonourTile, HonourTileType } from '../model/honour-tile';
import { Player } from '../model/player';
import { PlayerSeat } from '../model/player-seat';
import { SuitedTile, SuitedTileType } from '../model/suited-tile';
import { Tile } from '../model/tile';
import { TileType } from '../model/tile-type';
import { WindType } from '../model/wind-type';

type TableState = {
  wind: WindType;
  discard: Tile[];
  wall: Tile[]; //wall and other player hidden hands
  drawnFromWall: boolean;
  drawnFromDeadWall: boolean;
};

const setupTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  for (let i = 1; i <= 4; i++) {
    // 4 copies of each
    for (let j = 1; j <= 9; j++) {
      tiles.push({
        id: uuidv4(),
        type: TileType.SUITED,
        suite: SuitedTileType.BAMBOO,
        number: j as unknown as number,
      } as SuitedTile);
      tiles.push({
        id: uuidv4(),
        type: TileType.SUITED,
        suite: SuitedTileType.CHARACTER,
        number: j as unknown as number,
      } as SuitedTile);
      tiles.push({
        id: uuidv4(),
        type: TileType.SUITED,
        suite: SuitedTileType.DOTS,
        number: j as unknown as number,
      } as SuitedTile);
    }

    tiles.push({
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.DRAGON,
      value: DragonType.GREEN,
    } as HonourTile);
    tiles.push({
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.DRAGON,
      value: DragonType.RED,
    } as HonourTile);
    tiles.push({
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.DRAGON,
      value: DragonType.WHITE,
    } as HonourTile);

    tiles.push({
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.WIND,
      value: WindType.EAST,
    } as HonourTile);
    tiles.push({
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.WIND,
      value: WindType.SOUTH,
    } as HonourTile);
    tiles.push({
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.WIND,
      value: WindType.WEST,
    } as HonourTile);
    tiles.push({
      id: uuidv4(),
      type: TileType.HONOUR,
      honour: HonourTileType.WIND,
      value: WindType.NORTH,
    } as HonourTile);

    //Flowers and Seasons
    tiles.push({
      id: uuidv4(),
      type: TileType.BONUS,
      bonus: BonusTileType.FLOWER,
      number: i as unknown as number,
      color: BonusTileColor.BLACK,
    } as BonusTile);
    tiles.push({
      id: uuidv4(),
      type: TileType.BONUS,
      bonus: BonusTileType.SEASON,
      number: i as unknown as number,
      color: BonusTileColor.RED,
    } as BonusTile);
  }

  return tiles;
};

const initialState: TableState = {
  wind: WindType.EAST,
  discard: [],
  wall: setupTiles(),
  drawnFromWall: false,
  drawnFromDeadWall: false,
};

export const TableStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<Player>(),
  withMethods((store) => ({
    addPlayers() {
      patchState(
        store,
        addEntities([
          {
            id: PlayerSeat.current,
            wind: WindType.EAST,
            tiles: Array.from({ length: 14 }).map(
              () =>
                ({
                  id: uuidv4(),
                  type: TileType.UNKNOWN,
                }) as Tile,
            ),
            exposedTiles: [],
            bonusTiles: [],
          },
          {
            id: PlayerSeat.right,
            wind: WindType.SOUTH,
            tiles: Array.from({ length: 13 }).map(
              () =>
                ({
                  id: uuidv4(),
                  type: TileType.UNKNOWN,
                }) as Tile,
            ),
            exposedTiles: [],
            bonusTiles: [],
          },
          {
            id: PlayerSeat.across,
            wind: WindType.WEST,
            tiles: Array.from({ length: 13 }).map(
              () =>
                ({
                  id: uuidv4(),
                  type: TileType.UNKNOWN,
                }) as Tile,
            ),
            exposedTiles: [],
            bonusTiles: [],
          },
          {
            id: PlayerSeat.left,
            wind: WindType.NORTH,
            tiles: Array.from({ length: 13 }).map(
              () =>
                ({
                  id: uuidv4(),
                  type: TileType.UNKNOWN,
                }) as Tile,
            ),
            exposedTiles: [],
            bonusTiles: [],
          },
        ] as Player[]),
      );
    },
    pickupTile() {
      const wall = store.wall();
      const indexToRemove = Math.floor(Math.random() * (wall.length - 1));
      const tile = wall[indexToRemove];

      const currentPlayerTiles = store.entities()[0].tiles;
      currentPlayerTiles.push(tile);

      patchState(
        store,
        updateEntity({ id: 0, changes: { tiles: [...currentPlayerTiles] } }),
      );
      patchState(store, (state) => ({
        wall: [
          ...state.wall.slice(0, indexToRemove),
          ...state.wall.slice(indexToRemove + 1),
        ],
      }));
    },
    updateWind(wind: WindType) {
      switch (wind) {
        case WindType.EAST:
          patchState(
            store,
            updateEntity({ id: 0, changes: { wind: WindType.EAST } }),
          );
          patchState(
            store,
            updateEntity({ id: 1, changes: { wind: WindType.SOUTH } }),
          );
          patchState(
            store,
            updateEntity({ id: 2, changes: { wind: WindType.WEST } }),
          );
          patchState(
            store,
            updateEntity({ id: 3, changes: { wind: WindType.NORTH } }),
          );
          break;
        case WindType.SOUTH:
          patchState(
            store,
            updateEntity({ id: 0, changes: { wind: WindType.SOUTH } }),
          );
          patchState(
            store,
            updateEntity({ id: 1, changes: { wind: WindType.WEST } }),
          );
          patchState(
            store,
            updateEntity({ id: 2, changes: { wind: WindType.NORTH } }),
          );
          patchState(
            store,
            updateEntity({ id: 3, changes: { wind: WindType.EAST } }),
          );
          break;
        case WindType.WEST:
          patchState(
            store,
            updateEntity({ id: 0, changes: { wind: WindType.WEST } }),
          );
          patchState(
            store,
            updateEntity({ id: 1, changes: { wind: WindType.NORTH } }),
          );
          patchState(
            store,
            updateEntity({ id: 2, changes: { wind: WindType.EAST } }),
          );
          patchState(
            store,
            updateEntity({ id: 3, changes: { wind: WindType.SOUTH } }),
          );
          break;
        case WindType.NORTH:
          patchState(
            store,
            updateEntity({ id: 0, changes: { wind: WindType.NORTH } }),
          );
          patchState(
            store,
            updateEntity({ id: 1, changes: { wind: WindType.EAST } }),
          );
          patchState(
            store,
            updateEntity({ id: 2, changes: { wind: WindType.SOUTH } }),
          );
          patchState(
            store,
            updateEntity({ id: 3, changes: { wind: WindType.WEST } }),
          );
          break;
      }
    },
  })),
  // Hands
  withComputed((store) => ({
    allChiHand() {
      return 0;
    },
    mixed2SuitHand() {
      return 0;
    },
    allPungHand() {
      return 0;
    },
    mixedHand() {
      return 0;
    },
    little7PairsHand() {
      return 0;
    },
    big7PairsHand() {
      return 0;
    },
    purityHand() {
      return 0;
    },
  })),
  // Additional points
  withComputed((store) => ({
    pairOfSpecialEyesOdds() {
      const currentPlayer = store.entities()[0];
      const suitedCPTiles = currentPlayer.tiles.filter(
        (t) => t.type === TileType.SUITED,
      ) as SuitedTile[];
      const suites = [
        SuitedTileType.BAMBOO,
        SuitedTileType.CHARACTER,
        SuitedTileType.DOTS,
      ];
      const numbers = [2, 5, 8];

      const counts = suites.flatMap((suite) =>
        numbers.map(
          (number) =>
            suitedCPTiles.filter(
              (t) => t.suite === suite && t.number === number,
            ).length,
        ),
      );

      if (counts.some((count) => count === 2)) {
        return 1; // Already have a pair
      } else if (counts.some((count) => count === 1)) {
        return 0.5; // Halfway there
      } else {
        return 0;
      }
    },
    pungOfDragonOdds() {
      const currentPlayer = store.entities()[0];

      const honourCPTiles = currentPlayer.tiles.filter(
        (t) => t.type === TileType.HONOUR,
      ) as HonourTile[];
      const dragons = [DragonType.RED, DragonType.GREEN, DragonType.WHITE];

      const counts = dragons.map(
        (dragon) =>
          honourCPTiles.filter(
            (t) => t.honour === HonourTileType.DRAGON && t.value === dragon,
          ).length,
      );

      if (counts.some((count) => count === 3)) {
        return 1; // Already have a pung
      } else if (counts.some((count) => count === 2)) {
        return 0.67; // 2 out of 3
      } else if (counts.some((count) => count === 1)) {
        return 0.33; // 1 out of 3
      } else {
        return 0;
      }
    },
    pungOfTableOrOwnWindOdds() {
      const currentPlayer = store.entities()[0];

      const honourCPTiles = currentPlayer.tiles.filter(
        (t) => t.type === TileType.HONOUR,
      ) as HonourTile[];
      const tableWindCount = honourCPTiles.filter(
        (t) => t.honour === HonourTileType.WIND && t.value === store.wind(),
      ).length;
      const ownWindCount = honourCPTiles.filter(
        (t) =>
          t.honour === HonourTileType.WIND && t.value === currentPlayer.wind,
      ).length;

      if (tableWindCount === 3 || ownWindCount === 3) {
        return 1; // Already have a pung
      } else if (tableWindCount === 2 || ownWindCount === 2) {
        return 0.67; // 2 out of 3
      } else if (tableWindCount === 1 || ownWindCount === 1) {
        return 0.33; // 1 out of 3
      } else {
        return 0;
      }
    },
    drawn15FromEnd() {
      return store.wall().length === 14;
    },
    simpleNumbersOdds() {
      const currentPlayer = store.entities()[0];
      const suitedCPTiles = currentPlayer.tiles.filter(
        (t) => t.type === TileType.SUITED,
      ) as SuitedTile[];
      const count = suitedCPTiles.filter(
        (t) => t.number >= 2 && t.number <= 8,
      ).length;
      return count / 14;
    },
    noWindsOrDragonsOdds() {
      const currentPlayer = store.entities()[0];
      const honourCPTiles = currentPlayer.tiles.filter(
        (t) => t.type === TileType.HONOUR,
      ) as HonourTile[];
      const handOdds = [
        store.allPungHand(),
        store.mixedHand(),
        store.little7PairsHand(),
      ];
      const maxOdds = handOdds.sort((a, b) => b - a)[0];
      if (honourCPTiles.length > 0) {
        return 0;
      }
      return maxOdds;
    },
    terminalPungsKongsOdds() {
      if (store.allPungHand() === 0) {
        return 0;
      } else {
        const currentPlayer = store.entities()[0];
        const suitedCPTiles = currentPlayer.tiles.filter(
          (t) => t.type === TileType.SUITED,
        ) as SuitedTile[];
        const count = suitedCPTiles.filter(
          (t) => t.number === 1 || t.number === 9,
        ).length;
        return Math.min(count, 12) / 12;
      }
    },
  })),
  withHooks({
    onInit(store) {
      store.addPlayers();
    },
  }),
);
