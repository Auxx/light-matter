import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, map, startWith } from 'rxjs';
import { ImageViewToolbar } from '../../components/image-view-toolbar/image-view-toolbar';

@Component({
  selector: 'app-image-view',
  imports: [
    ImageViewToolbar
  ],
  templateUrl: './image-view.html',
  styleUrl: './image-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageView {
  readonly imageUrl = input('sample-pic-3.jpg');

  protected readonly fit = signal<'contain' | 'original'>('contain');

  protected readonly zoom = signal(1);

  private readonly document = inject(DOCUMENT);

  constructor() {
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
  }
}
