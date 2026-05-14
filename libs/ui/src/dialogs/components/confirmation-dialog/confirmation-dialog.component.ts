import { Dialog, DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { filter } from 'rxjs';
import { ActionButtonComponent } from '../../../actions';
import { TextComponent, TitleComponent } from '../../../content';
import { DialogComponent } from '../dialog/dialog.component';

export interface ConfirmationDialogOptions {
  title: string;
  description: string;
}

@Component({
  selector: 'ui-confirmation-dialog',
  imports: [
    DialogModule,
    DialogComponent,
    TitleComponent,
    TextComponent,
    ActionButtonComponent
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  readonly options = inject<ConfirmationDialogOptions>(DIALOG_DATA);

  readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);

  static readonly open = (dialog: Dialog, options: ConfirmationDialogOptions) =>
    dialog.open<boolean, ConfirmationDialogOptions, ConfirmationDialogComponent>(
      ConfirmationDialogComponent,
      { data: options }
    )
      .closed
      .pipe(filter(result => result === true));
}
