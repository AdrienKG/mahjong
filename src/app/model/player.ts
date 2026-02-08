import { Tile } from './tile';
import { WindType } from './wind-type';
import { SuitedTileType } from './suited-tile';

export interface SelectedChi {
  id: string; // UUID for unique identity
  suite: SuitedTileType;
  startNumber: number; // 1-7
  tileIds: string[]; // IDs of the 3 tiles in this CHI
}

export interface Player {
  id: number;
  wind: WindType;
  tiles: Tile[];
  exposedTiles: Tile[];
  bonusTiles: Tile[];
  selectedChis?: SelectedChi[];
}
