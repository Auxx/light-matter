import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaptionComponent } from '@light-matter/ui';
import { FileInfo } from 'internal-api';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { DevicePixelRatioService } from '../../../system/services/device-pixel-ratio/device-pixel-ratio.service';
import { ThumbnailLoaderService } from '../../../system/services/thumbnail-loader/thumbnail-loader.service';
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
export class ThumbnailComponent implements OnDestroy {
  /* DI */
  private readonly devicePixelRatioService = inject(DevicePixelRatioService);

  private readonly thumbnailLoader = inject(ThumbnailLoaderService);

  private readonly elementRef = inject(ElementRef);

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

  readonly isVisible = signal<boolean>(false);

  readonly hasError = signal<boolean>(false);

  protected readonly fit = signal('cover');

  private loaderSubscription: Subscription | null = null;

  /* Constructor */
  constructor() {
    effect(() => {
      this.hasError.set(false);
      this.isLoading.set(true);

      if (!this.isVisible()) {
        return;
      }

      this.loaderSubscription?.unsubscribe();

      this.loaderSubscription = this.thumbnailLoader
        .add(this.url())
        .subscribe({
          next: success => this.hasError.set(!success),
          complete: () => this.isLoading.set(false)
        });
    });

    const observer = new IntersectionObserver(entries => {
      if (entries.length === 0 || entries[0].intersectionRatio <= 0) {
        return;
      }

      observer.disconnect();
      this.isVisible.set(true);
    });

    observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.loaderSubscription?.unsubscribe();
  }
}
