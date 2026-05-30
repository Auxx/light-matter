import { Dialog } from '@angular/cdk/dialog';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import {
  ActionButtonComponent,
  ConfirmationDialogComponent,
  IconComponent,
  PopupMenuComponent,
  TextComponent
} from '@light-matter/ui';
import { LocationNamePipe } from '../../../ui/pipes/location-name/location-name.pipe';
import { GalleryLocations } from '../../services/gallery-locations/gallery-locations';
import { LocationElementComponent } from '../location-element/location-element.component';

@Component({
  selector: 'app-location-section',
  imports: [
    LocationElementComponent,
    LocationNamePipe,
    TextComponent,
    ActionButtonComponent,
    IconComponent,
    CdkMenuItem,
    CdkMenu,
    PopupMenuComponent
  ],
  templateUrl: './location-section.component.html',
  styleUrl: './location-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSectionComponent {
  readonly locations = input.required<string[]>();

  readonly selectedLocation = input<string | null>('');

  readonly clicked = output<string>();

  private readonly galleryLocations = inject(GalleryLocations);

  private readonly dialog = inject(Dialog);

  readonly onRemoveLocation = (data: string) =>
    ConfirmationDialogComponent
      .open(
        this.dialog,
        {
          title: 'Confirm location removal',
          description: `Are you sure you want to remove "${data}" from gallery locations?`
        }
      )
      .subscribe(() => this.galleryLocations.removeLocation(data));
}
