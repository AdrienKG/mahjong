import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'probability'
})
export class ProbabilityPipe implements PipeTransform {
  transform(value: number): string {
    return `${Math.round(value * 10000) / 100}%`;
  }
}
