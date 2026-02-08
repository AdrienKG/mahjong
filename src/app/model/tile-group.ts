import { Tile } from './tile';
import { MeldType } from './player';

export interface TileGroup {
  tiles: Tile[];
  isSelectedMeld: boolean;
  meldId?: string;
  meldType?: MeldType;
  canDismiss?: boolean; // false when any tile is exposed
}
