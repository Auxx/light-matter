import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FileInfo } from 'internal-api';
import { ThumbnailComponent } from '../../../ui/components/thumbnail/thumbnail.component';
import { ViewNavigator } from '../../../viewer/services/view-navigator/view-navigator';

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
  readonly contents = input.required<FileInfo[]>();

  readonly router = inject(Router);

  readonly viewNavigator = inject(ViewNavigator);

  readonly onThumbnailClick = (fileInfo: FileInfo) => {
    this.viewNavigator.setFiles(this.contents().map(image => image.path), fileInfo.path);
    this.router.navigate([ '/view' ]).then();
  };
}
