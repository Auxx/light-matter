import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { Dialogs } from '../../../ipc/dialogs';
import { GalleryLocations } from '../../services/gallery-locations/gallery-locations';
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

  private readonly dialogs = inject(Dialogs);

  private readonly galleryLocations = inject(GalleryLocations);

  readonly onAddLocation = async () => {
    const result = await this.dialogs.openFolder();

    if (result.success) {
      this.galleryLocations.addLocation(result.data);
    }
  };
}
