import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableStore } from '../../store/table-store';
import { Player } from '../player/player';
import { TileSelectorDialog } from '../tile-selector-dialog/tile-selector-dialog';

@Component({
  selector: 'app-table',
  imports: [Player],
  providers: [TableStore],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  private dialog = inject(MatDialog);

  tableStore = inject(TableStore);

  onPickup() {
    this.dialog
      .open(TileSelectorDialog)
      .afterClosed()
      .subscribe((tileId: string) => {
        if (tileId) {
          // this.tableStore.pickupTile(PlayerSeat.current, undefined, tileId);
        }
      });
  }
}
