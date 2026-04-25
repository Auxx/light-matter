import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocationListingComponent } from '../../../gallery/components/location-listing/location-listing.component';
import { GalleryLocations } from '../../../gallery/services/gallery-locations/gallery-locations';
import { DefaultPipe } from '../../../system/pipes/default/default.pipe';

@Component({
  selector: 'app-gallery',
  imports: [
    AsyncPipe,
    DefaultPipe,
    JsonPipe,
    LocationListingComponent
  ],
  templateUrl: './gallery.page.html',
  styleUrl: './gallery.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPage {
  private readonly galleryLocations = inject(GalleryLocations);

  readonly locations$ = this.galleryLocations.locations();
}
