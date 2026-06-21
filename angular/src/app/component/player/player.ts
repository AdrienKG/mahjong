import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { PlayerSeat } from '../../model/player-seat';
import { WindTypeDisplayPipe } from '../../pipe/wind-type-display-pipe';
import { TableStore } from '../../store/table-store';
import { Tile } from '../tile/tile';

@Component({
  selector: 'app-player',
  imports: [Tile, WindTypeDisplayPipe],
  templateUrl: './player.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './player.scss',
})
export class Player {
  tableStore = inject(TableStore);

  playerSeat = input.required<PlayerSeat>();

  player = computed(() => this.tableStore.entities()[this.playerSeat()]);

  public currentHand = computed(() => {
    if (this.player()) {
      return [...this.player().exposedTiles, ...this.player().tiles];
    }
    return [];
  });
}
