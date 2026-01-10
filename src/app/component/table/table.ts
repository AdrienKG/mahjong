import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlayerSeat } from '../../model/player-seat';
import { WindType } from '../../model/wind-type';
import { TableStore } from '../../store/table-store';
import { Player } from '../player/player';
import { WindSlectorDialog } from '../wind-slector-dialog/wind-slector-dialog';

@Component({
  selector: 'app-table',
  imports: [Player],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  private dialog = inject(MatDialog);

  playerSeat = PlayerSeat;

  tableStore = inject(TableStore);

  onPickup() {
    this.tableStore.pickupTile();
  }

  onChangeWind() {
    this.dialog
      .open(WindSlectorDialog)
      .afterClosed()
      .subscribe((wind: WindType) => {
        this.tableStore.updateWind(wind);
      });
  }
}
