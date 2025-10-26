import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileName' })
export class FileNamePipe implements PipeTransform {
  transform(value: string): string {
    return value.slice(Math.max(value.lastIndexOf('/'), value.lastIndexOf('\\')) + 1);
  }
}
