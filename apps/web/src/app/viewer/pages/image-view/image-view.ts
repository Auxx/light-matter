import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, map, startWith } from 'rxjs';

@Component({
  selector: 'app-image-view',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './image-view.html',
  styleUrl: './image-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageView {
  fit = input<'contain' | 'original'>('original');

  imageUrl = input('/sample-pic.jpg');

  backgroundImageUrl = computed(() => `url(${ this.imageUrl() })`);

  zoom = signal(1);

  document = inject(DOCUMENT);

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
