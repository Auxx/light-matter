import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FileInfo } from 'internal-api';
import { FoldersComponent } from '../folders/folders.component';
import { ImagesComponent } from '../images/images.component';

@Component({
  selector: 'app-image-grid',
  imports: [
    FoldersComponent,
    ImagesComponent,
    JsonPipe,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  readonly contents = input.required<FileInfo[]>();

  readonly selectedPath = input.required<string[]>();

  readonly folders = computed(() => this.contents().filter(file => file.isDirectory));

  readonly files = computed(() => this.contents().filter(file => !file.isDirectory));

  readonly showFolders = signal(false);

  readonly folderPushed = output<FileInfo>();

  readonly folderPopped = output();

  readonly toggleFolders = () => {
    this.showFolders.update(current => !current);
  };
}
