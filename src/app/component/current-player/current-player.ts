import { Component, computed, inject } from '@angular/core';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import { TableStore } from '../../store/table-store';

@Component({
  selector: 'app-current-player',
  imports: [TileDisplayPipe],
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
