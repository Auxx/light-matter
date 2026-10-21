import { Injectable } from '@angular/core';
import { ApiResponse, DesktopHistogram, ImageHistogram } from 'internal-api';

@Injectable({ providedIn: 'root' })
export class HistogramService implements DesktopHistogram {
  readonly calculate = (path: string): Promise<ApiResponse<ImageHistogram>> => window.desktop.Histogram.calculate(path);
}
