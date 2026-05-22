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
import { defaultThumbHeight, defaultThumbWidth, FileInfo } from 'internal-api';
import { map } from 'rxjs';
import { Configuration } from '../../../system/services/configuration/configuration';
import { imageUrl } from '../../../viewer/utils/image-url';

@Component({
  selector: 'app-thumbnail',
  imports: [],
  templateUrl: './thumbnail.component.html',
  styleUrl: './thumbnail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--fit]': 'fit()'
  }
})
export class ThumbnailComponent {
  readonly image = input.required<FileInfo>();

  readonly url = computed(() => imageUrl(this.image().path));

  readonly isLoading = signal<boolean>(true);

  readonly hasError = signal<boolean>(false);

  readonly clicked = output<FileInfo>();

  protected readonly fit = signal('cover');

  private readonly configuration = inject(Configuration);

  private readonly dimensions = toSignal(
    this.configuration
      .config()
      .pipe(map(cfg => ({
        width: cfg.gallery.thumbWidth ?? defaultThumbWidth,
        height: cfg.gallery.thumbHeight ?? defaultThumbHeight
      })))
  );

  protected readonly imageRef = viewChild<string, ElementRef<HTMLImageElement>>('imageTag', { read: ElementRef });

  // TODO Add zoom tracking service
  protected readonly zoom = signal(1);

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
