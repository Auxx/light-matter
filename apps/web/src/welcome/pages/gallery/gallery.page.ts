import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GalleryLocations } from '../../../gallery/services/gallery-locations/gallery-locations';
import { DefaultPipe } from '../../../system/pipes/default/default.pipe';

@Component({
  selector: 'app-gallery',
  imports: [
    AsyncPipe,
    DefaultPipe,
    JsonPipe
  ],
  templateUrl: './gallery.page.html',
  styleUrl: './gallery.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPage {
  private readonly galleryLocations = inject(GalleryLocations);

  readonly locations$ = this.galleryLocations.locations();
}
