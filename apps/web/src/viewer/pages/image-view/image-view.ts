import { AsyncPipe, DecimalPipe, DOCUMENT, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ActionButtonComponent,
  IconComponent,
  SliderComponent,
  TextComponent,
  ToolMenuComponent
} from '@light-matter/ui';
import { fromEvent, map, noop, startWith, tap } from 'rxjs';
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
    JsonPipe,
    ActionButtonComponent,
    IconComponent,
    RouterLink,
    VerticalDivider,
    TextComponent,
    FileNamePipe,
    DefaultPipe,
    SliderComponent,
    ReactiveFormsModule,
    DecimalPipe
  ],
  templateUrl: './image-view.html',
  styleUrl: './image-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageView {
  protected readonly viewNavigator = inject(ViewNavigator);

  private readonly router = inject(Router);

  private readonly keyboard = inject(Keyboard);

  private readonly document = inject(DOCUMENT);

  private readonly imagePositioningService = inject(ImagePositioningService);

  readonly state$ = this.viewNavigator.state()
    .pipe(tap(state => !state.isValid ? this.router.navigate([ 'welcome' ]) : noop()));

  protected readonly imageLocation$ = this.imagePositioningService.imageLocation();

  protected readonly defaultImageLocation = defaultImagePositioningResult();

  protected readonly imageDimensions = signal<ImageDimensions>({ width: 0, height: 0 });

  protected readonly zoomSlider = new FormControl(100, { nonNullable: true });

  protected readonly isFullScreen = toSignal(
    fromEvent(this.document, 'fullscreenchange')
      .pipe(
        takeUntilDestroyed(),
        map(() => this.document.fullscreenElement !== null),
        startWith(this.document.fullscreenElement !== null)
      )
  );

  constructor() {
    this.trackKeyboard();

    this.zoomSlider
      .valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.imagePositioningService.setZoom(value / 100));
  }

  readonly toggleFullScreen = async () => {
    if (this.document.fullscreenElement !== null) {
      await this.document.exitFullscreen();
    } else {
      await this.document.documentElement.requestFullscreen();
    }
  };

  readonly fitToWindow = () => this.imagePositioningService.setZoom('fit');

  private readonly trackKeyboard = () => {
    this.keyboard.keyup()
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
          return;
        }

        switch (event.key) {
          case 'ArrowLeft':
            this.viewNavigator.prev();
            break;

          case 'ArrowRight':
            this.viewNavigator.next();
            break;

          case 'f':
          case 'F':
          case 'F11':
            this.toggleFullScreen().then();
            break;
        }
      });
  };
}
