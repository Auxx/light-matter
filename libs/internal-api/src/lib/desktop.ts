import type { Tags } from 'exiftool-vendored';
import { Arguments } from 'yargs';
import { FileInfo } from './fs';

export interface DesktopProcessManager {
  readonly getAppVersion: () => Promise<string>;
  readonly isPackaged: () => Promise<boolean>;
  readonly getPlatform: () => Promise<string>;
  readonly argv: () => Promise<Arguments>;
  readonly getSystemPaths: () => Promise<SystemPathMapping>;
  readonly quit: (code: number) => Promise<void>;
}

export interface DesktopFileSystem {
  readonly join: (...paths: string[]) => Promise<string>;
  readonly dirname: (fileName: string) => Promise<string>;
  readonly readDir: (path: string) => Promise<FileInfo[]>;
  readonly readJson: <T>(path: string) => Promise<ApiResponse<T>>;
  readonly writeJson: <T>(path: string, data: T) => Promise<ApiResponse<undefined>>;
  /**
   * @deprecated Use readDirectories() and readImages() instead
   */
  readonly readGalleryLocation: (path: string) => Promise<ApiResponse<FileInfo[]>>;
  readonly readDirectories: (path: string) => Promise<ApiResponse<FileInfo[]>>;
  readonly readImages: (path: string, sortBy: SortType, sortDir: SortDirection) => Promise<ApiResponse<FileInfo[]>>;
}

export interface DesktopDialogs {
  readonly openFolder: () => Promise<ApiResponse<string>>;
}

export interface DesktopExif {
  readonly read: (path: string) => Promise<ApiResponse<ExifTags>>;
}

export interface DesktopCacheManager {
  readonly clear: () => Promise<void>;
  readonly cacheSize: () => Promise<number>;
}

export interface Desktop {
  readonly ProcessManager: DesktopProcessManager;
  readonly FileSystem: DesktopFileSystem;
  readonly Dialogs: DesktopDialogs;
  readonly Exif: DesktopExif;
  readonly CacheManager: DesktopCacheManager;

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

export const appPaths = {
  thumbs: '/thumbs',
  raw: '/raw'
};

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

export const allSortTypes = [ 'date', 'name', 'size' ] as const;
export type SortType = typeof allSortTypes[number];

export const allSortDirections = [ 'desc', 'asc' ] as const;
export type SortDirection = typeof allSortDirections[number];
