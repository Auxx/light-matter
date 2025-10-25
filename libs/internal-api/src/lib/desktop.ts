export interface Desktop {
  getAppVersion: () => Promise<string>;
  platform: string;
  argv: () => Promise<string[]>;
  isPackaged: () => Promise<boolean>;
}
