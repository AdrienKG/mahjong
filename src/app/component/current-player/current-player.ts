import { Component, computed, inject } from '@angular/core';
import { SortTilesPipe } from '../../pipe/sort-tiles-pipe';
import { TableStore } from '../../store/table-store';
import { Tile } from '../tile/tile';

@Component({
  selector: 'app-current-player',
  imports: [SortTilesPipe, Tile],
  templateUrl: './current-player.html',
  styleUrl: './current-player.css'
})
export class CurrentPlayer {
    tableStore = inject(TableStore);

    public currentHand = computed(() => {
      if (this.tableStore.entities()[0]) {
        return this.tableStore.entities()[0].tiles;
      }
      return [];
    });
}
