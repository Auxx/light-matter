import { Dialog } from '@angular/cdk/dialog';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  ActionButtonComponent,
  ConfirmationDialogComponent,
  IconComponent,
  PopupMenuComponent,
  TextComponent,
  TreeComponent,
  TreeNode
} from '@light-matter/ui';
import { Dialogs } from '../../../ipc/dialogs';
import { LocationNamePipe } from '../../../ui/pipes/location-name/location-name.pipe';
import { GalleryLocations } from '../../services/gallery-locations/gallery-locations';

@Component({
  selector: 'app-location-listing',
  imports: [
    TextComponent,
    ActionButtonComponent,
    IconComponent,
    CdkMenuItem,
    CdkMenu,
    PopupMenuComponent,
    TreeComponent
  ],
  templateUrl: './location-listing.component.html',
  styleUrl: './location-listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationListingComponent {
  private readonly dialogs = inject(Dialogs);

  private readonly dialog = inject(Dialog);

  private readonly galleryLocations = inject(GalleryLocations);

  // TODO Move logic into service maybe
  private readonly locationNamePipe = new LocationNamePipe();

  readonly locations = input.required<string[]>();

  readonly selectedLocation = input<string | null>('');

  readonly locationClicked = output<string>();

  protected readonly root = computed(() => {
    const result: TreeNode<string> = {
      id: '',
      label: 'My PC',
      openIcon: 'desktop',
      closedIcon: 'desktop',
      isOpen: true,
      children: this.locations().map(location => ({
        id: location,
        label: this.locationNamePipe.transform(location),
        openIcon: 'folderOpen',
        closedIcon: 'folder'
      }))
    };

    return result;
  });

  readonly onAddLocation = async () => {
    const result = await this.dialogs.openFolder();

    if (result.success) {
      this.galleryLocations.addLocation(result.data);
    }
  };

  readonly onRemoveLocation = async (data: TreeNode<string>) =>
    ConfirmationDialogComponent
      .open(
        this.dialog,
        {
          title: 'Confirm location removal',
          description: `Are you sure you want to remove "${data.id}" from gallery locations?`
        }
      )
      .subscribe(() => this.galleryLocations.removeLocation(data.id));
}
