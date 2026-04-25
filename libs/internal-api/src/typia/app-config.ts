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
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const isAppConfig = typia.createIs<AppConfigV1>();

export const validateAppConfig = typia.createValidate<AppConfigV1>();
