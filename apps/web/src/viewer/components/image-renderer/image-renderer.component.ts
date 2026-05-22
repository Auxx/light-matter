import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MouseTrackerService } from '@light-matter/ui';
import { fromEvent, take } from 'rxjs';
import { PxPipe } from '../../../system/pipes/px/px-pipe';
import { DevicePixelRatioService } from '../../../system/services/device-pixel-ratio/device-pixel-ratio.service';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageLocation {
  x: number;
  y: number;
}

interface ImageOffset {
  dx: number;
  dy: number;
}

@Component({
  selector: 'app-image-renderer',
  imports: [
    PxPipe
  ],
  templateUrl: './image-renderer.component.html',
  styleUrl: './image-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.scrollable]': 'scrollable()'
  }
})
export class ImageRendererComponent {
  readonly url = input.required<string>();

  private readonly devicePixelRatioService = inject(DevicePixelRatioService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly mouseTrackerService = inject(MouseTrackerService);

  protected readonly pixelRatio = this.devicePixelRatioService.pixelRatio;

  // Original unmodified image dimensions
  protected readonly imageDimensions = signal<ImageDimensions>({ width: 0, height: 0 });

  // Image dimensions after zoom applied
  protected readonly displayDimensions = signal<ImageDimensions>({ width: 0, height: 0 });

  // Viewport dimensions
  protected readonly viewportDimensions = signal<ImageDimensions>({ width: 0, height: 0 });

  // Image offset inside the viewport relative to centre
  protected readonly viewportOffset = signal<ImageOffset>({ dx: 0, dy: 0 });

  protected readonly scrollable = signal(false);

  // Image location within viewport
  protected readonly imageLocation = signal<ImageLocation>({ x: 0, y: 0 });

  protected readonly displayUrl = signal<string | null>(null);

  protected readonly surface = viewChild<unknown, ElementRef<HTMLDivElement>>('surface', { read: ElementRef });

  protected readonly image = viewChild<unknown, ElementRef<HTMLImageElement>>('image', { read: ElementRef });

  constructor() {
    effect(this.preloadImage);
    effect(this.trackViewportSize);
    effect(this.trackImageLocation);
  }

  protected readonly onMouseDown = (event: MouseEvent) => {
    if (!this.scrollable() || event.button !== 0) {
      return;
    }

    const viewportDimensions = this.viewportDimensions();
    const displayDimensions = this.displayDimensions();
    const origin = this.viewportOffset();
    const pixelRatio = this.pixelRatio();

    this.mouseTrackerService
      .mouseDown(event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: state => {
          const target = {
            dx: origin.dx + state.dx / pixelRatio,
            dy: origin.dy + state.dy / pixelRatio
          };

          const location = this.calculateImageLocation(viewportDimensions, displayDimensions, target);

          if (location.x > 0) {
            target.dx = target.dx - location.x;
          }

          if (location.y > 0) {
            target.dy = target.dy - location.y;
          }

          if (location.x + displayDimensions.width < viewportDimensions.width) {
            target.dx = target.dx - (displayDimensions.width - viewportDimensions.width + location.x);
          }

          if (location.y + displayDimensions.height < viewportDimensions.height) {
            target.dy = target.dy - (displayDimensions.height - viewportDimensions.height + location.y);
          }

          this.viewportOffset.set(target);
        }
      });
  };

  private readonly trackImageLocation = () => {
    const viewportDimensions = this.viewportDimensions();
    const displayDimensions = this.displayDimensions();
    const viewportOffset = this.viewportOffset();

    this.scrollable.set(
      viewportDimensions.width < displayDimensions.width || viewportDimensions.height < displayDimensions.height
    );

    this.imageLocation
      .set(this.calculateImageLocation(viewportDimensions, displayDimensions, viewportOffset));
  };

  private readonly calculateImageLocation = (
    viewportDimensions: ImageDimensions,
    displayDimensions: ImageDimensions,
    viewportOffset: ImageOffset
  ) => ({
    x: (viewportDimensions.width - displayDimensions.width) / 2 + viewportOffset.dx,
    y: (viewportDimensions.height - displayDimensions.height) / 2 + viewportOffset.dy
  });

  private readonly trackViewportSize = () => {
    const surface = this.surface();

    if (surface === undefined) {
      return;
    }

    this.viewportDimensions.set({
      width: surface.nativeElement.offsetWidth / this.pixelRatio(),
      height: surface.nativeElement.offsetHeight / this.pixelRatio()
    });

    this.devicePixelRatioService
      .trackResize()
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() =>
        this.viewportDimensions.set({
          width: surface.nativeElement.offsetWidth,
          height: surface.nativeElement.offsetHeight
        })
      );
  };

  private readonly preloadImage = () => {
    const url = this.url();
    const image = new Image();

    fromEvent(image, 'load')
      .pipe(take(1))
      .subscribe(this.onImageLoad);

    image.src = url;
  };

  private readonly onImageLoad = (event: Event) => {
    if (event.target instanceof HTMLImageElement) {
      const { naturalWidth, naturalHeight } = event.target;

      this.displayDimensions.set({ width: naturalWidth, height: naturalHeight });
      this.imageDimensions.set({ width: naturalWidth, height: naturalHeight });
      this.viewportOffset.set({ dx: 0, dy: 0 });
      this.displayUrl.set(event.target.src);
    }
  };
}
