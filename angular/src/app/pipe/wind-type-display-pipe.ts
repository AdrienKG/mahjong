import { Pipe, PipeTransform } from '@angular/core';
import { WindType } from '../model/wind-type';

@Pipe({
  name: 'windTypeDisplay',
})
export class WindTypeDisplayPipe implements PipeTransform {
  transform(value: WindType): string {
    switch (value) {
      case WindType.EAST:
        return 'East';
      case WindType.SOUTH:
        return 'South';
      case WindType.WEST:
        return 'West';
      case WindType.NORTH:
        return 'North';
      default:
        return 'Unknown';
    }
  }
}
