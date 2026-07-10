import { appConfigName } from 'internal-api';
import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export class StartupConfig {
  private _bounds: Electron.Rectangle | null = null;
  private _minimiseOnStart = false;

  constructor(private readonly app: Electron.App) {
    this.init();
  }

  readonly bounds = () => this._bounds;

  readonly minimiseOnStart = () => this._minimiseOnStart;

  readonly configPath = () => join(this.app.getPath('userData'), appConfigName);

  readonly saveBounds = async (bounds: Electron.Rectangle) => {
    const config = this.load();

    // That should never be the case when the app is functioning correctly.
    // If it was closed before a config file was created,
    // then we should not mess with it anyway.
    if (!(config instanceof Object)) {
      return;
    }

    const system = config['system'];

    if (!(system instanceof Object)) {
      config['system'] = {};
    }

    config['system'].bounds = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    };

    await this.save(config);
  };

  private readonly init = () => {
    const json = this.load();

    if (json === null) {
      return;
    }

    this.parseConfig(json);
  };

  private readonly parseConfig = (config: unknown) => {
    this._bounds = null;

    if (!(config instanceof Object)) {
      return;
    }

    const system = config['system'];

    if (!(system instanceof Object)) {
      return;
    }

    this._minimiseOnStart = system.minimiseOnStart === true;

    const x = system.bounds?.x;
    const y = system.bounds?.y;
    const width = system.bounds?.width;
    const height = system.bounds?.height;

    if (typeof x === 'number' && typeof y === 'number' && typeof width === 'number' && typeof height === 'number') {
      this._bounds = { x, y, width, height };
      return;
    }
  };

  private readonly load = () => {
    try {
      const configPath = this.configPath();
      const result = readFileSync(configPath, 'utf-8');
      return JSON.parse(result);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('ERROR: Unable to load startup config file', error);
      }
      return null;
    }
  };

  private readonly save = async (data: unknown) => {
    try {
      const configPath = this.configPath();
      await writeFile(configPath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (_) {
      return false;
    }
  };
}
