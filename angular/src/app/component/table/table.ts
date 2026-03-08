import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlayerSeat } from '../../model/player-seat';
import { WindType } from '../../model/wind-type';
import { TableStore } from '../../store/table-store';
import { Player } from '../player/player';
import { TileSelectorDialog } from '../tile-selector-dialog/tile-selector-dialog';
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
    this.dialog
      .open(TileSelectorDialog)
      .afterClosed()
      .subscribe((tileId: string) => {
        if (tileId) {
          this.tableStore.pickupTile(PlayerSeat.current, undefined, tileId);
        }
      });
  }

  onChangeWind() {
    this.dialog
      .open(WindSlectorDialog)
      .afterClosed()
      .subscribe((wind: WindType) => {
        this.tableStore.updateWind(wind);
      });
  }

  onRandomizeHand() {
    const players = this.tableStore.entities();
    const currentPlayer = players[0];
    if (!currentPlayer) return;

    // Clone the current tile list so we replace each placeholder deterministically
    const tilesToReplace = [...currentPlayer.tiles];
    tilesToReplace.forEach((tile) => {
      this.tableStore.pickupTile(currentPlayer.id as any, tile.id);
    });
  }
}
