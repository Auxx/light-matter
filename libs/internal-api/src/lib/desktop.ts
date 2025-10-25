export interface Desktop {
  getAppVersion: () => Promise<string>;
  platform: string;
  argv: string[];
  isPackaged: () => Promise<boolean>;
}
