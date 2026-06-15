import { Injectable } from '@angular/core';
import { ApiResponse, DesktopExif, ExifTags } from 'internal-api';

@Injectable({ providedIn: 'root' })
export class ExifService implements DesktopExif {
  readonly read = (path: string): Promise<ApiResponse<ExifTags>> => window.desktop.Exif.read(path);
}
