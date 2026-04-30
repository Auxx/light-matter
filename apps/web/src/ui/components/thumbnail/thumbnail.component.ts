import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
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

  // TODO Add zoom tracking service
  protected readonly zoom = signal(1);

  readonly imageTag = computed(() => {
    const img = new Image();

    img.addEventListener('load', this.onLoad);
    img.addEventListener('error', this.onError);
    img.src = this.url();

    return img;
  });

  constructor() {
    effect(() => {
      this.hasError.set(false);
      this.isLoading.set(true);
      this.imageTag();
    });
  }

  private readonly onLoad = () => {
    console.log('LOAD');
    this.imageTag().removeEventListener('load', this.onLoad);
    this.isLoading.set(false);
    this.hasError.set(false);
  };

  private readonly onError = (event: ErrorEvent) => {
    console.log('onError', event);

    this.imageTag().removeEventListener('error', this.onError);
    this.isLoading.set(false);
    this.hasError.set(true);
  };
}
