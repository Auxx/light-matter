import { Injectable } from '@angular/core';
import { appProtocol } from 'internal-api';
import { BehaviorSubject, filter, map, take } from 'rxjs';
import { updateSubject } from '../../../rx-tools';
import { defaultViewNavigatorState, ViewNavigatorState, ViewNavigatorValidState } from './view-navigator.types';

@Injectable({ providedIn: 'root' })
export class ViewNavigator {
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
      selectedFileUrl: this.url(selectedFile),
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
          selectedFileUrl: this.url(selectedFile),
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
          selectedFileUrl: this.url(selectedFile),
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

  private readonly url = (selectedFile: string): string => `${appProtocol}://${encodeURIComponent(selectedFile)}`;
}
