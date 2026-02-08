import { Tile } from './tile';
import { WindType } from './wind-type';
import { SuitedTileType } from './suited-tile';

export type MeldType = 'chi' | 'pung' | 'kong';

export interface SelectedMeld {
  id: string;
  meldType: MeldType;
  tileIds: string[];
  tileKey?: string; // getTileKey() value for pung/kong identity
  suite?: SuitedTileType; // for CHIs only
  startNumber?: number; // for CHIs only
}

export interface Player {
  id: number;
  wind: WindType;
  tiles: Tile[];
  exposedTiles: Tile[];
  bonusTiles: Tile[];
  selectedMelds?: SelectedMeld[];
}
