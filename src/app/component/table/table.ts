import { Component, inject } from '@angular/core';
import { TableStore } from '../../store/table-store';
import { CurrentPlayer } from '../current-player/current-player';
import { OddsPanel } from "../odds-panel/odds-panel";

@Component({
  selector: 'app-table',
  imports: [CurrentPlayer, OddsPanel],
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
