import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  /* State */
  private readonly isVisible$ = new BehaviorSubject(false);

  private readonly component$ = new BehaviorSubject<ComponentType<unknown> | null>(null);

  /* Getters */
  readonly isVisible = () => this.isVisible$.asObservable();

  readonly component = () => this.component$.asObservable();

  /* State modifiers */
  readonly show = (component: ComponentType<unknown>) => {
    this.isVisible$.next(true);
    this.component$.next(component);
  };

  readonly hide = () => this.isVisible$.next(false);
}
