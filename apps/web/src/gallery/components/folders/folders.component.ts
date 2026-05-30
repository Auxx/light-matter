import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '@light-matter/ui';
import { FileInfo } from 'internal-api';

// TODO Deprecated, replace with a tree in the left menu
@Component({
  selector: 'app-folders',
  imports: [
    IconComponent
  ],
  templateUrl: './folders.component.html',
  styleUrl: './folders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoldersComponent {
  readonly contents = input.required<FileInfo[]>();

  readonly clicked = output<FileInfo>();
}
