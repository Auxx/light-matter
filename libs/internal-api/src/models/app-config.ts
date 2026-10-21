export type ThumbnailSize = 'small' | 'smallMedium' | 'medium' | 'mediumLarge' | 'large' | 'smallPlus' | 'smallMediumPlus' | 'mediumPlus' | 'mediumLargePlus';
export const allThumbnailSizes = [ 'small', 'smallPlus', 'smallMedium', 'smallMediumPlus', 'medium', 'mediumPlus', 'mediumLarge', 'mediumLargePlus', 'large' ] as const;
export const defaultThumbnailSize: ThumbnailSize = 'small';
export const thumbnailDimensions: Record<ThumbnailSize, {
  width: number;
  height: number;
}> = {
  small: { width: 192, height: 128 },
  smallPlus: { width: 216, height: 144 },
  smallMedium: { width: 240, height: 160 },
  smallMediumPlus: { width: 264, height: 176 },
  medium: { width: 288, height: 192 },
  mediumPlus: { width: 312, height: 208 },
  mediumLarge: { width: 336, height: 224 },
  mediumLargePlus: { width: 360, height: 240 },
  large: { width: 384, height: 256 }
};
export const getThumbnailSize = (width?: number, height?: number): ThumbnailSize => {
  if (width === thumbnailDimensions.smallPlus.width && height === thumbnailDimensions.smallPlus.height) return 'smallPlus';
  if (width === thumbnailDimensions.smallMediumPlus.width && height === thumbnailDimensions.smallMediumPlus.height) return 'smallMediumPlus';
  if (width === thumbnailDimensions.mediumPlus.width && height === thumbnailDimensions.mediumPlus.height) return 'mediumPlus';
  if (width === thumbnailDimensions.mediumLargePlus.width && height === thumbnailDimensions.mediumLargePlus.height) return 'mediumLargePlus';
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
  devToolsOpen?: boolean;
  histogramVisible?: boolean;
  exifVisible?: boolean;
  comparisonMode?: 'hdr' | 'sdr' | 'side-by-side' | 'stacked' | 'dual-side-by-side' | 'dual-stacked';
  comparisonSplit?: number;
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
export const isAppConfig: (input: unknown) => input is AppConfigV1 = (() => {
  const _io0 = (input: any): boolean =>
    1 === input.version && ('object' === typeof input.gallery && null !== input.gallery && _io1(input.gallery))
    && ('object' === typeof input.system && null !== input.system && _io2(input.system));
  const _io1 = (input: any): boolean =>
    Array.isArray(input.locations) && input.locations.every((elem: any) => 'string' === typeof elem)
    && (undefined === input.thumbWidth || 'number' === typeof input.thumbWidth)
    && (undefined === input.thumbHeight || 'number' === typeof input.thumbHeight)
    && (undefined === input.sortBy || 'date' === input.sortBy || 'name' === input.sortBy || 'size' === input.sortBy)
    && (undefined === input.sortDir || 'asc' === input.sortDir || 'desc' === input.sortDir);
  const _io2 = (input: any): boolean =>
    'boolean' === typeof input.minimiseOnStart
    && (undefined === input.theme || 'dark' === input.theme || 'light' === input.theme)
    && (undefined === input.devToolsOpen || 'boolean' === typeof input.devToolsOpen)
    && (undefined === input.histogramVisible || 'boolean' === typeof input.histogramVisible)
    && (undefined === input.exifVisible || 'boolean' === typeof input.exifVisible)
    && (undefined === input.comparisonMode || 'hdr' === input.comparisonMode || 'sdr' === input.comparisonMode || 'side-by-side' === input.comparisonMode || 'stacked' === input.comparisonMode || 'dual-side-by-side' === input.comparisonMode || 'dual-stacked' === input.comparisonMode)
    && (undefined === input.comparisonSplit || 'number' === typeof input.comparisonSplit && input.comparisonSplit >= 1 && input.comparisonSplit <= 99)
    && (undefined === input.bounds || 'object' === typeof input.bounds && null !== input.bounds && _io3(input.bounds));
  const _io3 = (input: any): boolean =>
    'number' === typeof input.x && 'number' === typeof input.y && 'number' === typeof input.width
    && 'number' === typeof input.height;
  return (input: any): input is AppConfigV1 => 'object' === typeof input && null !== input && _io0(input);
})();
export const isCacheConfig: (input: unknown) => input is CacheConfigV1 = (() => {
  const _io0 = (input: any): boolean => 1 === input.version;
  return (input: any): input is CacheConfigV1 => 'object' === typeof input && null !== input && _io0(input);
})();
