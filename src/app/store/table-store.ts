import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals"
import { addEntities, updateEntity, withEntities } from "@ngrx/signals/entities"
import { v4 as uuidv4 } from 'uuid'
import { BonusTile, BonusTileColor, BonusTileType } from "../model/bonus-tile"
import { DragonType } from "../model/dragon-type"
import { HonourTile, HonourTileType } from "../model/honour-tile"
import { Player } from "../model/player"
import { SuitedTile, SuitedTileType } from "../model/suited-tile"
import { Tile } from "../model/tile"
import { TileType } from "../model/tile-type"
import { WindType } from "../model/wind-type"

type TableState = {
    wind: WindType,
    discard: Tile[],
    unknown: Tile[], //wall and other player hidden hands
}

const setupTiles = (): Tile[] => {
    const tiles: Tile[] = [];
    for (let i = 1; i <= 4; i++) { // 4 copies of each
        for (let j = 1; j <= 9; j++) {
            tiles.push({
                id: uuidv4(),
                type: TileType.SUITED,
                suite: SuitedTileType.BAMBOO,
                number: j as unknown as number
            } as SuitedTile)
            tiles.push({
                id: uuidv4(),
                type: TileType.SUITED,
                suite: SuitedTileType.CHARACTER,
                number: j as unknown as number
            } as SuitedTile)
            tiles.push({
                id: uuidv4(),
                type: TileType.SUITED,
                suite: SuitedTileType.DOTS,
                number: j as unknown as number
            } as SuitedTile)
        }

        tiles.push({
            id: uuidv4(),
            type: TileType.HONOUR,
            honour: HonourTileType.DRAGON,
            value: DragonType.GREEN
        } as HonourTile)
        tiles.push({
            id: uuidv4(),
            type: TileType.HONOUR,
            honour: HonourTileType.DRAGON,
            value: DragonType.RED
        } as HonourTile)
        tiles.push({
            id: uuidv4(),
            type: TileType.HONOUR,
            honour: HonourTileType.DRAGON,
            value: DragonType.WHITE
        } as HonourTile)

        tiles.push({
            id: uuidv4(),
            type: TileType.HONOUR,
            honour: HonourTileType.WIND,
            value: WindType.EAST
        } as HonourTile)
        tiles.push({
            id: uuidv4(),
            type: TileType.HONOUR,
            honour: HonourTileType.WIND,
            value: WindType.SOUTH
        } as HonourTile)
        tiles.push({
            id: uuidv4(),
            type: TileType.HONOUR,
            honour: HonourTileType.WIND,
            value: WindType.WEST
        } as HonourTile)
        tiles.push({
            id: uuidv4(),
            type: TileType.HONOUR,
            honour: HonourTileType.WIND,
            value: WindType.NORTH
        } as HonourTile)

        //Flowers and Seasons
        tiles.push({
            id: uuidv4(),
            type: TileType.BONUS,
            bonus: BonusTileType.FLOWER,
            number: i as unknown as number,
            color: BonusTileColor.BLACK
        } as BonusTile)
        tiles.push({
            id: uuidv4(),
            type: TileType.BONUS,
            bonus: BonusTileType.SEASON,
            number: i as unknown as number,
            color: BonusTileColor.RED
        } as BonusTile)
    }

    return tiles;
};

const initialState: TableState = {
    wind: WindType.EAST,
    discard: [],
    unknown: setupTiles(),
}

export const TableStore = signalStore(
    { providedIn: 'root' },
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
        pickupTile() {
            const unknowns = store.unknown();
            const indexToRemove = Math.floor(Math.random() * (unknowns.length - 1));
            const tile = unknowns[indexToRemove];

            const currentPlayerTiles = store.entities()[0].tiles;
            currentPlayerTiles.push(tile);

            patchState(store, updateEntity({ id: 0, changes: { tiles: [...currentPlayerTiles] } }))
            patchState(store, (state) => ({ unknown: [...state.unknown.slice(0, indexToRemove), ...state.unknown.slice(indexToRemove + 1)] }))
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
    withComputed((store) => ({
        pairOfEyesOdds() {
            const currentPlayer = store.entities()[0];
            const discardedTiles = store.discard();
            const unknownTiles = store.unknown();

            const suitedCPTiles = currentPlayer.tiles.filter(t => t.type === TileType.SUITED) as SuitedTile[];
            const suitedDiscardedTiles = discardedTiles.filter(t => t.type === TileType.SUITED) as SuitedTile[];
            const suites = [SuitedTileType.BAMBOO, SuitedTileType.CHARACTER, SuitedTileType.DOTS];
            const numbers = [2, 5, 8];

            if (suitedCPTiles.filter(t => t.number === 2 || t.number === 5 || t.number === 8).length === 0) { // No 2, 5 or 8 in hand
                return (36 - suitedDiscardedTiles.filter(t => t.number === 2 || t.number === 5 || t.number === 8).length) / unknownTiles.length;
            }

            const probabilities = suites.flatMap(suite =>
                numbers.map(number => {
                    const cpCount = suitedCPTiles.filter(t => t.suite === suite && t.number === number).length;
                    const discardedCount = suitedDiscardedTiles.filter(t => t.suite === suite && t.number === number).length;

                    if (cpCount < 2) {
                        return (4 - cpCount - discardedCount) / unknownTiles.length;
                    } else if (cpCount === 2) {
                        return 1; // Already have a pair
                    } else {
                        return 0; // Pung or Kong already
                    };
                }
                ));

            const probNoMatch = probabilities.reduce((acc, p) => acc * (1 - p), 1);
            return 1 - probNoMatch;
        },
        pungOfDragonOdds() {
            const currentPlayer = store.entities()[0];
            const discardedTiles = store.discard();
            const unknownTiles = store.unknown();

            const honourCPTiles = currentPlayer.tiles.filter(t => t.type === TileType.HONOUR) as HonourTile[];
            const honourDiscardedTiles = discardedTiles.filter(t => t.type === TileType.HONOUR) as HonourTile[];
            const dragons = [DragonType.RED, DragonType.GREEN, DragonType.WHITE];

            if (honourCPTiles.filter(t => t.honour === HonourTileType.DRAGON).length === 0) { // No dragons in hand
                return (12 - honourDiscardedTiles.filter(t => t.honour === HonourTileType.DRAGON).length) / unknownTiles.length;
            }

            const probabilities = dragons.map(dragon => {
                const cpCount = honourCPTiles.filter(t => t.value === dragon).length;
                const discardedCount = honourDiscardedTiles.filter(t => t.value === dragon).length;

                if (cpCount < 3) {
                    return (4 - cpCount - discardedCount) / unknownTiles.length;
                } else if (cpCount === 3) {
                    return 1; // Already have a pung
                } else {
                    return 0; // Kong already
                };
            }
            );

            const probNoMatch = probabilities.reduce((acc, p) => acc * (1 - p), 1);
            return 1 - probNoMatch;
        }
    })));
