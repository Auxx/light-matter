import { inject, Injectable } from '@angular/core';
import { updateSubject } from '@light-matter/ui';
import {
  AppConfigV1,
  AppConfigV1Gallery,
  defaultThumbHeight,
  defaultThumbWidth,
  isAppConfig,
  SystemPathMapping
} from 'internal-api';
import { ReplaySubject } from 'rxjs';
import { FileSystem } from '../../../ipc/file-system';
import { ProcessManager } from '../../../ipc/process-manager';

@Injectable({ providedIn: 'root' })
export class Configuration {
  private readonly fileSystem = inject(FileSystem);

  private readonly processManager = inject(ProcessManager);

  private readonly config$ = new ReplaySubject<AppConfigV1>(1);

  private _defaultConfig?: AppConfigV1;

  private _configPath?: string;

  constructor() {
    this.init()
      .then(() => {
        this.config$.subscribe(config => {
          if (this._configPath !== undefined) {
            this.fileSystem.writeJson(this._configPath, config).then();
          }
        });
      });
  }

  readonly config = () => this.config$.asObservable();

  readonly updateGalleryConfig = (options: Partial<AppConfigV1Gallery>) => {
    updateSubject(this.config$, config => {
      const result = structuredClone(config);
      result.gallery = { ...result.gallery, ...options };
      return result;
    })
      .subscribe();
  };

  private readonly init = async () => {
    const paths = await this.processManager.getSystemPaths();
    this._defaultConfig = this.defaultConfig(paths);
    this._configPath = paths.appConfig;
    const existing = await this.fileSystem.readJson<AppConfigV1 | unknown>(this._configPath);

    if (!existing.success || !isAppConfig(existing.data)) {
      this.config$.next(this._defaultConfig);
      return;
    }

    this.config$.next({
      ...this._defaultConfig,
      ...existing.data
    });
  };

  private readonly defaultConfig = (paths: SystemPathMapping): AppConfigV1 => {
    return {
      version: 1,
      gallery: {
        locations: [ paths.pictures ],
        thumbWidth: defaultThumbWidth,
        thumbHeight: defaultThumbHeight
      },
      system: {
        minimiseOnStart: false
      }
    };
  };
}
