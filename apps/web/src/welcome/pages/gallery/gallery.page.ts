import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FileInfo } from 'internal-api';
import { ImageGridComponent } from '../../../gallery/components/image-grid/image-grid.component';
import { LocationListingComponent } from '../../../gallery/components/location-listing/location-listing.component';
import { GalleryState } from '../../../gallery/services/gallery-state/gallery-state';
import { DefaultPipe } from '../../../system/pipes/default/default.pipe';
import { DualPaneComponent } from '../../../ui/components/dual-pane/dual-pane.component';

@Component({
  selector: 'app-gallery',
  imports: [
    AsyncPipe,
    DefaultPipe,
    LocationListingComponent,
    DualPaneComponent,
    ImageGridComponent
  ],
  templateUrl: './gallery.page.html',
  styleUrl: './gallery.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPage {
  private readonly galleryState = inject(GalleryState);

  readonly locations$ = this.galleryState.locations$;

  readonly selectedLocation = this.galleryState.selectedLocation;

  readonly selectedPath = this.galleryState.selectedPath;

  readonly contents = this.galleryState.contents;

  readonly onLocationSelected = (location: string) => this.selectedLocation.set(location);

  readonly onFolderPush = (item: FileInfo) => this.selectedPath.update(path => path.concat(item.path));

  readonly onFolderPop = () => this.selectedPath.update(path => path.toSpliced(-1));
}
