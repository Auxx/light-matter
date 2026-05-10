import { DOCUMENT, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { updateSubject } from '../../rx-tools';
import { MouseMovement } from './mouse-tracker.types';

@Injectable({ providedIn: 'root' })
export class MouseTrackerService {
  private readonly document = inject(DOCUMENT);

  readonly mouseDown = (event: MouseEvent): Observable<MouseMovement> => {
    event.preventDefault();
    event.stopPropagation();

    const result = new BehaviorSubject<MouseMovement>({
      originX: event.clientX,
      originY: event.clientY,
      dx: 0,
      dy: 0
    });

    const mouseUp = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      this.document.body.removeEventListener('mouseup', mouseUp);
      this.document.body.removeEventListener('mousemove', mouseMove);

      result.complete();
    };

    const mouseMove = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      updateSubject(
        result,
        state => ({
          originX: state.originX,
          originY: state.originY,
          dx: event.clientX - state.originX,
          dy: event.clientY - state.originY
        })
      );
    };

    this.document.body.addEventListener('mouseup', mouseUp);
    this.document.body.addEventListener('mousemove', mouseMove);

    return result.asObservable();
  };
}
