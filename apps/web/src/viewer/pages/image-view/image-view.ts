import { AsyncPipe, DecimalPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ActionButtonComponent,
  IconComponent,
  InfoOverlayComponent,
  OverlayService,
  SliderComponent,
  TextComponent,
  ToolMenuComponent
} from '@light-matter/ui';
import { ExifTags } from 'internal-api';
import { fromEvent, map, startWith } from 'rxjs';
import { ExifService } from '../../../ipc/exif';
import { ProcessManager } from '../../../ipc/process-manager';
import { VerticalDivider } from '../../../system/components/vertical-divider/vertical-divider';
import { DefaultPipe } from '../../../system/pipes/default/default.pipe';
import { Keyboard } from '../../../system/services/keyboard/keyboard';
import { ImageRendererComponent } from '../../components/image-renderer/image-renderer.component';
import { FileNamePipe } from '../../pipes/file-name/file-name-pipe';
import { ImagePositioningService } from '../../services/image-positioning/image-positioning.service';
import {
  defaultImagePositioningResult,
  ImageDimensions
} from '../../services/image-positioning/image-positioning.types';
import { ViewNavigator } from '../../services/view-navigator/view-navigator';

@Component({
  selector: 'app-image-view',
  imports: [
    AsyncPipe,
    ImageRendererComponent,
    ToolMenuComponent,
    ActionButtonComponent,
    IconComponent,
    VerticalDivider,
    TextComponent,
    FileNamePipe,
    DefaultPipe,
    SliderComponent,
    ReactiveFormsModule,
    DecimalPipe,
    InfoOverlayComponent
  ],
  templateUrl: './image-view.html',
  styleUrl: './image-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageView {
  /* DI */
  protected readonly viewNavigator = inject(ViewNavigator);

  private readonly keyboard = inject(Keyboard);

  private readonly document = inject(DOCUMENT);

  private readonly exif = inject(ExifService);

  private readonly processManager = inject(ProcessManager);

  private readonly imagePositioningService = inject(ImagePositioningService);

  private readonly overlayService = inject(OverlayService);

  /* State */
  protected readonly selectedImage$ = this.viewNavigator.selectedImage();

  protected readonly hasPrevious$ = this.viewNavigator.hasPrevious();

  protected readonly hasNext$ = this.viewNavigator.hasNext();

  protected readonly imageLocation$ = this.imagePositioningService.imageLocation();

  protected readonly defaultImageLocation = defaultImagePositioningResult();

  protected readonly imageDimensions = signal<ImageDimensions>({ width: 0, height: 0 });

  protected readonly exifVisible = signal(false);

  protected readonly exifState = signal<false | ExifTags>(false);

  protected readonly zoomSlider = new FormControl(100, { nonNullable: true });

  protected readonly isFullScreen = toSignal(
    fromEvent(this.document, 'fullscreenchange')
      .pipe(
        takeUntilDestroyed(),
        map(() => this.document.fullscreenElement !== null),
        startWith(this.document.fullscreenElement !== null)
      )
  );

  /* Constructor */
  constructor() {
    this.trackKeyboard();

    this.zoomSlider
      .valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.imagePositioningService.setZoom(value / 100));
  }

  /* Event handlers */
  protected readonly toggleFullScreen = async () => {
    if (this.document.fullscreenElement !== null) {
      await this.document.exitFullscreen();
    } else {
      await this.document.documentElement.requestFullscreen();
    }
  };

  protected readonly goBack = () => {
    if (this.viewNavigator.standalone()) {
      this.processManager.quit(0).then();
    } else {
      this.overlayService.hide();
    }
  };

  protected readonly fitToWindow = () => this.imagePositioningService.setZoom('fit');

  protected readonly toggleExifInfo = async (path: string) => {
    this.exifState.set(false);

    const exifVisible = !this.exifVisible();
    this.exifVisible.set(exifVisible);

    if (exifVisible) {
      const response = await this.exif.read(path);

      if (response.success) {
        this.exifState.set(response.data);
      }
    }
  };

  protected readonly prevPhoto = () => {
    this.exifVisible.set(false);
    this.exifState.set(false);
    this.viewNavigator.previous();
  };

  protected readonly nextPhoto = () => {
    this.exifVisible.set(false);
    this.exifState.set(false);
    this.viewNavigator.next();
  };

  /* Misc */
  private readonly trackKeyboard = () =>
    this.keyboard.keyup()
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
          return;
        }

        switch (event.key) {
          case 'ArrowLeft':
            this.prevPhoto();
            break;

          case 'ArrowRight':
            this.nextPhoto();
            break;

          case 'f':
          case 'F':
          case 'F11':
            this.toggleFullScreen().then();
            break;
        }
      });
}
