import { Dialog } from '@angular/cdk/dialog';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionButtonComponent,
  ConfirmationDialogComponent,
  IconComponent,
  OverlayService,
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
import { ImageView } from '../../../viewer/pages/image-view/image-view';
import { ViewNavigator } from '../../../viewer/services/view-navigator/view-navigator';

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
  /* DI */
  private readonly galleryState = inject(GalleryState);

  private readonly dialogs = inject(Dialogs);

  private readonly dialog = inject(Dialog);

  private readonly galleryLocations = inject(GalleryLocations);

  readonly router = inject(Router);

  readonly viewNavigator = inject(ViewNavigator);

  readonly overlayService = inject(OverlayService);

  protected readonly tree = viewChild.required(TreeComponent);

  /* State */
  readonly galleryRoot$ = this.galleryState.galleryRoot();

  readonly selectedLocation$ = this.galleryState.selectedLocation();

  readonly images$ = this.galleryState.images();

  /* Event handlers */
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

  protected readonly selectLocation = (node: TreeNode<string>) => this.galleryState.navigateTo(node.id);

  protected readonly onImageSelected = (file: FileInfo) => {
    this.viewNavigator
      .selectImage(file.path)
      .subscribe(success => {
        console.log('onImageSelected -> selectImage', success);
        this.overlayService.show(ImageView);
      });

    // this.images$
    //   .pipe(take(1))
    //   .subscribe(images => {
    //     this.viewNavigator.setFiles(images.map(image => image.path), file.path);
    //     this.router.navigate([ '/view' ]).then();
    //   });
  };
}
