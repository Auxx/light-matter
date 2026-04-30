import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'default' })
export class DefaultPipe implements PipeTransform {
  transform<T>(value: T | null | undefined, defaultValue: T): T {
    return value === null || value === undefined ? defaultValue : value;
  }
}
