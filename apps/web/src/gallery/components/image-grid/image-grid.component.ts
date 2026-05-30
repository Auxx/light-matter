import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  ActionButtonComponent,
  CaptionComponent,
  IconComponent,
  TitleComponent,
  ToolbarComponent
} from '@light-matter/ui';
import { FileInfo } from 'internal-api';
import { GalleryState } from '../../services/gallery-state/gallery-state';
import { FoldersComponent } from '../folders/folders.component';
import { ImagesComponent } from '../images/images.component';

@Component({
  selector: 'app-image-grid',
  imports: [
    FoldersComponent,
    ImagesComponent,
    IconComponent,
    ActionButtonComponent,
    ToolbarComponent,
    TitleComponent,
    CaptionComponent
  ],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  private readonly galleryState = inject(GalleryState);

  readonly contents = input.required<FileInfo[]>();

  readonly selectedPath = input.required<string[]>();

  readonly folders = computed(() => this.contents().filter(file => file.isDirectory));

  readonly files = computed(() => this.contents().filter(file => !file.isDirectory));

  readonly showFolders = this.galleryState.showFolders;

  readonly folderPushed = output<FileInfo>();

  readonly folderPopped = output();

  readonly toggleFolders = () => {
    this.showFolders.update(current => !current);
  };
}
