import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  ActionButtonComponent,
  DialogComponent,
  FlatButtonComponent,
  TextComponent,
  TitleComponent,
  ToolbarComponent
} from '@light-matter/ui';
import { CacheManager } from '../../../ipc/cache-manager';
import { ByteSizePipe } from '../../../ui/pipes/byte-size/byte-size.pipe';

@Component({
  selector: 'app-settings-dialog',
  imports: [
    ActionButtonComponent,
    DialogComponent,
    TextComponent,
    TitleComponent,
    FlatButtonComponent,
    ToolbarComponent,
    ByteSizePipe
  ],
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsDialogComponent {
  /* DI */
  readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);

  readonly cacheManager = inject(CacheManager);

  /* State */
  protected readonly cacheSize = signal(0);

  /* Constructor */
  constructor() {
    this.updateCacheSize().then();
  }

  /* State modifiers */
  private readonly updateCacheSize = async () => this.cacheSize.set(await this.cacheManager.cacheSize());

  /* Event handlers */
  protected readonly deleteCache = async () => {
    await this.cacheManager.clear();
    await this.updateCacheSize();
  };

  /* Static methods */
  static readonly open = (dialog: Dialog) => dialog.open(SettingsDialogComponent).closed;
}
