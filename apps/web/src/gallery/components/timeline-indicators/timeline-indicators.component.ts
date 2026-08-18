import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { YearGroup } from '../images/images.component.types';

@Component({
  selector: 'app-timeline-indicators',
  imports: [ SlicePipe ],
  templateUrl: './timeline-indicators.component.html',
  styleUrl: './timeline-indicators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineIndicatorsComponent {
  readonly groups = input.required<YearGroup[]>();
  readonly activeSectionId = input<string | null>(null);
  readonly sectionSelect = output<string>();

  onSectionClick(sectionId: string): void {
    this.sectionSelect.emit(sectionId);
  }
}
