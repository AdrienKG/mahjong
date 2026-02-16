import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PlayerSeat } from '../../model/player-seat';
import { Tile as TileInt } from '../../model/tile';
import { TileType } from '../../model/tile-type';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import { TableStore } from '../../store/table-store';
import { TileSelectorDialog } from '../tile-selector-dialog/tile-selector-dialog';

@Component({
  selector: 'app-tile',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, TileDisplayPipe],
  templateUrl: './tile.html',
  styleUrl: './tile.scss',
})
export class Tile {
  private tableStore = inject(TableStore);
  private dialog = inject(MatDialog);
  public tile = input.required<TileInt>();
  public playerId = input.required<PlayerSeat>();

  public readonly isUnknown = computed(
    () => this.tile().type === TileType.UNKNOWN,
  );
  public readonly isExposed = computed(() => {
    const player = this.tableStore
      .entities()
      .find((p) => p.id === this.playerId());
    if (!player) return false;
    return player.exposedTiles.some((t) => t.id === this.tile().id);
  });

  onSet() {
    this.dialog
      .open(TileSelectorDialog)
      .afterClosed()
      .subscribe((tileId: string) => {
        if (tileId) {
          this.tableStore.pickupTile(this.playerId(), this.tile().id, tileId);
        }
      });
  }

  onDiscard() {
    this.tableStore.discardTile(this.playerId(), this.tile().id);
  }

  onToggleExpose() {
    this.tableStore.toggleExposeTile(this.playerId(), this.tile().id);
  }
}
