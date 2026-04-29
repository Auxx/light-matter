import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FileInfo } from 'internal-api';
import { FoldersComponent } from '../folders/folders.component';
import { ImagesComponent } from '../images/images.component';

@Component({
  selector: 'app-image-grid',
  imports: [
    FoldersComponent,
    ImagesComponent
  ],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  readonly location = input.required<string | null>();

  readonly contents = input.required<FileInfo[]>();

  readonly folders = computed(() => this.contents().filter(file => file.isDirectory));

  readonly files = computed(() => this.contents().filter(file => !file.isDirectory));
}
