import { Tile } from './tile';
import { WindType } from './wind-type';

export interface Player {
  id: number;
  wind: WindType;
  tiles: Tile[];
  exposedTiles: Tile[];
  bonusTiles: Tile[];
}
