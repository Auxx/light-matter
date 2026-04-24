import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { fromEvent, share } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Keyboard {
  private readonly document = inject(DOCUMENT);

  private readonly keyup$ = fromEvent<KeyboardEvent>(this.document, 'keyup').pipe(share());

  readonly keyup = () => this.keyup$;
}
