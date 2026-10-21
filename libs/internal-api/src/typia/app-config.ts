import typia from 'typia';

export type ThumbnailSize = 'small' | 'smallMedium' | 'medium' | 'mediumLarge' | 'large';
export const allThumbnailSizes = [ 'small', 'smallMedium', 'medium', 'mediumLarge', 'large' ] as const;
export const defaultThumbnailSize: ThumbnailSize = 'small';
export const thumbnailDimensions: Record<ThumbnailSize, { width: number; height: number; }> = {
  small: { width: 192, height: 128 },
  smallMedium: { width: 240, height: 160 },
  medium: { width: 288, height: 192 },
  mediumLarge: { width: 336, height: 224 },
  large: { width: 384, height: 256 }
};

export const getThumbnailSize = (width?: number, height?: number): ThumbnailSize => {
  if (width === thumbnailDimensions.large.width && height === thumbnailDimensions.large.height) {
    return 'large';
  }

  if (width === thumbnailDimensions.medium.width && height === thumbnailDimensions.medium.height) {
    return 'medium';
  }

  if (width === thumbnailDimensions.smallMedium.width && height === thumbnailDimensions.smallMedium.height) {
    return 'smallMedium';
  }

  if (width === thumbnailDimensions.mediumLarge.width && height === thumbnailDimensions.mediumLarge.height) {
    return 'mediumLarge';
  }

  return 'small';
};

export const defaultThumbWidth = 192;
export const defaultThumbHeight = 128;

export interface AppConfigV1 {
  version: 1;
  gallery: AppConfigV1Gallery;
  system: AppConfigV1System;
}

export interface AppConfigV1Gallery {
  locations: string[];
  thumbWidth?: number;
  thumbHeight?: number;
  sortBy?: 'date' | 'name' | 'size';
  sortDir?: 'asc' | 'desc';
}

export interface AppConfigV1System {
  minimiseOnStart: boolean;
  theme?: 'dark' | 'light';
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CacheConfigV1 {
  version: 1;
}

export const isAppConfig: (input: unknown) => input is AppConfigV1 = typia.createIs<AppConfigV1>();

export const isCacheConfig: (input: unknown) => input is CacheConfigV1 = typia.createIs<CacheConfigV1>();
