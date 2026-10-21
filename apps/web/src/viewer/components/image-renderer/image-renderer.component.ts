import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild
} from '@angular/core';
import { IconComponent } from '@light-matter/ui';
import { fromEvent, take } from 'rxjs';
import { DefaultPipe } from '../../../system/pipes/default/default.pipe';
import { PxPipe } from '../../../system/pipes/px/px-pipe';
import { ImagePositioningService } from '../../services/image-positioning/image-positioning.service';
import {
  defaultImagePositioningResult,
  ImageDimensions
} from '../../services/image-positioning/image-positioning.types';

@Component({
  selector: 'app-image-renderer',
  imports: [
    PxPipe,
    AsyncPipe,
    DefaultPipe,
    IconComponent
  ],
  templateUrl: './image-renderer.component.html',
  styleUrl: './image-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageRendererComponent implements OnDestroy {
  /* DI */
  private readonly imagePositioningService = inject(ImagePositioningService);

  /* Inputs */
  readonly url = input.required<string>();

  readonly comparisonMode = input<'hdr' | 'sdr' | 'side-by-side' | 'stacked' | 'dual-side-by-side' | 'dual-stacked'>('hdr');

  readonly comparisonSplit = input(50);

  protected readonly sdrClip = () => {
    const mode = this.comparisonMode();
    const split = Math.max(1, Math.min(99, this.comparisonSplit()));
    if (mode === 'side-by-side') return `inset(0 ${100 - split}% 0 0)`;
    if (mode === 'stacked') return `inset(0 0 ${100 - split}% 0)`;
    return 'inset(0 0 0 0)';
  };

  protected readonly hdrClip = () => {
    const mode = this.comparisonMode();
    const split = Math.max(1, Math.min(99, this.comparisonSplit()));
    if (mode === 'side-by-side') return `inset(0 0 0 ${split}%)`;
    if (mode === 'stacked') return `inset(${split}% 0 0 0)`;
    return 'inset(0 0 0 0)';
  };

  /* Outputs */
  readonly dimensions = output<ImageDimensions>();

  readonly pixelColorChange = output<{ r: number; g: number; b: number } | null>();

  readonly pixelDebugChange = output<string>();

  readonly loadingChange = output<boolean>();

  readonly loadDuration = output<number>();

  readonly loadError = output<void>();

  readonly comparisonSplitChange = output<number>();

  readonly comparisonSplitCommit = output<number>();

  /* State */
  protected readonly displayUrl = signal<string | null>(null);

  protected readonly isLoading = signal(false);

  private readonly pixelCanvas = document.createElement('canvas');

  private pixelContext: CanvasRenderingContext2D | null = null;

  protected readonly viewportRef = viewChild<unknown, ElementRef<HTMLDivElement>>('surface', { read: ElementRef });

  protected readonly imageLocation$ = this.imagePositioningService.imageLocation();

  protected readonly defaultImageLocation = defaultImagePositioningResult();

  /* Constructor */
  constructor() {
    effect(() => {
      const surface = this.viewportRef();

      if (surface === undefined) {
        return;
      }

      this.imagePositioningService.setViewport(surface.nativeElement);
    });

    effect(() => this.preloadImage(this.url()));
  }

  /* Events */
  private splitPointerActive = false;

  protected readonly onSurfaceClick = (event: MouseEvent) => {
    const mode = this.comparisonMode();
    if (mode !== 'side-by-side' && mode !== 'stacked') {
      return;
    }

    if ((event.target as HTMLElement | null)?.closest('.comparison-split-handle')) {
      return;
    }

    const split = this.getSplitFromPointer(event.clientX, event.clientY);
    if (split !== null) {
      this.comparisonSplitChange.emit(split);
      this.comparisonSplitCommit.emit(split);
    }
  };

  protected readonly onSplitPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.splitPointerActive = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.updateSplitFromPointer(event);
  };

  protected readonly onSplitPointerMove = (event: PointerEvent) => {
    if (!this.splitPointerActive || event.buttons === 0) {
      return;
    }

    this.updateSplitFromPointer(event);
  };

  protected readonly onSplitPointerUp = (event: PointerEvent) => {
    if (!this.splitPointerActive) {
      return;
    }

    const split = this.getSplitFromPointer(event.clientX, event.clientY);
    this.splitPointerActive = false;
    if (split !== null) {
      this.comparisonSplitChange.emit(split);
      this.comparisonSplitCommit.emit(split);
    }
  };

  private readonly updateSplitFromPointer = (event: PointerEvent) => {
    const split = this.getSplitFromPointer(event.clientX, event.clientY);
    if (split !== null) {
      this.comparisonSplitChange.emit(split);
    }
  };

  private readonly getSplitFromPointer = (clientX: number, clientY: number): number | null => {
    const mode = this.comparisonMode();
    const surface = this.viewportRef()?.nativeElement;
    const image = surface?.querySelector<HTMLImageElement>('.hdr-image');
    const bounds = image?.getBoundingClientRect();

    if (bounds === undefined || bounds.width <= 0 || bounds.height <= 0) {
      return null;
    }

    const position = mode === 'side-by-side'
      ? (clientX - bounds.left) / bounds.width
      : (clientY - bounds.top) / bounds.height;

    return Math.max(1, Math.min(99, Math.round(position * 100)));
  };

  ngOnDestroy() {
    this.imagePositioningService.removeViewport();
  }

  protected readonly onMouseDown = (event: MouseEvent) => this.imagePositioningService.startPanning(event);

  protected readonly onSurfaceMouseMove = (event: MouseEvent) => {
    const surface = this.viewportRef()?.nativeElement;
    const target = event.target;
    const images = surface?.querySelectorAll<HTMLImageElement>('.comparison-image:not(.hidden-variant)');
    const targetImage = target instanceof HTMLImageElement &&
      target.matches('.comparison-image:not(.hidden-variant)')
      ? target
      : null;
    const imageElement = targetImage ?? (images === undefined
      ? null
      : Array.from(images).find(image => {
          const bounds = image.getBoundingClientRect();
          return event.clientX >= bounds.left && event.clientX < bounds.right &&
            event.clientY >= bounds.top && event.clientY < bounds.bottom;
        }) ?? null);

    const targetDescription = target instanceof HTMLElement
      ? `${target.tagName.toLowerCase()}.${String(target.className).replace(/\\s+/g, '.').slice(0, 48)}`
      : String(target);
    const imageDescription = imageElement === null
      ? 'none'
      : `${imageElement.className} ${imageElement.naturalWidth}x${imageElement.naturalHeight} complete=${imageElement.complete}`;

    if (imageElement === null) {
      this.pixelDebugChange.emit(`move target=${targetDescription}; images=${images?.length ?? 0}; image=none`);
      this.pixelColorChange.emit(null);
      return;
    }

    const sourceWidth = imageElement.naturalWidth;
    const sourceHeight = imageElement.naturalHeight;
    const bounds = imageElement.getBoundingClientRect();

    if (this.pixelContext === null) {
      this.pixelDebugChange.emit(`move target=${targetDescription}; image=${imageDescription}; canvas=NONE`);
      this.pixelColorChange.emit(null);
      return;
    }

    if (sourceWidth <= 0 || sourceHeight <= 0 || bounds.width <= 0 || bounds.height <= 0) {
      this.pixelDebugChange.emit(`move target=${targetDescription}; image=${imageDescription}; bounds=${Math.round(bounds.width)}x${Math.round(bounds.height)}`);
      this.pixelColorChange.emit(null);
      return;
    }

    // Account for object-fit: contain in the dual SDR/HDR layout, as well as zoom and pan.
    const scale = Math.min(bounds.width / sourceWidth, bounds.height / sourceHeight);
    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;
    const left = bounds.left + (bounds.width - renderedWidth) / 2;
    const top = bounds.top + (bounds.height - renderedHeight) / 2;
    const x = Math.floor((event.clientX - left) / scale);
    const y = Math.floor((event.clientY - top) / scale);

    if (x < 0 || y < 0 || x >= sourceWidth || y >= sourceHeight) {
      this.pixelDebugChange.emit(`move image=${imageDescription}; outside x=${x} y=${y}; scale=${scale.toFixed(3)}`);
      this.pixelColorChange.emit(null);
      return;
    }

    try {
      this.pixelContext.clearRect(0, 0, 1, 1);
      this.pixelContext.drawImage(imageElement, -x, -y);
      const pixel = this.pixelContext.getImageData(0, 0, 1, 1).data;
      const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
      this.pixelDebugChange.emit(`OK ${imageElement.classList.contains('sdr-image') ? 'SDR' : 'HDR'} x=${x} y=${y} rgb=${rgb.r},${rgb.g},${rgb.b}`);
      this.pixelColorChange.emit(rgb);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.pixelDebugChange.emit(`CANVAS ERROR: ${message.slice(0, 90)}`);
      this.pixelColorChange.emit(null);
    }
  };

  protected readonly onSurfaceMouseLeave = () => { this.pixelDebugChange.emit('mouseleave'); this.pixelColorChange.emit(null); };

  /* Misc */
  private readonly preloadImage = (url: string) => {
    const loadId = ++this.loadId;
    const startedAt = performance.now();
    this.isLoading.set(true);
    this.loadingChange.emit(true);

    const image = new Image();
    // Allow pixel reads from the app's custom protocol; the protocol handler sends ACAO.
    image.crossOrigin = 'anonymous';

    fromEvent(image, 'load')
      .pipe(take(1))
      .subscribe(() => this.onImageLoad(image, loadId, startedAt));

    fromEvent(image, 'error')
      .pipe(take(1))
      .subscribe(() => this.onImageError(loadId));

    image.src = url;
  };

  private loadId = 0;

  private readonly onImageLoad = (image: HTMLImageElement, loadId: number, startedAt: number) => {
    if (loadId !== this.loadId) {
      return;
    }

    this.isLoading.set(false);
    this.loadingChange.emit(false);

    const dimensions = { width: image.naturalWidth, height: image.naturalHeight };
    this.pixelCanvas.width = 1;
    this.pixelCanvas.height = 1;
    this.pixelContext = this.pixelCanvas.getContext('2d', { willReadFrequently: true });
    this.pixelColorChange.emit(null);
    this.displayUrl.set(image.src);
    this.imagePositioningService.setImageDimensions(dimensions);
    this.dimensions.emit(dimensions);
    this.loadDuration.emit((performance.now() - startedAt) / 1000);
  };

  private readonly onImageError = (loadId: number) => {
    if (loadId !== this.loadId) {
      return;
    }

    this.isLoading.set(false);
    this.loadingChange.emit(false);
    this.loadError.emit();
  };
}
