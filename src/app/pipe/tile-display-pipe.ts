import { Pipe, PipeTransform } from '@angular/core';
import { BonusTile, BonusTileType } from '../model/bonus-tile';
import { DragonType } from '../model/dragon-type';
import { HonourTile, HonourTileType } from '../model/honour-tile';
import { SuitedTile, SuitedTileType } from '../model/suited-tile';
import { Tile } from '../model/tile';
import { TileType } from '../model/tile-type';
import { WindType } from '../model/wind-type';

@Pipe({
  name: 'tileDisplay',
})
export class TileDisplayPipe implements PipeTransform {
  transform(value: Tile, long: boolean = false): string {
    if (value.type === TileType.SUITED) {
      const tile = value as SuitedTile;
      let character = '';
      switch (tile.suite) {
        case SuitedTileType.BAMBOO:
          character = long ? 'Bamboo' : 'B';
          break;
        case SuitedTileType.CHARACTER:
          character = long ? 'Character' : 'C';
          break;
        case SuitedTileType.DOTS:
          character = long ? 'Dot' : 'D';
          break;
      }
      return long ? `${tile.number} ${character}` : `${tile.number}${character}`;
    }
    if (value.type === TileType.HONOUR) {
      const tile = value as HonourTile;
      if (tile.honour === HonourTileType.DRAGON) {
        switch (tile.value) {
          case DragonType.GREEN:
            return long ? 'Green Dragon' : 'GD';
          case DragonType.RED:
            return long ? 'Red Dragon': 'RD';
          case DragonType.WHITE:
            return long ? 'White Dragon' : 'WD';
        }
      }
      if (tile.honour === HonourTileType.WIND) {
        switch (tile.value) {
          case WindType.EAST:
            return long ? 'East' : 'E';
          case WindType.SOUTH:
            return long ? 'South' : 'S';
          case WindType.WEST:
            return long ? 'West' : 'W';
          case WindType.NORTH:
            return long ? 'North' : 'N';
        }
      }
    }
    if (value.type === TileType.BONUS) {
      const tile = value as BonusTile;
      let character = '';
      switch (tile.bonus) {
        case BonusTileType.FLOWER:
          character = long ? 'Flower' : 'F';
          break;
        case BonusTileType.SEASON:
          character = long ? 'South' : 'S';
          break;
      }
      return long ? `${tile.number} ${character}` : `${tile.number}${character}`;
    }
    if (value.type === TileType.UNKNOWN) {
      return '??';
    }
    return '';
  }
}
