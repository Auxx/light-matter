import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ActionButtonComponent,
  DialogComponent,
  FlatButtonComponent,
  TextComponent,
  TitleComponent,
  ToolbarComponent
} from '@light-matter/ui';

@Component({
  selector: 'app-settings-dialog',
  imports: [
    ActionButtonComponent,
    DialogComponent,
    TextComponent,
    TitleComponent,
    FlatButtonComponent,
    ToolbarComponent
  ],
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsDialogComponent {
  readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);

  static readonly open = (dialog: Dialog) => dialog.open(SettingsDialogComponent).closed;
}
