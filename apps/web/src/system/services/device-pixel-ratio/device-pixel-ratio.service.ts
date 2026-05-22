import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent, map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DevicePixelRatioService {
  readonly pixelRatio = signal(1);

  private readonly document = inject(DOCUMENT);

  constructor() {
    this.trackPixelRatio();
  }

  private readonly trackPixelRatio = () => {
    if (this.document.defaultView !== null) {
      const win = this.document.defaultView;

      fromEvent(win, 'resize')
        .pipe(
          takeUntilDestroyed(),
          debounceTime(250),
          map(() => win.devicePixelRatio ?? 1),
          startWith(win.devicePixelRatio),
          distinctUntilChanged(),
          map(ratio => 1 / ratio)
        )
        .subscribe(ratio => this.pixelRatio.set(ratio));
    }
  };
}
