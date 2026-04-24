import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.page.html',
  styleUrl: './gallery.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPage {
}
