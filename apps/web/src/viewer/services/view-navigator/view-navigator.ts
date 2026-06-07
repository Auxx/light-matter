import { inject, Injectable } from '@angular/core';
import { updateSubject } from '@light-matter/ui';
import { BehaviorSubject, combineLatest, filter, map, Observable, take, tap } from 'rxjs';
import { GalleryState } from '../../../gallery/services/gallery-state/gallery-state';
import { imageUrl } from '../../utils/image-url';
import { defaultViewNavigatorState, SelectedImage, ViewNavigatorState } from './view-navigator.types';

@Injectable({ providedIn: 'root' })
export class ViewNavigator {
  /* DI */
  private readonly galleryState = inject(GalleryState);

  /* State */
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
  readonly goPrevious = () =>
    combineLatest([ this.hasPrevious$, this.selectedIndex$ ])
      .pipe(
        take(1),
        filter(([ hasPrevious ]) => hasPrevious),
        map(([ _, selectedIndex ]) => selectedIndex - 1)
      )
      .subscribe(selectedIndex => this.selectedIndex$.next(selectedIndex));

  readonly goNext = () =>
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

  // OLD

  private readonly state$: BehaviorSubject<ViewNavigatorState> = new BehaviorSubject(defaultViewNavigatorState());

  readonly state = () => this.state$.asObservable();

  readonly reset = () => this.state$.next(defaultViewNavigatorState());

  readonly setFiles = (files: string[], file?: string) => {
    if (files.length === 0) {
      this.reset();
      return;
    }

    const { selectedIndex, selectedFile } = this.ensureSelection(files, file);

    this.state$.next({
      isValid: true,
      files,
      selectedFile,
      selectedFileUrl: imageUrl(selectedFile),
      selectedIndex: selectedIndex,
      prev: selectedIndex - 1,
      next: selectedIndex + 1 >= files.length ? -1 : selectedIndex + 1
    });
  };

  readonly prev = () =>
    updateSubject(
      this.state$,
      state => {
        if (!state.isValid || state.prev < 0) {
          return state;
        }

        const selectedIndex = state.prev;
        const selectedFile = state.files[selectedIndex];

        return {
          ...state,
          selectedIndex,
          selectedFile,
          selectedFileUrl: imageUrl(selectedFile),
          prev: selectedIndex - 1,
          next: selectedIndex + 1 >= state.files.length ? -1 : selectedIndex + 1
        };
      }
    );

  readonly next = () =>
    updateSubject(
      this.state$,
      state => {
        if (!state.isValid || state.next < 0) {
          return state;
        }

        const selectedIndex = state.next;
        const selectedFile = state.files[selectedIndex];

        return {
          ...state,
          selectedIndex,
          selectedFile,
          selectedFileUrl: imageUrl(selectedFile),
          prev: selectedIndex - 1,
          next: selectedIndex + 1 >= state.files.length ? -1 : selectedIndex + 1
        };
      }
    );

  private readonly findSelectedIndex = (files: string[], file?: string): number =>
    file === undefined
      ? -1
      : files.indexOf(file);

  private readonly ensureSelection = (files: string[], file?: string): {
    selectedIndex: number;
    selectedFile: string;
  } => {
    const index = this.findSelectedIndex(files, file);

    return index === -1
      ? { selectedIndex: 0, selectedFile: files[0] }
      : { selectedIndex: index, selectedFile: files[index] };
  };
}
