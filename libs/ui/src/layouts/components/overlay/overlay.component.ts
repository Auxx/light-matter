import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OverlayService } from '../../services/overlay/overlay.service';

@Component({
  selector: 'ui-overlay',
  imports: [
    CdkPortalOutlet
  ],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent {
  /* DI */
  protected readonly overlayService = inject(OverlayService);

  /* State */
  protected readonly isVisible = toSignal(this.overlayService.isVisible());

  protected readonly component = toSignal(this.overlayService.component());

  protected readonly portal = computed(() => {
    const component = this.component();

    return component === null || component === undefined
      ? null
      : new ComponentPortal(component);
  });
}
