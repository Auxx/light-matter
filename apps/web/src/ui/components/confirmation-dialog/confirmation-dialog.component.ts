import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { filter } from 'rxjs';

export interface ConfirmationDialogOptions {
  title: string;
  description: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [
    DialogModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  readonly options = inject<ConfirmationDialogOptions>(DIALOG_DATA);

  static readonly open = (dialog: Dialog, options: ConfirmationDialogOptions) =>
    dialog.open<boolean, ConfirmationDialogOptions, ConfirmationDialogComponent>(
      ConfirmationDialogComponent,
      { data: options }
    )
      .closed
      .pipe(filter(result => result === true));
}
