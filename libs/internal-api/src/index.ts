import { Desktop } from './lib/desktop';

export * from './lib/desktop';

declare global {
  interface Window {
    desktop: Desktop;
  }
}
