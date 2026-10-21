export interface SelectedImage {
  path: string;
  url: string;
  size: number;
  modifiedAt?: number;
}

export interface ViewNavigatorValidState {
  isValid: true;
  selectedFile: string;
  selectedFileUrl: string;
  selectedIndex: number;
  files: string[];
  prev: number;
  next: number;
}

export interface ViewNavigatorInvalidState {
  isValid: false;
}

export type ViewNavigatorState = ViewNavigatorValidState | ViewNavigatorInvalidState;

export const defaultViewNavigatorState = (): ViewNavigatorState => ({ isValid: false });
