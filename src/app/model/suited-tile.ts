import { Tile } from "./tile";

export interface SuitedTile extends Tile {
  suite: SuitedTileType,
  number: number
}

export enum SuitedTileType {
  CHARACTER,
  BAMBOO,
  DOTS
}