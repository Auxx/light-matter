import { Injectable } from '@angular/core';
import { AppConfig, AppConfigGallery, appConfigName, isAppConfig, SystemPathMapping } from 'internal-api';
import { ReplaySubject } from 'rxjs';
import { updateSubject } from '../../../rx-tools';

@Injectable({ providedIn: 'root' })
export class Configuration {
  private readonly config$ = new ReplaySubject<AppConfig>(1);

  constructor() {
    this.init().then();
  }

  readonly config = () => this.config$.asObservable();

  readonly updateGalleryConfig = (options: Partial<AppConfigGallery>) => {
    updateSubject(this.config$, config => {
      const result = structuredClone(config);
      result.gallery = { ...result.gallery, ...options };
      return result;
    });
  };

  private readonly init = async () => {
    const paths = await window.desktop.ProcessManager.getSystemPaths();
    const defaultConfig = this.defaultConfig(paths);
    const configPath = await window.desktop.FileSystem.join(paths.userData, appConfigName);
    const existing = await window.desktop.FileSystem.readJson<AppConfig | unknown>(configPath);

    if (!existing.success || !isAppConfig(existing.data)) {
      this.config$.next(defaultConfig);
      await window.desktop.FileSystem.writeJson(configPath, defaultConfig);
      return;
    }

    this.config$.next(existing.data);
  };

  private readonly defaultConfig = (paths: SystemPathMapping): AppConfig => {
    return {
      gallery: {
        locations: [ paths.pictures ]
      }
    };
  };
}
