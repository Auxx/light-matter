import { Desktop } from './lib/desktop';

export * from './lib/desktop';
export * from './lib/flags';
export * from './lib/fs';

declare global {
  interface Window {
    desktop: Desktop;
  }
}
