import { Component, computed, input, output } from '@angular/core';
import { SelectedChi } from '../../model/player';
import { PlayerSeat } from '../../model/player-seat';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { Tile } from '../../model/tile';
import { TileType } from '../../model/tile-type';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

interface PossibleChi {
  suite: SuitedTileType;
  startNumber: number;
  tiles: SuitedTile[];
}

@Component({
  selector: 'app-chi-overlay',
  imports: [TileDisplayPipe],
  templateUrl: './chi-overlay.html',
  styleUrl: './chi-overlay.scss',
})
export class ChiOverlay {
  hoveredTile = input.required<Tile | null>();
  availableTiles = input.required<Tile[]>();
  selectedChis = input.required<SelectedChi[]>();
  playerId = input.required<PlayerSeat>();

  chiSelected = output<SelectedChi>();
  overlayEnter = output<void>();
  overlayLeave = output<void>();

  possibleChis = computed(() => {
    const hovered = this.hoveredTile();
    if (!hovered || hovered.type !== TileType.SUITED) {
      return [];
    }

    const suitedTile = hovered as SuitedTile;
    const suite = suitedTile.suite;
    const number = suitedTile.number;

    // Get all available tiles of the same suite
    const availableSuitedTiles = this.availableTiles().filter(
      (t) => t.type === TileType.SUITED && (t as SuitedTile).suite === suite,
    ) as SuitedTile[];

    // Get tile IDs that are already in selected CHIs
    const usedTileIds = new Set<string>();
    this.selectedChis().forEach((chi) => {
      chi.tileIds.forEach((id) => usedTileIds.add(id));
    });

    // Filter out tiles already in selected CHIs
    const freeTiles = availableSuitedTiles.filter(
      (t) => !usedTileIds.has(t.id),
    );

    // Build a map of number -> tiles for this suite
    const tilesByNumber = new Map<number, SuitedTile[]>();
    freeTiles.forEach((tile) => {
      if (!tilesByNumber.has(tile.number)) {
        tilesByNumber.set(tile.number, []);
      }
      tilesByNumber.get(tile.number)!.push(tile);
    });

    const possibleChis: PossibleChi[] = [];

    // Check three possible CHI patterns
    // Pattern 1: [n-2, n-1, n] (hovered tile is the last)
    if (number >= 3) {
      const tiles1 = tilesByNumber.get(number - 2) || [];
      const tiles2 = tilesByNumber.get(number - 1) || [];
      const tiles3 = tilesByNumber.get(number) || [];

      if (tiles1.length > 0 && tiles2.length > 0 && tiles3.length > 0) {
        possibleChis.push({
          suite,
          startNumber: number - 2,
          tiles: [tiles1[0], tiles2[0], tiles3[0]],
        });
      }
    }

    // Pattern 2: [n-1, n, n+1] (hovered tile is in the middle)
    if (number >= 2 && number <= 8) {
      const tiles1 = tilesByNumber.get(number - 1) || [];
      const tiles2 = tilesByNumber.get(number) || [];
      const tiles3 = tilesByNumber.get(number + 1) || [];

      if (tiles1.length > 0 && tiles2.length > 0 && tiles3.length > 0) {
        possibleChis.push({
          suite,
          startNumber: number - 1,
          tiles: [tiles1[0], tiles2[0], tiles3[0]],
        });
      }
    }

    // Pattern 3: [n, n+1, n+2] (hovered tile is the first)
    if (number <= 7) {
      const tiles1 = tilesByNumber.get(number) || [];
      const tiles2 = tilesByNumber.get(number + 1) || [];
      const tiles3 = tilesByNumber.get(number + 2) || [];

      if (tiles1.length > 0 && tiles2.length > 0 && tiles3.length > 0) {
        possibleChis.push({
          suite,
          startNumber: number,
          tiles: [tiles1[0], tiles2[0], tiles3[0]],
        });
      }
    }

    return possibleChis;
  });

  onSelectChi(chi: PossibleChi) {
    const selectedChi: SelectedChi = {
      id: '', // Will be set by store
      suite: chi.suite,
      startNumber: chi.startNumber,
      tileIds: chi.tiles.map((t) => t.id),
    };
    this.chiSelected.emit(selectedChi);
  }
}
