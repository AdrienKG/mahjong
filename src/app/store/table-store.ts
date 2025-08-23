import { patchState, signalStore, withMethods, withState } from "@ngrx/signals"
import { addEntities, updateEntity, withEntities } from "@ngrx/signals/entities"
import { BonusTileType } from "../model/bonus-tile-type"
import { DragonType } from "../model/dragon-type"
import { FlowerType } from "../model/flower-type"
import { HonourTileType } from "../model/honour-tile-type"
import { Player } from "../model/player"
import { SuitedTileType } from "../model/suited-tile-type"
import { Tile } from "../model/tile"
import { WindType } from "../model/wind-type"

type TableState = {
    wind: WindType,
    discard: Tile[],
    unknown: Tile[], //wall and other player hidden hands
}

const setupTiles = (): Tile[] => {
    const tiles: Tile[] = [];

    for (const type in SuitedTileType) {
        for (const number in [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            for (const copy in [1, 2, 3, 4]) {
                tiles.push({
                    id: copy as unknown as number,
                    type: type as unknown as SuitedTileType,
                    number: number as unknown as number
                })
            }
        }
    }

    for (const type in DragonType) {
        for (const copy in [1, 2, 3, 4]) {
            tiles.push({
                id: copy as unknown as number,
                type: HonourTileType.DRAGON,
                honour: type as unknown as DragonType
            })
        }
    }

    for (const type in WindType) {
        for (const copy in [1, 2, 3, 4]) {
            tiles.push({
                id: copy as unknown as number,
                type: HonourTileType.WIND,
                honour: type as unknown as WindType
            })
        }
    }

    for (const type in FlowerType) {
        for (const number in [1, 2, 3, 4]) {
            tiles.push({
                number: number as unknown as number,
                type: BonusTileType.FLOWER,
                bonus: type as unknown as FlowerType
            })
        }
    }

    return tiles;
};

const initialState: TableState = {
    wind: WindType.EAST,
    discard: [],
    unknown: setupTiles(),
}

export const TableStore = signalStore(
    withState(initialState),
    withEntities<Player>(),
    withMethods((store) => ({
        addPlayers() {
            patchState(store, addEntities([{
                id: 0,
                wind: WindType.EAST,
                tiles: [],
                exposedTiles: [],
                bonusTiles: [],
            },
            {
                id: 1,
                wind: WindType.SOUTH,
                tiles: [],
                exposedTiles: [],
                bonusTiles: [],
            },
            {
                id: 2,
                wind: WindType.WEST,
                tiles: [],
                exposedTiles: [],
                bonusTiles: [],
            },
            {
                id: 3,
                wind: WindType.NORTH,
                tiles: [],
                exposedTiles: [],
                bonusTiles: [],
            }
            ] as Player[]))
        },
        updateWind(wind: WindType) {
            switch (wind) {
                case WindType.EAST:
                    patchState(store, updateEntity({ id: 0, changes: { wind: WindType.EAST } }));
                    patchState(store, updateEntity({ id: 1, changes: { wind: WindType.SOUTH } }));
                    patchState(store, updateEntity({ id: 2, changes: { wind: WindType.WEST } }));
                    patchState(store, updateEntity({ id: 3, changes: { wind: WindType.NORTH } }));
                    break;
                case WindType.SOUTH:
                    patchState(store, updateEntity({ id: 0, changes: { wind: WindType.SOUTH } }));
                    patchState(store, updateEntity({ id: 1, changes: { wind: WindType.WEST } }));
                    patchState(store, updateEntity({ id: 2, changes: { wind: WindType.NORTH } }));
                    patchState(store, updateEntity({ id: 3, changes: { wind: WindType.EAST } }));
                    break;
                case WindType.WEST:
                    patchState(store, updateEntity({ id: 0, changes: { wind: WindType.WEST } }));
                    patchState(store, updateEntity({ id: 1, changes: { wind: WindType.NORTH } }));
                    patchState(store, updateEntity({ id: 2, changes: { wind: WindType.EAST } }));
                    patchState(store, updateEntity({ id: 3, changes: { wind: WindType.SOUTH } }));
                    break;
                case WindType.NORTH:
                    patchState(store, updateEntity({ id: 0, changes: { wind: WindType.NORTH } }));
                    patchState(store, updateEntity({ id: 1, changes: { wind: WindType.EAST } }));
                    patchState(store, updateEntity({ id: 2, changes: { wind: WindType.SOUTH } }));
                    patchState(store, updateEntity({ id: 3, changes: { wind: WindType.WEST } }));
                    break;
            }
        }
    })),
);