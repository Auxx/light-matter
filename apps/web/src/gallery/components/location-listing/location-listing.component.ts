import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LocationElementComponent } from '../location-element/location-element.component';
import { LocationSectionComponent } from '../location-section/location-section.component';

@Component({
  selector: 'app-location-listing',
  imports: [
    LocationSectionComponent,
    LocationElementComponent
  ],
  templateUrl: './location-listing.component.html',
  styleUrl: './location-listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationListingComponent {
  readonly locations = input.required<string[]>();
}
