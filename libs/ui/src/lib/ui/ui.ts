import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-ui',
  imports: [],
  templateUrl: './ui.html',
  styleUrl: './ui.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ui {}
