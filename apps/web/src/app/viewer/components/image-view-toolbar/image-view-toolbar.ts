import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowBigLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FullscreenIcon,
  ImageIcon,
  LucideAngularModule
} from 'lucide-angular';
import { VerticalDivider } from '../../../system/components/vertical-divider/vertical-divider';
import { FileNamePipe } from '../../pipes/file-name/file-name-pipe';
import { ImageDetails } from './image-view-toolbar.types';

@Component({
  selector: 'app-image-view-toolbar',
  imports: [
    LucideAngularModule,
    RouterLink,
    VerticalDivider,
    FileNamePipe
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

  readonly isVisible = signal(false);

  readonly prev = input(-1);

  readonly next = input(-1);

  readonly navigatePrev = output();

  readonly navigateNext = output();

  protected readonly FullscreenIcon = FullscreenIcon;
  protected readonly ImageIcon = ImageIcon;
  protected readonly ArrowBigLeftIcon = ArrowBigLeftIcon;
  protected readonly ChevronLeftIcon = ChevronLeftIcon;
  protected readonly ChevronRightIcon = ChevronRightIcon;
}
