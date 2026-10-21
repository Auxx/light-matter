import { inject, Injectable } from '@angular/core';
import { TreeNode, updateSubject } from '@light-matter/ui';
import { FileInfo, getThumbnailSize, thumbnailDimensions, ThumbnailSize } from 'internal-api';
import { BehaviorSubject, defer, filter, map, Observable, startWith, switchMap, take, tap } from 'rxjs';
import { FileSystem } from '../../../ipc/file-system';
import { Configuration } from '../../../system/services/configuration/configuration';
import { GalleryLocations } from '../gallery-locations/gallery-locations';
import { defaultSortMode, galleryRoot, SortMode, treeNode } from './gallery-state.types';

@Injectable({ providedIn: 'root' })
export class GalleryState {
  /* DI */
  private readonly galleryLocations = inject(GalleryLocations);

  private readonly configuration = inject(Configuration);

  private readonly fileSystem = inject(FileSystem);

  /* State */
  private readonly locations$ = this.galleryLocations.locations();

  private readonly thumbSize$ = this.configuration.config().pipe(
    map(config => getThumbnailSize(config.gallery.thumbWidth, config.gallery.thumbHeight))
  );

  private readonly selectedLocation$ = new BehaviorSubject<string | null>(null);

  private readonly images$ = new BehaviorSubject<FileInfo[]>([]);

  private readonly sortMode$ = new BehaviorSubject<SortMode>(defaultSortMode());

  constructor() {
    this.configuration.config()
      .pipe(take(1))
      .subscribe(config => {
        const defaultSort = defaultSortMode();
        this.sortMode$.next({
          sortBy: config.gallery.sortBy ?? defaultSort.sortBy,
          sortDir: config.gallery.sortDir ?? defaultSort.sortDir
        });

        const selectedLocation = this.selectedLocation$.value;
        if (selectedLocation !== null) {
          this.navigateTo(selectedLocation).subscribe();
        }
      });
  }

  private readonly galleryRoot$: Observable<TreeNode<string>> = this.locations$
    .pipe(
      startWith([]),
      map(locations => {
        const root = galleryRoot();
        const selectedLocation = this.selectedLocation$.value ?? locations[0] ?? null;
        root.children = locations.map(location => {
          const node = treeNode(location, false);
          node.isSelected = location === selectedLocation;

          return node;
        });

        if (this.selectedLocation$.value === null && locations[0] !== undefined) {
          this.navigateTo(locations[0]).subscribe();
        }

        return root;
      })
    );

  /* Getters */
  readonly locations = () => this.locations$;

  readonly thumbSize = () => this.thumbSize$;

  readonly images = () => this.images$.asObservable();

  readonly galleryRoot = () => this.galleryRoot$;

  readonly selectedLocation = () => this.selectedLocation$.asObservable();

  readonly sortMode = () => this.sortMode$.asObservable();

  /* Modifiers */
  readonly navigateTo = (path: string): Observable<boolean> => {
    this.selectedLocation$.next(path);

    return this.sortMode$
      .pipe(
        take(1),
        switchMap(sortMode => defer(() => this.fileSystem.readImages(path, sortMode.sortBy, sortMode.sortDir))),
        tap(response => this.images$.next(response.success ? response.data : [])),
        map(() => true)
      );
  };

  readonly changeSorting = (sortMode: Partial<SortMode>) =>
    updateSubject(this.sortMode$, sortMode)
      .pipe(
        tap(() => {
          const current = this.sortMode$.value;
          this.configuration.updateGalleryConfig({ sortBy: current.sortBy, sortDir: current.sortDir });
        }),
        switchMap(() => this.selectedLocation$.pipe(take(1))),
        filter(path => path !== null)
      )
      .subscribe(path => this.navigateTo(path).subscribe());

  readonly changeThumbnailSize = (size: ThumbnailSize) => {
    const dimensions = thumbnailDimensions[size];

    this.configuration.updateGalleryConfig({
      thumbWidth: dimensions.width,
      thumbHeight: dimensions.height
    });
  };

  readonly deleteImage = async (path: string): Promise<boolean> => {
    const response = await this.fileSystem.deleteFile(path);

    if (!response.success) {
      return false;
    }

    this.images$.next(this.images$.value.filter(image => image.path !== path));
    return true;
  };

  /* Misc */
  readonly getDirContents = async (path: string) => await this.fileSystem.readDirectories(path);
}
