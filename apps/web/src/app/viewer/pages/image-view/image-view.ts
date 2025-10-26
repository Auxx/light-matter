import { AsyncPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, map, noop, startWith, tap } from 'rxjs';
import { ImageViewToolbar } from '../../components/image-view-toolbar/image-view-toolbar';
import { ViewNavigator } from '../../services/view-navigator/view-navigator';

@Component({
  selector: 'app-image-view',
  imports: [
    ImageViewToolbar,
    AsyncPipe
  ],
  templateUrl: './image-view.html',
  styleUrl: './image-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageView {
  readonly viewNavigator = inject(ViewNavigator);

  protected readonly fit = signal<'contain' | 'original'>('contain');

  protected readonly zoom = signal(1);

  private readonly document = inject(DOCUMENT);

  private readonly router = inject(Router);

  readonly state$ = this.viewNavigator.state()
    .pipe(tap(state => !state.isValid ? this.router.navigate([ 'dashboard' ]) : noop()));

  constructor() {
    this.trackZoom();
  }

  private readonly trackZoom = () => {
    if (this.document.defaultView !== null) {
      const win = this.document.defaultView;

      fromEvent(win, 'resize')
        .pipe(
          takeUntilDestroyed(),
          debounceTime(250),
          startWith(win.devicePixelRatio),
          map(() => win.devicePixelRatio ?? 1),
          map(ratio => 1 / ratio)
        )
        .subscribe(zoom => this.zoom.set(zoom));
    }
  };
}
