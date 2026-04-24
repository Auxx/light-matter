import { Arguments } from 'yargs';

export interface Desktop {
  getAppVersion: () => Promise<string>;
  isPackaged: () => Promise<boolean>;
  getPlatform: () => Promise<string>;
  argv: () => Promise<Arguments>;

  openFolder: () => Promise<FileListing>;
  openFile: () => Promise<FileListing>;
  openFileFromArgs: (fileName: string) => Promise<FileListing>;

  test: () => Promise<void>;
}

export interface Success<T> {
  success: true;
  data: T;
}

export interface Failure {
  success: false;
}

export interface FileListingData {
  folder: string;
  files: string[];
  selected?: string;
}

export type FileListing = Success<FileListingData> | Failure;

export const appProtocol = 'atom';
