import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs';
import { MouseMovement, MouseTrackerService } from '../../../dom';
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
    '[style.--position]': 'stylePosition()'
  }
})
export class SliderComponent extends FormElementDirective<number> {
  readonly min = input(0);

  readonly max = input(100);

  protected readonly currentValue = signal(0);

  protected readonly position = computed(() => (this.currentValue() - this.min()) / (this.max() - this.min()));

  protected readonly stylePosition = computed(() => `${this.position() * 100}%`);

  private readonly mouseTrackerService = inject(MouseTrackerService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly trackRef = viewChild<unknown, ElementRef<HTMLDivElement>>('track', { read: ElementRef });

  override readonly writeValue = (value: number) => {
    this.currentValue.set(value);
  };

  readonly onMouseDown = (event: MouseEvent) => {
    if (event.target instanceof HTMLDivElement) {
      const track = this.trackRef()?.nativeElement;

      if (track === undefined) {
        return;
      }

      const position = this.position();
      const min = this.min();
      const max = this.max();
      const width = track.offsetWidth;
      const origin = width * position;

      this.mouseTrackerService
        .mouseDown(event)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          map(state => this.getX(origin, state, width)),
          map(x => x / width),
          map(x => (max - min) * x + min),
          distinctUntilChanged()
        )
        .subscribe(value => {
          this.currentValue.set(value);
          this.onChange(value);
        });
    }
  };

  private readonly getX = (origin: number, state: MouseMovement, width: number): number => {
    const x = origin + state.dx;

    if (x < 0) {
      return 0;
    }

    if (x > width) {
      return width;
    }

    return x;
  };
}
