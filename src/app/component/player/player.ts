import {
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { SelectedMeld } from '../../model/player';
import { PlayerSeat } from '../../model/player-seat';
import { TileGroup } from '../../model/tile-group';
import { WindTypeDisplayPipe } from '../../pipe/wind-type-display-pipe';
import { TableStore } from '../../store/table-store';
import { ChiOverlay, MeldTransition } from '../chi-overlay/chi-overlay';
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
  hoveredMeld = signal<SelectedMeld | null>(null);
  overlayLeft = signal<number>(0);
  overlayTop = signal<number>(0);
  overlayBottom = signal<number>(0);
  showAbove = signal(false);
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  groupedHand = computed(() => {
    const allTiles = this.currentHand();
    const player = this.player();
    const selectedMelds = player.selectedMelds || [];
    const exposedTileIds = new Set(player.exposedTiles.map((t) => t.id));
    const groups: TileGroup[] = [];

    const usedTileIds = new Set<string>();

    selectedMelds.forEach((meld) => {
      const meldTiles = allTiles.filter((t) => meld.tileIds.includes(t.id));
      if (meldTiles.length === meld.tileIds.length) {
        const hasExposedTile = meldTiles.some((t) => exposedTileIds.has(t.id));
        groups.push({
          tiles: meldTiles,
          isSelectedMeld: true,
          meldId: meld.id,
          meldType: meld.meldType,
          canDismiss: !hasExposedTile,
        });
        meldTiles.forEach((t) => usedTileIds.add(t.id));
      }
    });

    allTiles.forEach((tile) => {
      if (!usedTileIds.has(tile.id)) {
        groups.push({
          tiles: [tile],
          isSelectedMeld: false,
        });
      }
    });

    return groups;
  });

  private hostEl = inject(ElementRef);

  onTileHover(tile: any, event: MouseEvent) {
    this.clearHideTimeout();

    const tileEl = (event.target as HTMLElement).closest('app-tile');
    if (tileEl) {
      const hostRect = this.hostEl.nativeElement.getBoundingClientRect();
      const tileRect = tileEl.getBoundingClientRect();
      this.overlayLeft.set(tileRect.left - hostRect.left);
      this.overlayTop.set(tileRect.top - hostRect.top);
      this.overlayBottom.set(tileRect.bottom - hostRect.top);
      const spaceBelow = window.innerHeight - tileRect.bottom;
      this.showAbove.set(spaceBelow < 150);
    }

    const selectedMelds = this.player().selectedMelds || [];
    const meld = selectedMelds.find((m) => m.tileIds.includes(tile.id));

    if (meld) {
      if (meld.meldType === 'chi') {
        return; // No overlay for CHI groups
      }
      this.hoveredTile.set(tile);
      this.hoveredMeld.set(meld);
    } else {
      this.hoveredTile.set(tile);
      this.hoveredMeld.set(null);
    }
  }

  onTileHoverEnd() {
    this.hideTimeout = setTimeout(() => {
      this.hoveredTile.set(null);
      this.hoveredMeld.set(null);
      this.hideTimeout = null;
    }, 300);
  }

  onOverlayMouseEnter() {
    this.clearHideTimeout();
  }

  onOverlayMouseLeave() {
    this.hideTimeout = setTimeout(() => {
      this.hoveredTile.set(null);
      this.hoveredMeld.set(null);
      this.hideTimeout = null;
    }, 300);
  }

  private clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  onMeldSelected(meld: SelectedMeld) {
    this.tableStore.selectMeld(this.playerSeat(), {
      meldType: meld.meldType,
      tileIds: meld.tileIds,
      tileKey: meld.tileKey,
      suite: meld.suite,
      startNumber: meld.startNumber,
    });
    this.hoveredTile.set(null);
    this.hoveredMeld.set(null);
  }

  onMeldUpgrade(transition: MeldTransition) {
    if (transition.newTileId) {
      this.tableStore.upgradeMeld(
        this.playerSeat(),
        transition.meldId,
        transition.newTileId,
      );
    }
    this.hoveredTile.set(null);
    this.hoveredMeld.set(null);
  }

  onMeldDowngrade(transition: MeldTransition) {
    this.tableStore.downgradeMeld(this.playerSeat(), transition.meldId);
    this.hoveredTile.set(null);
    this.hoveredMeld.set(null);
  }

  onMeldDismiss(meldId: string) {
    this.tableStore.deselectMeld(this.playerSeat(), meldId);
  }
}
