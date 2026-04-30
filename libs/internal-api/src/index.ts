import { Desktop } from './lib/desktop';

export * from './lib/desktop';
export * from './lib/flags';
export * from './lib/fs';
export * from './models/app-config';

declare global {
  interface Window {
    desktop: Desktop;
  }
}
