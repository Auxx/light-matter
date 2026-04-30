import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FileInfo } from 'internal-api';
import { FileNamePipe } from '../../../viewer/pipes/file-name/file-name-pipe';
import { ViewNavigator } from '../../../viewer/services/view-navigator/view-navigator';
import { imageUrl } from '../../../viewer/utils/image-url';

@Component({
  selector: 'app-thumbnail',
  imports: [
    FileNamePipe
  ],
  templateUrl: './thumbnail.component.html',
  styleUrl: './thumbnail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbnailComponent {
  readonly image = input.required<FileInfo>();

  readonly router = inject(Router);

  readonly viewNavigator = inject(ViewNavigator);

  readonly url = computed(() => imageUrl(this.image().path));

  readonly isLoading = signal<boolean>(true);

  readonly hasError = signal<boolean>(false);

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

  protected readonly viewImage = async () => {
    const result = await window.desktop.openFileFromArgs(this.image().path);

    if (result.success) {
      this.viewNavigator.setFiles(result.data.files, result.data.selected);
      await this.router.navigate([ '/view' ]);
    }
  };

  private readonly onLoad = () => {
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
