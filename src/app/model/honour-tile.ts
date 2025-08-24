import { DragonType } from "./dragon-type";
import { Tile } from "./tile";
import { WindType } from "./wind-type";

export interface HonourTile extends Tile {
  honour: HonourTileType,
  value: DragonType | WindType
}

export enum HonourTileType {
    WIND,
    DRAGON
}