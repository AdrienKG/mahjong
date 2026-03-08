import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tileFilter',
})
export class TileFilterPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
