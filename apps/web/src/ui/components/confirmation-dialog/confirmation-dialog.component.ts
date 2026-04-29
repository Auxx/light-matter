import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';

export interface ConfirmationDialogOptions {
  title: string;
  description: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [
    MatDialogModule,
    MatButton
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  readonly options = inject<ConfirmationDialogOptions>(MAT_DIALOG_DATA);

  static readonly open = (dialog: MatDialog, options: ConfirmationDialogOptions) =>
    dialog.open<ConfirmationDialogComponent, ConfirmationDialogOptions, boolean>(
      ConfirmationDialogComponent,
      { data: options }
    )
      .afterClosed()
      .pipe(filter(result => result === true));
}
