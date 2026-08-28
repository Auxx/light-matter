import typia from 'typia';

export type ThumbnailSize = 'small' | 'medium' | 'large';
export const allThumbnailSizes = [ 'small', 'medium', 'large' ] as const;
export const defaultThumbnailSize: ThumbnailSize = 'small';
export const thumbnailDimensions: Record<ThumbnailSize, { width: number; height: number; }> = {
  small: { width: 192, height: 128 },
  medium: { width: 288, height: 192 },
  large: { width: 384, height: 256 }
};

export const getThumbnailSize = (width?: number, height?: number): ThumbnailSize => {
  if (width === thumbnailDimensions.large.width && height === thumbnailDimensions.large.height) {
    return 'large';
  }

  if (width === thumbnailDimensions.medium.width && height === thumbnailDimensions.medium.height) {
    return 'medium';
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
}

export interface AppConfigV1System {
  minimiseOnStart: boolean;
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
