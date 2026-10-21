import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Configuration } from '../configuration/configuration';

export type AppTheme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly configuration = inject(Configuration);

  readonly current = signal<AppTheme>('dark');

  constructor() {
    this.configuration.config()
      .pipe(takeUntilDestroyed())
      .subscribe(config => this.setTheme(config.system.theme ?? 'dark'));
  }

  readonly toggle = () => {
    this.configuration.updateSystemConfig({
      theme: this.current() === 'dark' ? 'light' : 'dark'
    });
  };

  private readonly setTheme = (theme: AppTheme) => {
    this.current.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
  };
}
