import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ImageGridComponent } from '../../../gallery/components/image-grid/image-grid.component';
import { LocationListingComponent } from '../../../gallery/components/location-listing/location-listing.component';
import { GalleryLocations } from '../../../gallery/services/gallery-locations/gallery-locations';
import { FileSystem } from '../../../ipc/file-system';
import { DefaultPipe } from '../../../system/pipes/default/default.pipe';
import { DualPaneComponent } from '../../../ui/components/dual-pane/dual-pane.component';

@Component({
  selector: 'app-gallery',
  imports: [
    AsyncPipe,
    DefaultPipe,
    LocationListingComponent,
    DualPaneComponent,
    ImageGridComponent
  ],
  templateUrl: './gallery.page.html',
  styleUrl: './gallery.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPage {
  private readonly galleryLocations = inject(GalleryLocations);

  private readonly fileSystem = inject(FileSystem);

  readonly locations$ = this.galleryLocations.locations();

  readonly selectedLocation = signal<string | null>(null);

  readonly galleryResource = resource({
    params: () => ({ path: this.selectedLocation() }),
    loader: async ({ params }) => {
      if (params.path === null) {
        return [];
      }

      const response = await this.fileSystem.readGalleryLocation(params.path);

      if (!response.success) {
        return [];
      }

      return response.data;
    }
  });

  readonly contents = computed(() =>
    this.galleryResource.hasValue()
      ? this.galleryResource.value()
      : []
  );

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
