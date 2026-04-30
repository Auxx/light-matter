import { Directive } from '@angular/core';

@Directive({
  selector: '[appStopPropagation]',
  host: {
    '(click)': 'stopPropagation($event)'
  }
})
export class StopPropagation {
  readonly stopPropagation = (event: Event) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
  };
}
