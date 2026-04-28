import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LocationNamePipe } from '../../../ui/pipes/location-name/location-name.pipe';
import { LocationElementComponent } from '../location-element/location-element.component';

@Component({
  selector: 'app-location-section',
  imports: [
    LocationElementComponent,
    LocationNamePipe
  ],
  templateUrl: './location-section.component.html',
  styleUrl: './location-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSectionComponent {
  readonly locations = input.required<string[]>();
}
