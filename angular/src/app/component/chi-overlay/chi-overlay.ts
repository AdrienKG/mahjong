import {
  Component,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SelectedMeld } from '../../model/player';
import { PlayerSeat } from '../../model/player-seat';
import { Tile } from '../../model/tile';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import {
  PossibleMeld,
  MeldTransition,
  computePossibleMelds,
  computeTransitionOptions,
} from '../../util/meld-detection';

export type { PossibleMeld, MeldTransition } from '../../util/meld-detection';

@Component({
  selector: 'app-chi-overlay',
  imports: [TileDisplayPipe],
  templateUrl: './chi-overlay.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './chi-overlay.scss',
})
export class ChiOverlay {
  hoveredTile = input.required<Tile | null>();
  availableTiles = input.required<Tile[]>();
  selectedMelds = input.required<SelectedMeld[]>();
  hoveredMeld = input.required<SelectedMeld | null>();
  playerId = input.required<PlayerSeat>();
  overlayLeft = input<number>(0);
  tileTop = input<number>(0);
  tileBottom = input<number>(0);

  showAbove = input<boolean>(false);

  meldSelected = output<SelectedMeld>();
  meldUpgrade = output<MeldTransition>();
  meldDowngrade = output<MeldTransition>();
  overlayEnter = output<void>();
  overlayLeave = output<void>();

  overlayTopPx = computed(() =>
    this.showAbove() ? this.tileTop() : this.tileBottom(),
  );

  possibleMelds = computed(() => {
    const hovered = this.hoveredTile();
    if (!hovered) return [];

    const existingMeld = this.hoveredMeld();

    if (existingMeld) {
      return computeTransitionOptions(
        hovered,
        existingMeld,
        this.availableTiles(),
        this.selectedMelds(),
      );
    }

    return computePossibleMelds(
      hovered,
      this.availableTiles(),
      this.selectedMelds(),
    );
  });

  onSelectMeld(meld: PossibleMeld) {
    const existingMeld = this.hoveredMeld();

    if (existingMeld && meld.label === 'Upgrade to Kong') {
      const newTile = meld.tiles.find(
        (t) => !existingMeld.tileIds.includes(t.id),
      );
      if (newTile) {
        this.meldUpgrade.emit({
          meldId: existingMeld.id,
          newTileId: newTile.id,
        });
      }
      return;
    }

    if (existingMeld && meld.label === 'Downgrade to Pung') {
      this.meldDowngrade.emit({ meldId: existingMeld.id });
      return;
    }

    const selectedMeld: SelectedMeld = {
      id: '',
      meldType: meld.meldType,
      tileIds: meld.tiles.map((t) => t.id),
      tileKey: meld.tileKey,
      suite: meld.suite,
      startNumber: meld.startNumber,
    };
    this.meldSelected.emit(selectedMeld);
  }
}
