import { Component, inject } from '@angular/core';
import { TableStore } from '../../store/table-store';
import { CurrentPlayer } from '../current-player/current-player';

@Component({
  selector: 'app-table',
  imports: [CurrentPlayer],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  tableStore = inject(TableStore);

  onAddPlayers() {
    this.tableStore.addPlayers();
  }

  onPickup() {
    this.tableStore.pickupTile();
  }
}
