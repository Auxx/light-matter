import { inject, Injectable } from '@angular/core';
import { TreeNode } from '@light-matter/ui';
import { FileInfo } from 'internal-api';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { FileSystem } from '../../../ipc/file-system';
import { GalleryLocations } from '../gallery-locations/gallery-locations';
import { galleryRoot, treeNode } from './gallery-state.types';

@Injectable({ providedIn: 'root' })
export class GalleryState {
  /* DI */
  private readonly galleryLocations = inject(GalleryLocations);

  private readonly fileSystem = inject(FileSystem);

  /* State */
  private readonly locations$ = this.galleryLocations.locations();

  private readonly selectedLocation$ = new BehaviorSubject<string | null>(null);

  private readonly images$ = new BehaviorSubject<FileInfo[]>([]);

  private readonly galleryRoot$: Observable<TreeNode<string>> = this.locations$
    .pipe(
      startWith([]),
      map(locations => {
        const root = galleryRoot();
        root.children = locations.map((location, i) => {
          const node = treeNode(location, false);

          if (i === 0) {
            node.isSelected = true;
            this.navigateTo(node.id).then();
          }

          return node;
        });
        return root;
      })
    );

  /* Getters */
  readonly locations = () => this.locations$;

  readonly images = () => this.images$.asObservable();

  readonly galleryRoot = () => this.galleryRoot$;

  readonly selectedLocation = () => this.selectedLocation$.asObservable();

  /* Modifiers */
  readonly navigateTo = async (path: string) => {
    this.selectedLocation$.next(path);

    const response = await this.fileSystem.readImages(path);

    this.images$.next(response.success ? response.data : []);
  };

  /* Misc */
  readonly getDirContents = async (path: string) => await this.fileSystem.readDirectories(path);
}
