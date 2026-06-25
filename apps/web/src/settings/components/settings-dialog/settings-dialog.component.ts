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
    this.init().then();
  }

  /* State modifiers */
  private readonly init = async () => {
    const cacheSize = await this.cacheManager.cacheSize();
    console.log('cacheSize', cacheSize);
    this.cacheSize.set(cacheSize);
  };

  /* Static methods */
  static readonly open = (dialog: Dialog) => dialog.open(SettingsDialogComponent).closed;
}
