import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Tile as TileInt } from '../../model/tile';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import { TileChooserDialog } from '../tile-chooser-dialog/tile-chooser-dialog';

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
  private dialog = inject(MatDialog)
  public tile = input.required<TileInt>();

  private readonly selected = signal(false);
  public readonly isSelected = computed(() => this.selected());

  onClick() {
    this.selected.update((value) => !value);
  }

  onSet() {
    this.dialog.open(TileChooserDialog).afterClosed().subscribe(() => {

    })
  }
}
