import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { LocationElementComponent } from '../location-element/location-element.component';
import { LocationSectionComponent } from '../location-section/location-section.component';

@Component({
  selector: 'app-location-listing',
  imports: [
    LocationSectionComponent,
    LocationElementComponent,
    MatMenu,
    MatMenuItem,
    MatIcon
  ],
  templateUrl: './location-listing.component.html',
  styleUrl: './location-listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationListingComponent {
  readonly locations = input.required<string[]>();

  readonly onAddLocation = () => {
    console.log('onAddLocation');
  };
}
