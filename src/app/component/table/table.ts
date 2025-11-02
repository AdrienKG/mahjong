import { Component, inject } from '@angular/core';
import { PlayerSeat } from '../../model/player-seat';
import { TableStore } from '../../store/table-store';
import { Player } from '../player/player';

@Component({
  selector: 'app-table',
  imports: [Player],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  playerSeat = PlayerSeat;

  tableStore = inject(TableStore);

  onAddPlayers() {
    this.tableStore.addPlayers();
  }

  onPickup() {
    this.tableStore.pickupTile();
  }
}
