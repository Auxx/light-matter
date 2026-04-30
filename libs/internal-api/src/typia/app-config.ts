import typia from 'typia';

export interface AppConfigV1 {
  version: 1;
  gallery: AppConfigV1Gallery;
  system: AppConfigV1System;
}

export interface AppConfigV1Gallery {
  locations: string[];
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

export const isAppConfig: (input: unknown) => input is AppConfigV1 = typia.createIs<AppConfigV1>();
