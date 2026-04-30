import { computed, effect, inject, Injectable, resource, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FileSystem } from '../../../ipc/file-system';
import { GalleryLocations } from '../gallery-locations/gallery-locations';

@Injectable({ providedIn: 'root' })
export class GalleryState {
  private readonly galleryLocations = inject(GalleryLocations);

  private readonly fileSystem = inject(FileSystem);

  readonly locations$ = this.galleryLocations.locations();

  readonly showFolders = signal(false);

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
}
