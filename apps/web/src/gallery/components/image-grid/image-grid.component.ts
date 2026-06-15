import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TitleComponent, ToolbarComponent } from '@light-matter/ui';
import { FileInfo } from 'internal-api';
import { ImagesComponent } from '../images/images.component';

@Component({
  selector: 'app-image-grid',
  imports: [
    ImagesComponent,
    ToolbarComponent,
    TitleComponent
  ],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  /* Inputs */
  readonly images = input.required<FileInfo[] | null>();

  readonly selectedLocation = input.required<string | null>();

  /* Outputs */
  readonly selected = output<FileInfo>();
}
