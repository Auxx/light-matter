import type { Tags } from 'exiftool-vendored';
import { Arguments } from 'yargs';
import { FileInfo } from './fs';

export interface Desktop {
  ProcessManager: {
    getAppVersion: () => Promise<string>;
    isPackaged: () => Promise<boolean>;
    getPlatform: () => Promise<string>;
    argv: () => Promise<Arguments>;
    getSystemPaths: () => Promise<SystemPathMapping>;
  };

  FileSystem: {
    join: (...paths: string[]) => Promise<string>;
    readDir: (path: string) => Promise<FileInfo[]>;
    readJson: <T>(path: string) => Promise<ApiResponse<T>>;
    writeJson: <T>(path: string, data: T) => Promise<ApiResponse<undefined>>;
    readGalleryLocation: (path: string) => Promise<ApiResponse<FileInfo[]>>;
  };

  Dialogs: {
    openFolder: () => Promise<ApiResponse<string>>;
  };

  Exif: {
    read: (path: string) => Promise<ApiResponse<ExifTags>>;
  };

  openFolder: () => Promise<FileListing>;
  openFile: () => Promise<FileListing>;
  openFileFromArgs: (fileName: string) => Promise<FileListing>;
}

export interface Success<T> {
  success: true;
  data: T;
}

export interface Failure {
  success: false;
  errorMessage: string;
}

export interface FileListingData {
  folder: string;
  files: string[];
  selected?: string;
}

export type FileListing = Success<FileListingData> | Failure;

export type ApiResponse<T> = Success<T> | Failure;

export const appProtocol = 'atom';

export const appConfigName = 'light-matter.config.json';

export type SystemPath =
  | 'home'
  | 'appData'
  | 'userData'
  | 'temp'
  | 'exe'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'recent'
  | 'appConfig';

export type SystemPathMapping = Record<SystemPath, string>;

export const supportedFileExtensions = [
  'jpg',
  'jpeg',
  'jxl',
  'png',
  'gif',
  'svg',
  'webp',
  'avif',
  'bmp'
];

export type ExifTags =
  & Tags
  & {
    ImagePixelDepth?: string;
    ChromaFormat?: string;
  };
