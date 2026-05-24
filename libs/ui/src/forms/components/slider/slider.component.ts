import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormElementDirective } from '../../directives/form-element/form-element.directive';

@Component({
  selector: 'ui-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SliderComponent)
    }
  ],
  host: {
    '[style.--position]': 'position()'
  }
})
export class SliderComponent extends FormElementDirective<number> {
  readonly min = input(0);

  readonly max = input(100);

  protected readonly currentValue = signal(0);

  protected readonly position = computed(() => {
    const result = (this.currentValue() - this.min()) / (this.max() - this.min()) * 100;

    console.log('position', result);

    return `${result}%`;
  });

  override readonly writeValue = (value: number) => {
    console.log('SliderComponent.writeValue', value);
    this.currentValue.set(value);
  };
}
