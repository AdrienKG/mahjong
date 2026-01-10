import { Component, computed, inject, input } from '@angular/core';
import { PlayerSeat } from '../../model/player-seat';
import { SortTilesPipe } from '../../pipe/sort-tiles-pipe';
import { TableStore } from '../../store/table-store';
import { Tile } from '../tile/tile';

@Component({
  selector: 'app-player',
  imports: [SortTilesPipe, Tile],
  templateUrl: './player.html',
  styleUrl: './player.scss',
  host: {
    '[class.vertical]': 'this.playerSeat() === 1 || this.playerSeat() === 3',
  },
})
export class Player {
  tableStore = inject(TableStore);

  playerSeat = input.required<PlayerSeat>();

  player = computed(() => this.tableStore.entities()[this.playerSeat()]);

  public currentHand = computed(() => {
    if (this.player()) {
      return this.player().tiles;
    }
    return [];
  });
}
