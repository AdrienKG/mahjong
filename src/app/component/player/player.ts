import { Component, computed, inject, input, signal } from '@angular/core';
import { SelectedChi } from '../../model/player';
import { PlayerSeat } from '../../model/player-seat';
import { TileGroup } from '../../model/tile-group';
import { WindTypeDisplayPipe } from '../../pipe/wind-type-display-pipe';
import { TableStore } from '../../store/table-store';
import { ChiOverlay } from '../chi-overlay/chi-overlay';
import { Tile } from '../tile/tile';

@Component({
  selector: 'app-player',
  imports: [ChiOverlay, Tile, WindTypeDisplayPipe],
  templateUrl: './player.html',
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

  hoveredTile = signal<any>(null);
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  groupedHand = computed(() => {
    const allTiles = this.currentHand();
    const selectedChis = this.player().selectedChis || [];
    const groups: TileGroup[] = [];

    // Track which tiles are used in selected CHIs
    const usedTileIds = new Set<string>();

    // Create groups for selected CHIs
    selectedChis.forEach((chi) => {
      const chiTiles = allTiles.filter((t) => chi.tileIds.includes(t.id));
      if (chiTiles.length === 3) {
        groups.push({
          tiles: chiTiles,
          isSelectedChi: true,
          chiId: chi.id,
        });
        chiTiles.forEach((t) => usedTileIds.add(t.id));
      }
    });

    // Add remaining tiles as individual groups
    allTiles.forEach((tile) => {
      if (!usedTileIds.has(tile.id)) {
        groups.push({
          tiles: [tile],
          isSelectedChi: false,
        });
      }
    });

    return groups;
  });

  onTileHover(tile: any) {
    this.clearHideTimeout();
    this.hoveredTile.set(tile);
  }

  onTileHoverEnd() {
    this.hideTimeout = setTimeout(() => {
      this.hoveredTile.set(null);
      this.hideTimeout = null;
    }, 300);
  }

  onOverlayMouseEnter() {
    this.clearHideTimeout();
  }

  onOverlayMouseLeave() {
    this.hideTimeout = setTimeout(() => {
      this.hoveredTile.set(null);
      this.hideTimeout = null;
    }, 300);
  }

  private clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  onChiSelected(chi: SelectedChi) {
    this.tableStore.selectChi(this.playerSeat(), {
      suite: chi.suite,
      startNumber: chi.startNumber,
      tileIds: chi.tileIds,
    });
    this.hoveredTile.set(null); // Close overlay after selection
  }

  onChiDismiss(chiId: string) {
    this.tableStore.deselectChi(this.playerSeat(), chiId);
  }
}
