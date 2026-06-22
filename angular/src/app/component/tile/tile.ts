import {
  Component,
  computed,
  inject,
  input,
  output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Tile as TileInt } from '../../model/tile';
import { TileType } from '../../model/tile-type';
import { WindType } from '../../model/wind-type';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import { TableStore } from '../../store/table-store';
import { TileSelectorDialog } from '../tile-selector-dialog/tile-selector-dialog';

@Component({
  selector: 'app-tile',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, TileDisplayPipe],
  templateUrl: './tile.html',
  styleUrl: './tile.scss',
})
export class Tile {
  private tableStore = inject(TableStore);
  private dialog = inject(MatDialog);
  public tile = input.required<TileInt>();
  public playerId = input.required<WindType>();

  public readonly isUnknown = computed(
    () => this.tile().type === TileType.UNKNOWN,
  );
  

  tileClicked = output<void>();

  onSet() {
    this.dialog
      .open(TileSelectorDialog)
      .afterClosed()
      .subscribe((tileId: string) => {
        // if (tileId) {
        //   this.tableStore.pickupTile(this.playerId(), this.tile().id, tileId);
        // }
      });
  }

  onDiscard() {
    // this.tableStore.discardTile(this.playerId(), this.tile().id);
  }

  onToggleExpose() {
    // this.tableStore.toggleExposeTile(this.playerId(), this.tile().id);
  }
}
