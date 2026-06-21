import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BonusTile, BonusTileType } from '../../model/bonus-tile';
import { HonourTile, HonourTileType } from '../../model/honour-tile';
import { SuitedTile, SuitedTileType } from '../../model/suited-tile';
import { Tile } from '../../model/tile';
import { TileType } from '../../model/tile-type';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import { TableStore } from '../../store/table-store';

interface TileCategory {
  name: string;
  tiles: Tile[];
}

@Component({
  selector: 'app-tile-chooser-dialog',
  imports: [CommonModule, MatButtonModule, MatDialogModule, TileDisplayPipe],
  templateUrl: './tile-selector-dialog.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tile-selector-dialog.scss',
})
export class TileSelectorDialog {
  public store = inject(TableStore);
  public tileDisplayPipe = inject(TileDisplayPipe);

  public bambooTiles = computed(() => {
    return this.createTileMapByDisplay(
      (t) =>
        t.type === TileType.SUITED &&
        (t as SuitedTile).suite === SuitedTileType.BAMBOO,
    );
  });

  public characterTiles = computed(() => {
    return this.createTileMapByDisplay(
      (t) =>
        t.type === TileType.SUITED &&
        (t as SuitedTile).suite === SuitedTileType.CHARACTER,
    );
  });

  public dotTiles = computed(() => {
    return this.createTileMapByDisplay(
      (t) =>
        t.type === TileType.SUITED &&
        (t as SuitedTile).suite === SuitedTileType.DOTS,
    );
  });

  public windTiles = computed(() => {
    return this.createTileMapByDisplay(
      (t) =>
        t.type === TileType.HONOUR &&
        (t as HonourTile).honour === HonourTileType.WIND,
    );
  });

  public dragonTiles = computed(() => {
    return this.createTileMapByDisplay(
      (t) =>
        t.type === TileType.HONOUR &&
        (t as HonourTile).honour === HonourTileType.DRAGON,
    );
  });

  public flowerTiles = computed(() => {
    return this.createTileMapByDisplay(
      (t) =>
        t.type === TileType.BONUS &&
        (t as BonusTile).bonus === BonusTileType.FLOWER,
    );
  });

  public seasonTiles = computed(() => {
    return this.createTileMapByDisplay(
      (t) =>
        t.type === TileType.BONUS &&
        (t as BonusTile).bonus === BonusTileType.SEASON,
    );
  });

  public tileSets = computed(() => {
    return [
      { name: 'Bamboo', tiles: this.bambooTiles() },
      { name: 'Characters', tiles: this.characterTiles() },
      { name: 'Dots', tiles: this.dotTiles() },
      { name: 'Winds', tiles: this.windTiles() },
      { name: 'Dragons', tiles: this.dragonTiles() },
      { name: 'Flowers', tiles: this.flowerTiles() },
      { name: 'Seasons', tiles: this.seasonTiles() },
    ];
  });

  private createTileMapByDisplay(
    predicate: (tile: Tile) => boolean,
  ): Map<string, Tile[]> {
    const typedTiles = this.store.tiles().filter(predicate);
    const tileMap = new Map<string, Tile[]>();

    typedTiles.forEach((tile) => {
      const displayKey = this.tileDisplayPipe.transform(tile);
      if (!tileMap.has(displayKey)) {
        tileMap.set(displayKey, []);
      }
      tileMap.get(displayKey)!.push(tile);
    });
    return tileMap;
  }
}
