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
    DefaultPipe
  ],
  templateUrl: './image-renderer.component.html',
  styleUrl: './image-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageRendererComponent implements OnDestroy {
  readonly url = input.required<string>();

  readonly dimensions = output<ImageDimensions>();

  private readonly imagePositioningService = inject(ImagePositioningService);

  protected readonly displayUrl = signal<string | null>(null);

  protected readonly viewportRef = viewChild<unknown, ElementRef<HTMLDivElement>>('surface', { read: ElementRef });

  protected readonly imageLocation$ = this.imagePositioningService.imageLocation();

  protected readonly defaultImageLocation = defaultImagePositioningResult();

  constructor() {
    effect(() => {
      const surface = this.viewportRef();

      if (surface === undefined) {
        return;
      }

      this.imagePositioningService.setViewport(surface.nativeElement);
    });

    effect(this.preloadImage);
  }

  ngOnDestroy() {
    this.imagePositioningService.removeViewport();
  }

  protected readonly onMouseDown = (event: MouseEvent) => this.imagePositioningService.startPanning(event);

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
      const dimensions = { width: naturalWidth, height: naturalHeight };

      this.displayUrl.set(event.target.src);
      this.imagePositioningService.setImageDimensions(dimensions);
      this.dimensions.emit(dimensions);
    }
  };
}
