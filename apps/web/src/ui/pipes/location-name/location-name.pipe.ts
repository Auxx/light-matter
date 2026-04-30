import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'locationName' })
export class LocationNamePipe implements PipeTransform {
  transform(value: string): string {
    return value.split(/[/\\]/g).pop() ?? value;
  }
}
