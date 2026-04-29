import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { LocationListingComponent } from '../../../gallery/components/location-listing/location-listing.component';
import { GalleryLocations } from '../../../gallery/services/gallery-locations/gallery-locations';
import { DefaultPipe } from '../../../system/pipes/default/default.pipe';
import { DualPaneComponent } from '../../../ui/components/dual-pane/dual-pane.component';

@Component({
  selector: 'app-gallery',
  imports: [
    AsyncPipe,
    DefaultPipe,
    JsonPipe,
    LocationListingComponent,
    DualPaneComponent
  ],
  templateUrl: './gallery.page.html',
  styleUrl: './gallery.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPage {
  private readonly galleryLocations = inject(GalleryLocations);

  readonly locations$ = this.galleryLocations.locations();

  readonly selectedLocation = signal<string | null>(null);

  constructor() {
    this.locations$
      .pipe(
        takeUntilDestroyed(),
        filter(locations => locations.length > 0)
      )
      .subscribe(locations =>
        this.selectedLocation() === null
          ? this.selectedLocation.set(locations[0])
          : undefined
      );
  }

  readonly onLocationSelected = (location: string) => this.selectedLocation.set(location);
}
