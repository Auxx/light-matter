import { computed, effect, inject, Injectable, resource, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TreeNode } from '@light-matter/ui';
import { FileInfo } from 'internal-api';
import { BehaviorSubject, filter, map, Observable, startWith } from 'rxjs';
import { FileSystem } from '../../../ipc/file-system';
import { GalleryLocations } from '../gallery-locations/gallery-locations';
import { galleryRoot, treeNode } from './gallery-state.types';

@Injectable({ providedIn: 'root' })
export class GalleryState {
  private readonly galleryLocations = inject(GalleryLocations);

  private readonly fileSystem = inject(FileSystem);

  private readonly locations$ = this.galleryLocations.locations();

  private readonly images$ = new BehaviorSubject<FileInfo[]>([]);

  private readonly galleryRoot$: Observable<TreeNode<string>> = this.locations$
    .pipe(
      startWith([]),
      map(locations => {
        const root = galleryRoot();
        root.children = locations.map(location => treeNode(location, false));
        return root;
      })
    );

  // TODO Add better error handling
  readonly navigateTo = async (path: string) => {
    const response = await this.fileSystem.readImages(path);
    this.images$.next(response.success ? response.data : []);
  };

  readonly locations = () => this.locations$;

  readonly images = () => this.images$;

  readonly galleryRoot = () => this.galleryRoot$;

  readonly getDirContents = async (path: string) => await this.fileSystem.readDirectories(path);

  // OLD

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
