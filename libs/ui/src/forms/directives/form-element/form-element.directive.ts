import { Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive({})
export class FormElementDirective<T> implements ControlValueAccessor {
  protected disabled = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  readonly writeValue = (_value: T) => {
  };

  readonly registerOnChange = (fn: (value: T) => void): void => {
    this.onChange = fn;
  };

  readonly registerOnTouched = (fn: () => void): void => {
    this.onTouched = fn;
  };

  readonly setDisabledState = (flag: boolean): void => {
    this.disabled = flag;
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched: () => void = () => {
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onChange: (value: T) => void = () => {
  };
}
