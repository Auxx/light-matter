import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { TextComponent } from '@light-matter/ui';
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
    MatIcon,
    TextComponent
  ],
  templateUrl: './location-listing.component.html',
  styleUrl: './location-listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationListingComponent {
  readonly locations = input.required<string[]>();

  readonly selectedLocation = input<string | null>('');

  readonly locationClicked = output<string>();

  private readonly dialogs = inject(Dialogs);

  private readonly galleryLocations = inject(GalleryLocations);

  readonly onAddLocation = async () => {
    const result = await this.dialogs.openFolder();

    if (result.success) {
      this.galleryLocations.addLocation(result.data);
    }
  };
}
