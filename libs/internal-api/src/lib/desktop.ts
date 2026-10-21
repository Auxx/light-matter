import type { Tags } from 'exiftool-vendored';
import { Arguments } from 'yargs';
import { FileInfo } from './fs';

export interface DesktopProcessManager {
  readonly getAppVersion: () => Promise<string>;
  readonly isPackaged: () => Promise<boolean>;
  readonly getDevToolsOpen: () => Promise<boolean>;
  readonly setDevToolsOpen: (open: boolean) => Promise<void>;
  readonly getPlatform: () => Promise<string>;
  readonly argv: () => Promise<Arguments>;
  readonly getSystemPaths: () => Promise<SystemPathMapping>;
  readonly openConfigFile: () => Promise<string>;
  readonly quit: (code: number) => Promise<void>;
  readonly setWindowTitle: (title: string) => Promise<void>;
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
  readonly deleteFile: (path: string) => Promise<ApiResponse<undefined>>;
}

export interface DesktopDialogs {
  readonly openFolder: () => Promise<ApiResponse<string>>;
}

export interface DesktopExif {
  readonly read: (path: string) => Promise<ApiResponse<ExifTags>>;
}

export interface DesktopCacheManager {
  readonly clear: () => Promise<CacheClearResult>;
  readonly clearFullSize: () => Promise<CacheClearResult>;
  readonly clearThumbnails: () => Promise<CacheClearResult>;
  readonly cacheSize: () => Promise<number>;
  readonly cacheInfo: () => Promise<CacheInfo>;
  readonly openCacheFolder: () => Promise<string>;
}

export interface CacheClearResult {
  entries: number;
  bytes: number;
}

export interface CacheInfo extends CacheClearResult {
  path: string;
  fullSize: CacheClearResult;
  thumbnails: CacheClearResult;
}

export interface DesktopHistogram {
  readonly calculate: (path: string) => Promise<ApiResponse<ImageHistogram>>;
}

export interface Desktop {
  readonly ProcessManager: DesktopProcessManager;
  readonly FileSystem: DesktopFileSystem;
  readonly Dialogs: DesktopDialogs;
  readonly Exif: DesktopExif;
  readonly CacheManager: DesktopCacheManager;
  readonly Histogram: DesktopHistogram;

  openFolder: () => Promise<FileListing>;
  openFile: () => Promise<FileListing>;
  openFileFromArgs: (fileName: string) => Promise<FileListing>;
  getPathForFile: (file: File) => string;
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

export interface ImageHistogram {
  linear: {
    white: number[];
    red: number[];
    green: number[];
    blue: number[];
  };
  logarithmic: {
    white: number[];
    red: number[];
    green: number[];
    blue: number[];
  };
  /** Upper bound of the displayed luminance range, based on this image's actual peak. */
  maximumNits: number;
  /** Lower bound of the logarithmic luminance range. */
  minimumLogNits: number;
}

export const appProtocol = 'atom';

export const appConfigName = 'light-matter.config.json';

export const appPaths = {
  thumbs: '/thumbs',
  raw: '/raw',
  histogram: '/histogram'
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

export const supportedFileFormats = [
  {
    name: 'AVIF',
    extensions: [ 'avif' ],
    hdr: true,
    fullSizeCache: true,
    bitDepth: '8, 10 or 12 bit/channel',
    details: 'HDR preview for Rec. 2020 PQ and HLG profiles.'
  },
  {
    name: 'BMP',
    extensions: [ 'bmp' ],
    hdr: false,
    fullSizeCache: false,
    bitDepth: '1, 4, 8, 16, 24 or 32 bit/pixel',
    details: 'Raster bitmap format.'
  },
  {
    name: 'GIF',
    extensions: [ 'gif' ],
    hdr: false,
    fullSizeCache: false,
    bitDepth: 'Up to 8 bit indexed color',
    details: 'Palette-based raster format; animation is supported by the image viewer.'
  },
  {
    name: 'HEIF / HEIC',
    extensions: [ 'heif', 'heic' ],
    hdr: true,
    fullSizeCache: true,
    bitDepth: '8 bit SDR; HDR 10 bit and above',
    details: 'HDR preview for Rec. 2020 PQ and HLG profiles.'
  },
  {
    name: 'JPEG',
    extensions: [ 'jpg', 'jpeg' ],
    hdr: false,
    fullSizeCache: false,
    bitDepth: '8 bit/channel',
    details: 'Raster image, usually SDR.'
  },
  {
    name: 'JPEG XL',
    extensions: [ 'jxl' ],
    hdr: true,
    fullSizeCache: false,
    bitDepth: '8–16 bit integer; 16/32 bit float',
    details: 'Supports high bit depth and HDR where the file and decoder expose it.'
  },
  {
    name: 'JPEG XR',
    extensions: [ 'jxr' ],
    hdr: true,
    fullSizeCache: true,
    bitDepth: '8/16 bit integer; 16/32 bit float',
    details: 'High bit depth and floating-point images are converted through the HDR display path.'
  },
  {
    name: 'OpenEXR',
    extensions: [ 'exr' ],
    hdr: true,
    fullSizeCache: true,
    bitDepth: '16 bit half or 32 bit float',
    details: 'HDR; the viewer currently uses the standard RGB channels.'
  },
  {
    name: 'PNG',
    extensions: [ 'png' ],
    hdr: true,
    fullSizeCache: false,
    bitDepth: '1/2/4/8/16 bit/channel',
    details: 'Lossless raster format with transparency and HDR support for high bit-depth images.'
  },
  {
    name: 'Radiance HDR',
    extensions: [ 'hdr' ],
    hdr: true,
    fullSizeCache: true,
    bitDepth: '32 bit RGBE per pixel',
    details: 'HDR RGBE data is expanded to floating-point RGB for display.'
  },
  {
    name: 'SVG',
    extensions: [ 'svg' ],
    hdr: false,
    fullSizeCache: false,
    bitDepth: 'Not applicable',
    details: 'Vector graphics; rasterized for display at the required size.'
  },
  {
    name: 'TIFF',
    extensions: [ 'tif', 'tiff' ],
    hdr: true,
    fullSizeCache: true,
    bitDepth: 'Depends on file; common 8/16 bit integer and float variants',
    details: '16-bit HDR TIFF images use the HDR display path; other TIFFs are converted for display.'
  },
  {
    name: 'Ultra HDR JPEG',
    extensions: [ 'jpg', 'jpeg' ],
    hdr: true,
    fullSizeCache: false,
    bitDepth: '8 bit base image + HDR gain map',
    details: 'JPEG with an embedded gain map; HDR is displayed when the image contains a supported gain map.'
  },
  {
    name: 'WebP',
    extensions: [ 'webp' ],
    hdr: false,
    fullSizeCache: false,
    bitDepth: '8 bit/channel',
    details: 'Lossy or lossless raster format with transparency and animation.'
  }
] as const;

export const supportedFileExtensions: string[] = [ ...new Set(
  supportedFileFormats.flatMap(format => [ ...format.extensions ])
) ];

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
