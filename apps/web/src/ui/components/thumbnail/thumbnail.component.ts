import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaptionComponent } from '@light-matter/ui';
import { defaultThumbHeight, defaultThumbWidth, FileInfo } from 'internal-api';
import { distinctUntilChanged, map } from 'rxjs';
import { Configuration } from '../../../system/services/configuration/configuration';
import { DevicePixelRatioService } from '../../../system/services/device-pixel-ratio/device-pixel-ratio.service';
import { thumbUrl } from '../../../viewer/utils/image-url';

@Component({
  selector: 'app-thumbnail',
  imports: [
    CaptionComponent
  ],
  templateUrl: './thumbnail.component.html',
  styleUrl: './thumbnail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--fit]': 'fit()'
  }
})
export class ThumbnailComponent {
  /* DI */
  private readonly devicePixelRatioService = inject(DevicePixelRatioService);

  private readonly configuration = inject(Configuration);

  /* Inputs/outputs */
  readonly image = input.required<FileInfo>();

  readonly clicked = output<FileInfo>();

  /* State */
  private readonly pixelRatio = toSignal(
    this.devicePixelRatioService
      .pixelRatio()
      .pipe(distinctUntilChanged())
  );

  readonly url = computed(() => {
    const image = this.image();
    const pixelRatio = this.pixelRatio() || 1;
    return thumbUrl(image.path, 288 / pixelRatio, 192 / pixelRatio);
  });

  readonly isLoading = signal<boolean>(true);

  readonly hasError = signal<boolean>(false);

  protected readonly fit = signal('cover');

  private readonly dimensions = toSignal(
    this.configuration
      .config()
      .pipe(map(cfg => ({
        width: cfg.gallery.thumbWidth ?? defaultThumbWidth,
        height: cfg.gallery.thumbHeight ?? defaultThumbHeight
      })))
  );

  protected readonly imageRef = viewChild<string, ElementRef<HTMLImageElement>>('imageTag', { read: ElementRef });

  /* Constructor */
  constructor() {
    effect(() => {
      this.hasError.set(false);
      this.isLoading.set(true);

      const img = this.imageRef()?.nativeElement;

      if (img === undefined) {
        return;
      }

      img.addEventListener('load', this.onLoad);
      img.addEventListener('error', this.onError);
    });
  }

  /* Events */
  private readonly onLoad = (event: Event) => {
    this.isLoading.set(false);
    this.hasError.set(false);

    if (event.target instanceof HTMLImageElement) {
      const dimensions = this.dimensions();

      if (dimensions === undefined) {
        return;
      }

      this.fit.set(
        dimensions.width > event.target.naturalWidth && dimensions.height > event.target.naturalHeight
          ? 'none'
          : 'cover'
      );
    }
  };

  private readonly onError = (event: ErrorEvent) => {
    console.log('onError', event);

    this.isLoading.set(false);
    this.hasError.set(true);
  };
}
