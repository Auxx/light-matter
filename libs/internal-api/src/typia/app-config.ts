import typia from 'typia';

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
