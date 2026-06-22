import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import {
  addEntities,
  updateEntity,
  withEntities
} from '@ngrx/signals/entities';
import { Tile } from '../model/tile';
import { TileSet } from '../model/tile-set';
import { WindType } from '../model/wind-type';

type TableState = {
  wind: WindType;
  discard: Tile[];
  // Since walls are stacked, an even number tile means the tile is on top.
  // An odd number index means the tile is on the bottom.
  wallTiles: Tile[];
};

const initialState: TableState = {
  wind: WindType.EAST,
  discard: [],
  wallTiles: TileSet,
};

type Player = {
  id: number;
  wind: WindType;
  hand: Tile[];
};

export const TableStore = signalStore(
  withState(initialState),
  withEntities<Player>(),
  withComputed((store) => ({
    eastPlayer() {
      const players = store.entities();
      return players.find((p) => p.wind === WindType.EAST)!;
    },
    southPlayer() {
      const players = store.entities();
      return players.find((p) => p.wind === WindType.SOUTH)!;
    },
    westPlayer() {
      const players = store.entities();
      return players.find((p) => p.wind === WindType.WEST)!;
    },
    northPlayer() {
      const players = store.entities();
      return players.find((p) => p.wind === WindType.NORTH)!;
    } 
  })),
  withMethods((store) => ({
    addPlayers(): void {
      patchState(store, addEntities([
        { id: 1, wind: WindType.EAST, hand: [] },
        { id: 2, wind: WindType.SOUTH, hand: [] },
        { id: 3, wind: WindType.WEST, hand: [] },
        { id: 4, wind: WindType.NORTH, hand: [] },
      ] as Player[]));
    },
    setupPlayerHands(): void {
      const players = store.entities();
      store.eastPlayer().hand = store.wallTiles().slice(0, 14);
      store.southPlayer().hand = store.wallTiles().slice(14, 27);
      store.westPlayer().hand = store.wallTiles().slice(27, 40);
      store.northPlayer().hand = store.wallTiles().slice(40, 53);

      patchState(store, {
        wallTiles: store.wallTiles().slice(53)
      });
      patchState(store, updateEntity({ id: store.eastPlayer().id, changes: { hand: store.eastPlayer().hand } }));
      patchState(store, updateEntity({ id: store.southPlayer().id, changes: { hand: store.southPlayer().hand } }));
      patchState(store, updateEntity({ id: store.westPlayer().id, changes: { hand: store.westPlayer().hand } }));
      patchState(store, updateEntity({ id: store.northPlayer().id, changes: { hand: store.northPlayer().hand } }));
    },
    shuffleWallTiles(suffleIterations: number): void {
      const tiles: Tile[] = store.wallTiles();

      for (let i = 0; i < suffleIterations; i++) {
        const idx1 = Math.floor(Math.random() * tiles.length);
        const idx2 = Math.floor(Math.random() * tiles.length);
        const temp = tiles[idx1];
        tiles[idx1] = tiles[idx2];
        tiles[idx2] = temp;
      }

      patchState(store, { wallTiles: tiles });
    }
  })),
  withHooks({
    onInit(store) {
      store.shuffleWallTiles(1000);
      store.addPlayers();
      store.setupPlayerHands();
    },
  }),
);
