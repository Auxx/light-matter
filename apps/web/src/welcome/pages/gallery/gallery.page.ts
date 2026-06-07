import { Dialog } from '@angular/cdk/dialog';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import {
  ActionButtonComponent,
  ConfirmationDialogComponent,
  IconComponent,
  PopupMenuComponent,
  SidePanelComponent,
  TextComponent,
  TreeComponent,
  TreeLoadRequest,
  TreeNode
} from '@light-matter/ui';
import { FileInfo } from 'internal-api';
import { ImageGridComponent } from '../../../gallery/components/image-grid/image-grid.component';
import { GalleryLocations } from '../../../gallery/services/gallery-locations/gallery-locations';
import { GalleryState } from '../../../gallery/services/gallery-state/gallery-state';
import { treeNode } from '../../../gallery/services/gallery-state/gallery-state.types';
import { Dialogs } from '../../../ipc/dialogs';

@Component({
  selector: 'app-gallery',
  imports: [
    AsyncPipe,
    ImageGridComponent,
    SidePanelComponent,
    TreeComponent,
    ActionButtonComponent,
    CdkMenu,
    CdkMenuItem,
    IconComponent,
    PopupMenuComponent,
    TextComponent
  ],
  templateUrl: './gallery.page.html',
  styleUrl: './gallery.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPage {
  private readonly galleryState = inject(GalleryState);

  private readonly dialogs = inject(Dialogs);

  private readonly dialog = inject(Dialog);

  private readonly galleryLocations = inject(GalleryLocations);

  protected readonly tree = viewChild.required(TreeComponent);

  readonly galleryRoot$ = this.galleryState.galleryRoot();

  protected readonly onAddLocation = async () => {
    const result = await this.dialogs.openFolder();

    if (result.success) {
      this.galleryLocations.addLocation(result.data);
    }
  };

  protected readonly onRemoveLocation = async (data: TreeNode<string>) =>
    ConfirmationDialogComponent
      .open(
        this.dialog,
        {
          title: 'Confirm location removal',
          description: `Are you sure you want to remove "${data.id}" from gallery locations?`
        }
      )
      .subscribe(() => this.galleryLocations.removeLocation(data.id));

  protected readonly loadTreeNode = async (state: TreeLoadRequest<string>) => {
    const result = await this.galleryState.getDirContents(state.node.id);
    const node = structuredClone(state.node);

    if (result.success) {
      node.children = result.data.map(location => treeNode(location.path, true));
    }

    this.tree().updateNode(node);
  };

  // OLD

  readonly selectedLocation = this.galleryState.selectedLocation;

  readonly selectedPath = this.galleryState.selectedPath;

  readonly contents = this.galleryState.contents;

  readonly onLocationSelected = (location: string) => this.selectedLocation.set(location);

  readonly onFolderPush = (item: FileInfo) => this.selectedPath.update(path => path.concat(item.path));

  readonly onFolderPop = () => this.selectedPath.update(path => path.toSpliced(-1));
}
