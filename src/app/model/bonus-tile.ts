import { Tile } from './tile';

export interface BonusTile extends Tile {
  bonus: BonusTileType;
  color: BonusTileColor;
  number: number;
}

export enum BonusTileType {
  FLOWER,
  SEASON,
}

export enum BonusTileColor {
  BLACK,
  RED,
}
