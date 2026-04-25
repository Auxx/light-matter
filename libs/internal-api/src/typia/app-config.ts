import typia from 'typia';

export interface AppConfig {
  gallery: {
    locations: string[];
  };
}

export const isAppConfig = typia.createIs<AppConfig>();

export const validateAppConfig = typia.createValidate<AppConfig>();
