import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@light-matter/ui';
import { VerticalDivider } from '../../../system/components/vertical-divider/vertical-divider';
import { FileNamePipe } from '../../pipes/file-name/file-name-pipe';
import { ImageDetails } from './image-view-toolbar.types';

@Component({
  selector: 'app-image-view-toolbar',
  imports: [
    RouterLink,
    VerticalDivider,
    FileNamePipe,
    IconComponent
  ],
  templateUrl: './image-view-toolbar.html',
  styleUrl: './image-view-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewToolbar {
  readonly fit = input.required<'contain' | 'original'>();

  readonly fileName = input.required<string>();

  readonly imageElement = input.required<ImageDetails | null>();

  readonly fitChange = output<'contain' | 'original'>();

  readonly isVisible = signal(true);

  readonly prev = input(-1);

  readonly next = input(-1);

  readonly isFullScreen = input.required();

  readonly navigatePrev = output();

  readonly navigateNext = output();

  readonly toggleFullScreen = output();
}
