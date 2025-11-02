import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'probability',
})
export class ProbabilityPipe implements PipeTransform {
  transform(value: number | boolean): string {
    if (typeof value === 'boolean') {
      return value ? '100%' : '0%';
    }
    return `${Math.round(value * 10000) / 100}%`;
  }
}
