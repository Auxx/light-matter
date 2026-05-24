import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Observable, shareReplay, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DevicePixelRatioService {
  private readonly document = inject(DOCUMENT);

  private readonly window: Window;

  private readonly pixelRatio$: Observable<number>;

  private readonly windowResize$: Observable<Event>;

  constructor() {
    if (this.document.defaultView === null) {
      throw new Error('Unsupported browser');
    }

    this.window = this.document.defaultView;

    this.pixelRatio$ = fromEvent(this.window, 'resize')
      .pipe(
        debounceTime(250),
        map(() => this.window.devicePixelRatio ?? 1),
        startWith(this.window.devicePixelRatio),
        distinctUntilChanged(),
        map(ratio => 1 / ratio),
        shareReplay(1)
      );

    this.windowResize$ = fromEvent(this.document.defaultView, 'resize');
  }

  readonly pixelRatio = () => this.pixelRatio$;

  readonly windowResize = () => this.windowResize$;
}
