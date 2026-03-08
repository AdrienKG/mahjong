import { Pipe, PipeTransform } from '@angular/core';
import { TileType } from '../model/tile-type';

@Pipe({
  name: 'tileTypeDisplay',
})
export class TileTypeDisplayPipe implements PipeTransform {
  transform(value: TileType | string): string {
    switch (value) {
      case TileType.BONUS:
        return 'Bonus';
      case TileType.HONOUR:
        return 'Honour';
      case TileType.SUITED:
        return 'Suited';
      case TileType.UNKNOWN:
      default:
        return 'Unknown';
    }
  }
}
