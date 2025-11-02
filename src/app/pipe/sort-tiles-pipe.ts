import { Pipe, PipeTransform } from '@angular/core';
import { BonusTile, BonusTileColor, BonusTileType } from '../model/bonus-tile';
import { DragonType } from '../model/dragon-type';
import { HonourTile, HonourTileType } from '../model/honour-tile';
import { SuitedTile, SuitedTileType } from '../model/suited-tile';
import { Tile } from '../model/tile';
import { TileType } from '../model/tile-type';
import { WindType } from '../model/wind-type';

@Pipe({
  name: 'sortTiles',
})
export class SortTilesPipe implements PipeTransform {
  transform(value: Tile[]): Tile[] {
    return value.sort((t1, t2) => {
      let t1Value = this.generateValue(t1);
      let t2Value = this.generateValue(t2);

      if (t1Value > t2Value) {
        return 1;
      }

      return -1;
    });
  }

  generateValue(t: Tile): number {
    let value = 0;
    if (t.type === TileType.BONUS) {
      value += 1000;
      const tile = t as BonusTile;
      if (tile.bonus === BonusTileType.FLOWER) {
        value += 100;
        if (tile.color === BonusTileColor.BLACK) {
          value += 10;
        }
        if (tile.color === BonusTileColor.RED) {
          value += 20;
        }
      }
      if (tile.bonus === BonusTileType.SEASON) {
        value += 200;
        if (tile.color === BonusTileColor.BLACK) {
          value += 10;
        }
        if (tile.color === BonusTileColor.RED) {
          value += 20;
        }
      }
      value += tile.number;
    }

    if (t.type === TileType.HONOUR) {
      value += 2000;
      const tile = t as HonourTile;
      if (tile.honour === HonourTileType.WIND) {
        value += 100;
        if (tile.value === WindType.EAST) {
          value += 10;
        }
        if (tile.value === WindType.SOUTH) {
          value += 20;
        }
        if (tile.value === WindType.WEST) {
          value += 30;
        }
        if (tile.value === WindType.NORTH) {
          value += 40;
        }
      }
      if (tile.honour === HonourTileType.DRAGON) {
        value += 200;
        if (tile.value === DragonType.GREEN) {
          value += 10;
        }
        if (tile.value === DragonType.RED) {
          value += 20;
        }
        if (tile.value === DragonType.WHITE) {
          value += 30;
        }
      }
    }

    if (t.type === TileType.SUITED) {
      value += 3000;
      const tile = t as SuitedTile;
      if (tile.suite === SuitedTileType.BAMBOO) {
        value += 100;
      }
      if (tile.suite === SuitedTileType.CHARACTER) {
        value += 200;
      }
      if (tile.suite === SuitedTileType.DOTS) {
        value += 300;
      }
      value += tile.number;
    }

    return value;
  }
}
