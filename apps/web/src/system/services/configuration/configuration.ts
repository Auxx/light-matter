import { Injectable } from '@angular/core';
import { appConfigName, AppConfigV1, AppConfigV1Gallery, isAppConfig, SystemPathMapping } from 'internal-api';
import { ReplaySubject } from 'rxjs';
import { updateSubject } from '../../../rx-tools';

@Injectable({ providedIn: 'root' })
export class Configuration {
  private readonly config$ = new ReplaySubject<AppConfigV1>(1);

  private _defaultConfig?: AppConfigV1;

  private _configPath?: string;

  constructor() {
    this.init()
      .then(() => {
        this.config$.subscribe(config => {
          if (this._configPath !== undefined) {
            window.desktop.FileSystem.writeJson(this._configPath, config).then();
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
    });
  };

  private readonly init = async () => {
    const paths = await window.desktop.ProcessManager.getSystemPaths();
    this._defaultConfig = this.defaultConfig(paths);
    this._configPath = await window.desktop.FileSystem.join(paths.userData, appConfigName);
    const existing = await window.desktop.FileSystem.readJson<AppConfigV1 | unknown>(this._configPath);

    if (!existing.success || !isAppConfig(existing.data)) {
      this.config$.next(this._defaultConfig);
      return;
    }

    this.config$.next(existing.data);
  };

  private readonly defaultConfig = (paths: SystemPathMapping): AppConfigV1 => {
    return {
      version: 1,
      gallery: {
        locations: [ paths.pictures ]
      },
      system: {}
    };
  };
}
