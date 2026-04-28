import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LocationElementComponent } from '../location-element/location-element.component';

@Component({
  selector: 'app-location-section',
  imports: [
    MatIcon,
    LocationElementComponent
  ],
  templateUrl: './location-section.component.html',
  styleUrl: './location-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSectionComponent {
}
