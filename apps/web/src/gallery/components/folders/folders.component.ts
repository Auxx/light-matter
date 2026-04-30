import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FileInfo } from 'internal-api';

@Component({
  selector: 'app-folders',
  imports: [
    MatIcon
  ],
  templateUrl: './folders.component.html',
  styleUrl: './folders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoldersComponent {
  readonly contents = input.required<FileInfo[]>();

  readonly clicked = output<FileInfo>();
}
