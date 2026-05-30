import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconComponent } from '../../../content';
import { MouseMovement } from '../../../dom';
import { MouseTrackerService } from '../../../dom/mouse-tracker/mouse-tracker.service';

const minWidth = 150;

@Component({
  selector: 'ui-side-panel',
  imports: [
    IconComponent
  ],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.resizable]': 'resizable()',
    '[class.hidden]': 'hidden()',
    '[style.--side-panel-width]': '`${sidePanelWidth()}px`'
  }
})
export class SidePanelComponent {
  readonly resizable = input(true);

  readonly hidden = input(false);

  protected readonly sidePanelWidth = signal(300);

  protected readonly sidePanelOrigin = signal(this.sidePanelWidth());

  private readonly mouseTrackerService = inject(MouseTrackerService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly onMouseDown = (event: MouseEvent) => {
    if (!this.resizable()) {
      return;
    }

    this.sidePanelOrigin.set(this.sidePanelWidth());

    this.mouseTrackerService
      .mouseDown(event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: state => this.sidePanelWidth.set(this.calculateWidth(state)) });
  };

  private readonly calculateWidth = (state: MouseMovement): number => {
    const width = this.sidePanelOrigin() + state.dx;

    if (width < minWidth) {
      return minWidth;
    }

    const maxWidth = this.elementRef.nativeElement.offsetWidth - minWidth;

    if (width > maxWidth) {
      return maxWidth;
    }

    return width;
  };
}
