import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { OverlayComponent, OverlayService } from '@light-matter/ui';
import { supportedFileExtensions } from 'internal-api';
import { firstValueFrom } from 'rxjs';
import { GalleryLocations } from '../gallery/services/gallery-locations/gallery-locations';
import { GalleryState } from '../gallery/services/gallery-state/gallery-state';
import { FileSystem } from '../ipc/file-system';
import { ProcessManager } from '../ipc/process-manager';
import { ThemeService } from '../system/services/theme/theme.service';
import { ImageView } from '../viewer/pages/image-view/image-view';
import { ViewNavigator } from '../viewer/services/view-navigator/view-navigator';

@Component({
  imports: [ RouterModule, OverlayComponent ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '(dragover)': 'onDragOver($event)',
    '(drop)': 'onDrop($event)'
  }
})
export class App {
  private readonly title = inject(Title);

  private readonly processManager = inject(ProcessManager);

  private readonly fileSystem = inject(FileSystem);

  private readonly galleryLocations = inject(GalleryLocations);

  private readonly galleryState = inject(GalleryState);

  private readonly viewNavigator = inject(ViewNavigator);

  private readonly overlayService = inject(OverlayService);

  private readonly themeService = inject(ThemeService);

  constructor() {
    this.setAppTitle().then();
  }

  setAppTitle = async () =>
    this.title.setTitle(`Light Matter v${await this.processManager.getAppVersion()}`);

  protected readonly onDragOver = (event: DragEvent) => {
    if (event.dataTransfer?.types.includes('Files')) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  protected readonly onDrop = async (event: DragEvent) => {
    if (!event.dataTransfer?.files.length) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const file = Array.from(event.dataTransfer.files).find(droppedFile => {
      const path = window.desktop.getPathForFile(droppedFile);
      const name = path.split(/[\\/]/).pop() ?? '';
      const extension = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
      return extension !== name && supportedFileExtensions.includes(extension);
    });

    if (!file) {
      return;
    }

    const path = window.desktop.getPathForFile(file);
    const directory = await this.fileSystem.dirname(path);
    const navigation = this.galleryState.navigateTo(directory);
    this.galleryLocations.addLocation(directory);

    await firstValueFrom(navigation);
    const selected = await firstValueFrom(this.viewNavigator.selectImage(path));

    if (selected) {
      this.overlayService.show(ImageView);
    }
  };
}
