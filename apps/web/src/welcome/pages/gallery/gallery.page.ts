import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileInfo } from 'internal-api';
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

  readonly selectedPath = signal<string[]>([]);

  readonly galleryResource = resource({
    params: () => ({ path: this.selectedPath() }),
    loader: async ({ params }) => {
      if (params.path.length === 0) {
        return [];
      }

      const { path } = params;
      const response = await this.fileSystem.readGalleryLocation(path[path.length - 1]);

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
      .subscribe(locations => {
        if (this.selectedLocation() === null) {
          this.selectedLocation.set(locations[0]);
        }
      });

    effect(() => {
      const selectedLocation = this.selectedLocation();
      this.selectedPath.set(selectedLocation === null ? [] : [ selectedLocation ]);
    });
  }

  readonly onLocationSelected = (location: string) => this.selectedLocation.set(location);

  readonly onFolderPush = (item: FileInfo) => this.selectedPath.update(path => path.concat(item.path));

  readonly onFolderPop = () => this.selectedPath.update(path => path.toSpliced(-1));
}
