import {
  Component,
  computed,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { Tile as TileInt } from '../../model/tile';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

@Component({
  selector: 'app-tile',
  imports: [TileDisplayPipe],
  templateUrl: './tile.html',
  styleUrl: './tile.css',
  host: {
    '[class.selected]': 'isSelected()',
  },
})
export class Tile {
  public tile = input.required<TileInt>();

  private readonly selected = signal(false);
  public readonly isSelected = computed(() => this.selected());

  @HostListener('click')
  onClick() {
    this.selected.update((value) => !value);
  }
}
