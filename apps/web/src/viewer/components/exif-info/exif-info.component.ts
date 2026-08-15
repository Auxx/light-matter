import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExifTags } from 'internal-api';
import { ImageDimensions } from '../../services/image-positioning/image-positioning.types';

@Component({
  selector: 'app-exif-info',
  imports: [],
  templateUrl: './exif-info.component.html',
  styleUrl: './exif-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExifInfoComponent {
  /* Inputs */
  readonly exif = input<false | ExifTags>(false);

  readonly dimensions = input<ImageDimensions>({ width: 0, height: 0 });
}
