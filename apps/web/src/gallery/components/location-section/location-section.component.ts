import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem } from '@angular/material/menu';
import { LocationNamePipe } from '../../../ui/pipes/location-name/location-name.pipe';
import { LocationElementComponent } from '../location-element/location-element.component';

@Component({
  selector: 'app-location-section',
  imports: [
    LocationElementComponent,
    LocationNamePipe,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuContent
  ],
  templateUrl: './location-section.component.html',
  styleUrl: './location-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSectionComponent {
  readonly locations = input.required<string[]>();

  readonly onRemoveLocation = (data: string) => {
    // TODO Add confirmation dialog
    console.log('onRemoveLocation', data);
  };
}
