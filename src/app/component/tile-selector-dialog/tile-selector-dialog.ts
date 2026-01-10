import { KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BonusTileType } from '../../model/bonus-tile';
import { HonourTileType } from '../../model/honour-tile';
import { SuitedTileType } from '../../model/suited-tile';
import { TileType } from '../../model/tile-type';
import { SortTilesPipe } from '../../pipe/sort-tiles-pipe';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import { TileTypeDisplayPipe } from '../../pipe/tile-type-display-pipe';
import { TableStore } from '../../store/table-store';

@Component({
  selector: 'app-tile-chooser-dialog',
  imports: [
    KeyValuePipe,
    MatButtonModule,
    MatDialogModule,
    SortTilesPipe,
    TileDisplayPipe,
    TileTypeDisplayPipe,
  ],
  templateUrl: './tile-selector-dialog.html',
  styleUrl: './tile-selector-dialog.scss',
})
export class TileSelectorDialog {
  public tileTypes: TileType[] = [
    TileType.BONUS,
    TileType.HONOUR,
    TileType.SUITED,
  ];
  public bonusTileTypes: BonusTileType[] = [
    BonusTileType.FLOWER,
    BonusTileType.SEASON,
  ];
  public honourTileTypes: HonourTileType[] = [
    HonourTileType.DRAGON,
    HonourTileType.WIND,
  ];
  public suitedTileTypes: SuitedTileType[] = [
    SuitedTileType.BAMBOO,
    SuitedTileType.CHARACTER,
    SuitedTileType.DOTS,
  ];

  public store = inject(TableStore);

  public selectedTileType = signal<TileType | string | null>(null);
  public selectedTileId = signal<string>('');
}
