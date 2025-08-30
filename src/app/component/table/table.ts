import { Component, inject } from '@angular/core';
import { ProbabilityPipe } from '../../pipe/probability-pipe';
import { TableStore } from '../../store/table-store';
import { CurrentPlayer } from '../current-player/current-player';

@Component({
  selector: 'app-table',
  imports: [CurrentPlayer, ProbabilityPipe],
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
