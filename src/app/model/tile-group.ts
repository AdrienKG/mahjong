import { Tile } from './tile';

export interface TileGroup {
  tiles: Tile[];
  isSelectedChi: boolean;
  chiId?: string; // If isSelectedChi, the ID of the selected CHI
}
