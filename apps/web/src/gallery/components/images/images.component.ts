import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FileInfo } from 'internal-api';
import { ThumbnailComponent } from '../../../ui/components/thumbnail/thumbnail.component';

@Component({
  selector: 'app-images',
  imports: [
    ThumbnailComponent
  ],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagesComponent {
  /* Inputs */
  readonly images = input.required<FileInfo[] | null>();

  /* Outputs */
  readonly selected = output<FileInfo>();
}
