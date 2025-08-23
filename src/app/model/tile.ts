import { BonusTileType } from "./bonus-tile-type";
import { DragonType } from "./dragon-type";
import { FlowerType } from "./flower-type";
import { HonourTileType } from "./honour-tile-type";
import { SeasonType } from "./season-type";
import { SuitedTileType } from "./suited-tile-type";
import { WindType } from "./wind-type";

export interface Tile {
    id?: number,
    type: SuitedTileType | HonourTileType | BonusTileType,
    number?: number
    honour?: WindType | DragonType
    bonus?: FlowerType | SeasonType
}