import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { FileInfo } from 'internal-api';
import { imageUrl } from '../../../viewer/utils/image-url';

@Component({
  selector: 'app-thumbnail',
  imports: [],
  templateUrl: './thumbnail.component.html',
  styleUrl: './thumbnail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbnailComponent {
  readonly image = input.required<FileInfo>();

  readonly url = computed(() => imageUrl(this.image().path));

  readonly isLoading = signal<boolean>(true);

  readonly hasError = signal<boolean>(false);

  readonly clicked = output<FileInfo>();

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

  private readonly onLoad = () => {
    this.isLoading.set(false);
    this.hasError.set(false);
  };

  private readonly onError = (event: ErrorEvent) => {
    console.log('onError', event);

    this.isLoading.set(false);
    this.hasError.set(true);
  };
}
