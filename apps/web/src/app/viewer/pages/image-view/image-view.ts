import { AsyncPipe, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, map, noop, startWith, Subscription, tap } from 'rxjs';
import { Keyboard } from '../../../system/services/keyboard/keyboard';
import { ImageViewToolbar } from '../../components/image-view-toolbar/image-view-toolbar';
import { ImageDetails } from '../../components/image-view-toolbar/image-view-toolbar.types';
import { FileNamePipe } from '../../pipes/file-name/file-name-pipe';
import { ViewNavigator } from '../../services/view-navigator/view-navigator';

@Component({
  selector: 'app-image-view',
  imports: [
    ImageViewToolbar,
    AsyncPipe,
    FileNamePipe
  ],
  templateUrl: './image-view.html',
  styleUrl: './image-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageView {
  readonly viewNavigator = inject(ViewNavigator);

  readonly state$ = this.viewNavigator.state()
    .pipe(tap(state => !state.isValid ? this.router.navigate([ 'dashboard' ]) : noop()));

  protected readonly fit = signal<'contain' | 'original'>('contain');

  protected readonly zoom = signal(1);

  protected readonly imageRef = viewChild<unknown, ElementRef<HTMLImageElement>>('image', { read: ElementRef });

  protected readonly imageSize = signal<ImageDetails | null>(null);

  private readonly document = inject(DOCUMENT);

  protected readonly isFullScreen = signal<boolean>(this.document.fullscreenElement !== null);

  private readonly router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);

  private readonly keyboard = inject(Keyboard);

  private imageSub?: Subscription;

  constructor() {
    this.trackZoom();
    this.trackKeyboard();

    effect(() => {
      this.imageSub?.unsubscribe();
      const imageRef = this.imageRef();

      if (imageRef !== undefined) {
        this.imageSub = fromEvent(imageRef.nativeElement, 'load')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(event =>
            this.imageSize.set(
              event.target instanceof HTMLImageElement
                ? {
                  width: event.target.naturalWidth,
                  height: event.target.naturalHeight
                }
                : null
            )
          );
      }
    });
  }

  readonly toggleFullScreen = async () => {
    if (this.document.fullscreenElement !== null) {
      await this.document.exitFullscreen();
    } else {
      await this.document.documentElement.requestFullscreen();
    }

    this.isFullScreen.set(this.document.fullscreenElement !== null);
  };

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

  private readonly trackKeyboard = () => {
    this.keyboard.keyup()
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
          return;
        }

        switch (event.key) {
          case 'ArrowLeft':
            this.viewNavigator.prev();
            break;

          case 'ArrowRight':
            this.viewNavigator.next();
            break;

          case 'f':
          case 'F':
            this.toggleFullScreen().then();
            break;
        }
      });
  };
}
