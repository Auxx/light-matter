import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FullscreenIcon, ImageIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-image-view-toolbar',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './image-view-toolbar.html',
  styleUrl: './image-view-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewToolbar {
  readonly fit = input.required<'contain' | 'original'>();

  readonly fitChange = output<'contain' | 'original'>();

  protected readonly FullscreenIcon = FullscreenIcon;
  protected readonly ImageIcon = ImageIcon;
}
