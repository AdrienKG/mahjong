import { Pipe, PipeTransform } from '@angular/core';
import { BonusTile, BonusTileType } from '../model/bonus-tile';
import { DragonType } from '../model/dragon-type';
import { HonourTile, HonourTileType } from '../model/honour-tile';
import { SuitedTile, SuitedTileType } from '../model/suited-tile';
import { Tile } from '../model/tile';
import { TileType } from '../model/tile-type';
import { WindType } from '../model/wind-type';

@Pipe({
  name: 'tileDisplay'
})
export class TileDisplayPipe implements PipeTransform {

  transform(value: Tile): string {
    if (value.type === TileType.SUITED) {
      const tile = value as SuitedTile;
      let character = ''
      switch (tile.suite) {
        case SuitedTileType.BAMBOO:
          character = 'B';
          break;
        case SuitedTileType.CHARACTER:
          character = 'C';
          break;
        case SuitedTileType.DOTS:
          character = 'D';
          break;
      }
      return `${tile.number}${character}`;
    }
    if (value.type === TileType.HONOUR) {
      const tile = value as HonourTile;
      if (tile.honour === HonourTileType.DRAGON) {
        switch (tile.value) {
          case DragonType.GREEN:
            return 'GD';
          case DragonType.RED:
            return 'RD';
          case DragonType.WHITE:
            return 'WD';
        }
      }
      if (tile.honour === HonourTileType.WIND) {
        switch (tile.value) {
          case WindType.EAST:
            return 'E';
          case WindType.SOUTH:
              return 'S';
          case WindType.WEST:
              return 'W';
          case WindType.NORTH:
              return 'N';
        }
      }
    }
    if (value.type === TileType.BONUS) {
      const tile = value as BonusTile;
      let character = ''
      switch (tile.bonus) {
        case BonusTileType.FLOWER:
          character = 'F';
          break;
        case BonusTileType.SEASON:
          character = 'S';
          break;
      }
      return `${tile.number}${character}`;
    }
    return '';
  }
}
