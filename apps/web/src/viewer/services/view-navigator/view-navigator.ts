import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, take, tap } from 'rxjs';
import { GalleryState } from '../../../gallery/services/gallery-state/gallery-state';
import { imageUrl } from '../../utils/image-url';
import { SelectedImage } from './view-navigator.types';

@Injectable({ providedIn: 'root' })
export class ViewNavigator {
  /* DI */
  private readonly galleryState = inject(GalleryState);

  /* State */
  readonly standalone = signal(false);

  private readonly images$ = this.galleryState.images();

  private readonly selectedIndex$ = new BehaviorSubject(-1);

  private readonly selectedImage$: Observable<SelectedImage | null> = combineLatest([
    this.images$,
    this.selectedIndex$
  ])
    .pipe(
      map(([ images, index ]) => {
        if (index < 0 || index >= images.length) {
          return null;
        }

        return {
          path: images[index].path,
          url: imageUrl(images[index].path)
        };
      })
    );

  private readonly hasPrevious$ = combineLatest([ this.images$, this.selectedIndex$ ])
    .pipe(map(([ _, index ]) => index > 0));

  private readonly hasNext$ = combineLatest([ this.images$, this.selectedIndex$ ])
    .pipe(map(([ images, index ]) => index >= 0 && index < images.length - 1));

  /* Getters */
  readonly selectedImage = () => this.selectedImage$;

  readonly hasPrevious = () => this.hasPrevious$;

  readonly hasNext = () => this.hasNext$;

  /* Modifiers */
  readonly previous = () =>
    combineLatest([ this.hasPrevious$, this.selectedIndex$ ])
      .pipe(
        take(1),
        filter(([ hasPrevious ]) => hasPrevious),
        map(([ _, selectedIndex ]) => selectedIndex - 1)
      )
      .subscribe(selectedIndex => this.selectedIndex$.next(selectedIndex));

  readonly next = () =>
    combineLatest([ this.hasNext$, this.selectedIndex$ ])
      .pipe(
        take(1),
        filter(([ hasNext ]) => hasNext),
        map(([ _, selectedIndex ]) => selectedIndex + 1)
      )
      .subscribe(selectedIndex => this.selectedIndex$.next(selectedIndex));

  readonly selectImage = (path: string) =>
    this.images$
      .pipe(
        take(1),
        map(images => images.findIndex(image => image.path === path)),
        tap(index => this.selectedIndex$.next(index)),
        map(index => index >= 0)
      );
}
