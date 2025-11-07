import { Component, computed, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Tile as TileInt } from '../../model/tile';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

@Component({
  selector: 'app-tile',
  imports: [MatButtonModule, MatMenuModule, TileDisplayPipe],
  templateUrl: './tile.html',
  styleUrl: './tile.scss',
  host: {
    '[class.selected]': 'isSelected()',
  },
})
export class Tile {
  public tile = input.required<TileInt>();

  private readonly selected = signal(false);
  public readonly isSelected = computed(() => this.selected());

  onClick() {
    this.selected.update((value) => !value);
  }
}
