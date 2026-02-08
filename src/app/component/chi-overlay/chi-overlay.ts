import { Component, computed, input, output } from '@angular/core';
import { BonusTile } from '../../model/bonus-tile';
import { HonourTile } from '../../model/honour-tile';
import { MeldType, SelectedMeld } from '../../model/player';
import { PlayerSeat } from '../../model/player-seat';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { Tile } from '../../model/tile';
import { TileType } from '../../model/tile-type';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

export interface PossibleMeld {
  meldType: MeldType;
  tiles: Tile[];
  tileKey?: string;
  suite?: SuitedTileType;
  startNumber?: number;
  label: string; // e.g. "CHI", "Pung", "Kong", "Upgrade to Kong"
}

export interface MeldTransition {
  meldId: string;
  newTileId?: string; // for upgrade
  removedTileId?: string; // for downgrade
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
      return this.getTransitionOptions(hovered, existingMeld);
    }

    return this.getNewMeldOptions(hovered);
  });

  private getTransitionOptions(
    hovered: Tile,
    meld: SelectedMeld,
  ): PossibleMeld[] {
    const options: PossibleMeld[] = [];

    if (meld.meldType === 'pung') {
      // Check if 4th tile exists for kong upgrade
      const tileKey = this.getTileKey(hovered);
      const usedTileIds = this.getUsedTileIds();
      const freeTiles = this.availableTiles().filter(
        (t) => !usedTileIds.has(t.id) && this.getTileKey(t) === tileKey,
      );

      if (freeTiles.length > 0) {
        const meldTiles = this.availableTiles().filter((t) =>
          meld.tileIds.includes(t.id),
        );
        options.push({
          meldType: 'kong',
          tiles: [...meldTiles, freeTiles[0]],
          tileKey,
          label: 'Upgrade to Kong',
        });
      }
    } else if (meld.meldType === 'kong') {
      // Offer pung downgrade
      const meldTiles = this.availableTiles().filter((t) =>
        meld.tileIds.includes(t.id),
      );
      if (meldTiles.length === 4) {
        options.push({
          meldType: 'pung',
          tiles: meldTiles.slice(0, 3),
          tileKey: meld.tileKey,
          label: 'Downgrade to Pung',
        });
      }
    }

    return options;
  }

  private getNewMeldOptions(hovered: Tile): PossibleMeld[] {
    const options: PossibleMeld[] = [];
    const usedTileIds = this.getUsedTileIds();
    const freeTiles = this.availableTiles().filter(
      (t) => !usedTileIds.has(t.id),
    );

    // Detect CHIs (suited tiles only)
    if (hovered.type === TileType.SUITED) {
      const suitedTile = hovered as SuitedTile;
      options.push(...this.detectPossibleChis(suitedTile, freeTiles));
    }

    // Detect Pungs and Kongs (any tile type except UNKNOWN/BONUS)
    if (hovered.type !== TileType.UNKNOWN && hovered.type !== TileType.BONUS) {
      options.push(...this.detectPossiblePungsKongs(hovered, freeTiles));
    }

    return options;
  }

  private detectPossibleChis(
    hovered: SuitedTile,
    freeTiles: Tile[],
  ): PossibleMeld[] {
    const suite = hovered.suite;
    const number = hovered.number;
    const options: PossibleMeld[] = [];

    const suitedFreeTiles = freeTiles.filter(
      (t) => t.type === TileType.SUITED && (t as SuitedTile).suite === suite,
    ) as SuitedTile[];

    const tilesByNumber = new Map<number, SuitedTile[]>();
    suitedFreeTiles.forEach((tile) => {
      if (!tilesByNumber.has(tile.number)) {
        tilesByNumber.set(tile.number, []);
      }
      tilesByNumber.get(tile.number)!.push(tile);
    });

    const patterns = [
      { start: number - 2, nums: [number - 2, number - 1, number] },
      { start: number - 1, nums: [number - 1, number, number + 1] },
      { start: number, nums: [number, number + 1, number + 2] },
    ];

    for (const pattern of patterns) {
      if (pattern.nums[0] < 1 || pattern.nums[2] > 9) continue;

      const t1 = tilesByNumber.get(pattern.nums[0]);
      const t2 = tilesByNumber.get(pattern.nums[1]);
      const t3 = tilesByNumber.get(pattern.nums[2]);

      if (t1?.length && t2?.length && t3?.length) {
        options.push({
          meldType: 'chi',
          tiles: [t1[0], t2[0], t3[0]],
          suite,
          startNumber: pattern.start,
          label: 'CHI',
        });
      }
    }

    return options;
  }

  private detectPossiblePungsKongs(
    hovered: Tile,
    freeTiles: Tile[],
  ): PossibleMeld[] {
    const options: PossibleMeld[] = [];
    const hoveredKey = this.getTileKey(hovered);

    const matchingTiles = freeTiles.filter(
      (t) => this.getTileKey(t) === hoveredKey,
    );

    if (matchingTiles.length >= 3) {
      options.push({
        meldType: 'pung',
        tiles: matchingTiles.slice(0, 3),
        tileKey: hoveredKey,
        label: 'Pung',
      });
    }

    if (matchingTiles.length >= 4) {
      options.push({
        meldType: 'kong',
        tiles: matchingTiles.slice(0, 4),
        tileKey: hoveredKey,
        label: 'Kong',
      });
    }

    return options;
  }

  private getUsedTileIds(): Set<string> {
    const usedTileIds = new Set<string>();
    this.selectedMelds().forEach((m) => {
      m.tileIds.forEach((id) => usedTileIds.add(id));
    });
    return usedTileIds;
  }

  private getTileKey(tile: Tile): string {
    const type = tile.type;
    if (type === TileType.SUITED) {
      const st = tile as SuitedTile;
      return `${type}-${st.suite}-${st.number}`;
    } else if (type === TileType.HONOUR) {
      const ht = tile as HonourTile;
      return `${type}-${ht.honour}-${ht.value}`;
    } else if (type === TileType.BONUS) {
      const bt = tile as BonusTile;
      return `${type}-${bt.bonus}-${bt.number}`;
    }
    return `${type}`;
  }

  onSelectMeld(meld: PossibleMeld) {
    const existingMeld = this.hoveredMeld();

    if (existingMeld && meld.label === 'Upgrade to Kong') {
      // Find the new tile (the one not in the existing meld)
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
