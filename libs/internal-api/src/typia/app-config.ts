import typia from 'typia';

export interface AppConfig {
  gallery: AppConfigGallery;
}

export interface AppConfigGallery {
  locations: string[];
}

export const isAppConfig = typia.createIs<AppConfig>();

export const validateAppConfig = typia.createValidate<AppConfig>();
