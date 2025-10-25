import { Arguments } from 'yargs';

export interface Desktop {
  getAppVersion: () => Promise<string>;
  platform: string;
  argv: () => Promise<Arguments>;
  isPackaged: () => Promise<boolean>;
  openFolder: () => Promise<FileListing>;
}

export interface Success<T> {
  success: true;
  data:T;
}

export interface Failure {
  success: false;
}

export interface FileListingData {
  folder: string;
  files: string[];
}

export type FileListing = Success<FileListingData> | Failure;
