import { Arguments } from 'yargs';

export interface Desktop {
  getAppVersion: () => Promise<string>;
  platform: string;
  argv: () => Promise<Arguments>;
  isPackaged: () => Promise<boolean>;
}
