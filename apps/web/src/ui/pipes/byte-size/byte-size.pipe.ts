import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'byteSize' })
export class ByteSizePipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) {
      return '0 B';
    }

    const exponent = Math.floor(Math.log(value) / Math.log(1024));
    const decimal = (value / Math.pow(1024, exponent)).toFixed(exponent ? 2 : 0);
    return `${decimal} ${exponent ? `${'kMGTPEZY'[exponent - 1]}B` : 'B'}`;
  }
}
