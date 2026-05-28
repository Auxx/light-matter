import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-palette-preview',
  imports: [],
  templateUrl: './palette-preview.component.html',
  styleUrl: './palette-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PalettePreviewComponent {
  protected readonly variants = [ 'default', 'accent', 'warn' ];

  protected readonly heights = [ 'lowest', 'low', 'medium', 'high', 'highest' ];

  protected readonly variants2 = [ 'default', 'primary', 'warn' ];
}
