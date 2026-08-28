export type ThumbnailSize = 'small' | 'medium' | 'large';
export const allThumbnailSizes = [ 'small', 'medium', 'large' ] as const;
export const defaultThumbnailSize: ThumbnailSize = 'small';
export const thumbnailDimensions: Record<ThumbnailSize, {
  width: number;
  height: number;
}> = {
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
export const isAppConfig: (input: unknown) => input is AppConfigV1 = (() => {
  const _io0 = (input: any): boolean =>
    1 === input.version && ('object' === typeof input.gallery && null !== input.gallery && _io1(input.gallery))
    && ('object' === typeof input.system && null !== input.system && _io2(input.system));
  const _io1 = (input: any): boolean =>
    Array.isArray(input.locations) && input.locations.every((elem: any) => 'string' === typeof elem)
    && (undefined === input.thumbWidth || 'number' === typeof input.thumbWidth)
    && (undefined === input.thumbHeight || 'number' === typeof input.thumbHeight);
  const _io2 = (input: any): boolean =>
    'boolean' === typeof input.minimiseOnStart
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
