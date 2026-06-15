import { Directive } from '@angular/core';

@Directive({
  selector: '[uiStopPropagation]',
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
