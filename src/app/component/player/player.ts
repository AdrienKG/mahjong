import { Component, computed, inject, input } from '@angular/core';
import { PlayerSeat } from '../../model/player-seat';
import { SortTilesPipe } from '../../pipe/sort-tiles-pipe';
import { TableStore } from '../../store/table-store';
import { Tile } from '../tile/tile';

@Component({
  selector: 'app-player',
  imports: [SortTilesPipe, Tile],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  tableStore = inject(TableStore);

  playerSeat = input.required<PlayerSeat>();

  public currentHand = computed(() => {
    if (this.tableStore.entities()[this.playerSeat()]) {
      return this.tableStore.entities()[this.playerSeat()].tiles;
    }
    return [];
  });
}
