import { Injectable } from '@angular/core';
import { ApiResponse, ExifTags } from 'internal-api';

@Injectable({ providedIn: 'root' })
export class ExifService {
  readonly read = (path: string): Promise<ApiResponse<ExifTags>> => window.desktop.Exif.read(path);
}
