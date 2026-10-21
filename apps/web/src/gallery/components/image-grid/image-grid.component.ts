import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { DatePipe, DecimalPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, fromEvent, map } from 'rxjs';
import {
  ActionButtonComponent,
  IconComponent,
  PopupMenuComponent,
  SliderComponent,
  StopPropagation,
  TextComponent,
  TitleComponent,
  ToolbarComponent
} from '@light-matter/ui';
import { ExifTags } from 'internal-api';
import {
  allSortDirections,
  allSortTypes,
  defaultThumbnailSize,
  FileInfo,
  SortDirection,
  SortType,
  ThumbnailSize
} from 'internal-api';
import { ImagesComponent } from '../images/images.component';
import { ExifService } from '../../../ipc/exif';
import { imageDynamicRange } from '../../../viewer/utils/image-dynamic-range';
import { ThemeService } from '../../../system/services/theme/theme.service';

@Component({
  selector: 'app-image-grid',
  imports: [
    ImagesComponent,
    DatePipe,
    DecimalPipe,
    ToolbarComponent,
    TitleComponent,
    ActionButtonComponent,
    IconComponent,
    StopPropagation,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    PopupMenuComponent,
    TextComponent,
    SliderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGridComponent {
  /* Inputs */
  readonly images = input.required<FileInfo[] | null>();

  readonly selectedLocation = input.required<string | null>();

  readonly sortBy = input<SortType>(allSortTypes[0]);

  readonly sortDirection = input<SortDirection>(allSortDirections[0]);

  readonly thumbSize = input<ThumbnailSize>(defaultThumbnailSize);

  /* Outputs */
  readonly selected = output<FileInfo>();

  readonly sortByChanged = output<SortType>();

  readonly sortDirChanged = output<SortDirection>();

  readonly thumbSizeChanged = output<ThumbnailSize>();

  readonly hoveredImage = signal<FileInfo | null>(null);

  readonly hoveredTags = signal<ExifTags | null>(null);

  protected readonly imageDynamicRange = imageDynamicRange;

  private readonly exif = inject(ExifService);

  private readonly document = inject(DOCUMENT);

  protected readonly theme = inject(ThemeService);

  private readonly destroyRef = inject(DestroyRef);

  protected readonly thumbSizeSlider = new FormControl(0, { nonNullable: true });

  private readonly thumbnailSliderMax = 8;

  private readonly thumbnailSliderSizes: ThumbnailSize[] = [
    'small', 'smallPlus', 'smallMedium', 'smallMediumPlus', 'medium', 'mediumPlus', 'mediumLarge', 'mediumLargePlus', 'large'
  ];

  private hoverClearTimer: ReturnType<typeof setTimeout> | null = null;

  /* State */
  private readonly scrollBox = viewChild<ElementRef<HTMLDivElement>>('scrollBox');

  readonly onThumbnailHovered = async (image: FileInfo | null) => {
    if (image === null) {
      if (this.hoverClearTimer !== null) {
        clearTimeout(this.hoverClearTimer);
      }

      this.hoverClearTimer = setTimeout(() => {
        this.hoverClearTimer = null;
        this.hoveredImage.set(null);
        this.hoveredTags.set(null);
      }, 120);
      return;
    }

    if (this.hoverClearTimer !== null) {
      clearTimeout(this.hoverClearTimer);
      this.hoverClearTimer = null;
    }

    if (this.hoveredImage()?.path === image.path) {
      return;
    }

    this.hoveredImage.set(image);
    this.hoveredTags.set(null);

    const currentPath = image.path;
    const result = await this.exif.read(currentPath);

    if (this.hoveredImage()?.path === currentPath && result.success) {
      this.hoveredTags.set(result.data);
    }
  };

  protected readonly adjustThumbnailSize = (direction: -1 | 1) => {
    const next = Math.max(0, Math.min(this.thumbnailSliderMax, this.thumbSizeSlider.value + direction));
    this.thumbSizeSlider.setValue(next);
  };

  /* Constructor */
  constructor() {
    fromEvent<KeyboardEvent>(this.document, 'keyup')
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        if (event.ctrlKey || event.altKey || event.metaKey) return;
        const target = event.target;
        if (target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')) return;
        if (event.key === '+' || event.key === '=' || event.key === 'Add') {
          event.preventDefault();
          this.adjustThumbnailSize(1);
        } else if (event.key === '-' || event.key === '_' || event.key === 'Subtract') {
          event.preventDefault();
          this.adjustThumbnailSize(-1);
        }
      });

    this.thumbSizeSlider.valueChanges
      .pipe(
        map(value => Math.max(0, Math.min(this.thumbnailSliderMax, Math.round(value)))),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(index => {
        if (this.thumbSizeSlider.value !== index) {
          this.thumbSizeSlider.setValue(index, { emitEvent: false });
        }

        this.thumbSizeChanged.emit(this.thumbnailSliderSizes[index]);
      });

    effect(() => {
      const index = this.thumbnailSliderSizes.indexOf(this.thumbSize());
      if (index >= 0 && this.thumbSizeSlider.value !== index) {
        this.thumbSizeSlider.setValue(index, { emitEvent: false });
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.hoverClearTimer !== null) {
        clearTimeout(this.hoverClearTimer);
      }
    });

    effect(() => {
      this.selectedLocation();
      const scrollBox = this.scrollBox();

      if (scrollBox === undefined) {
        return;
      }

      scrollBox.nativeElement.scrollTo(0, 0);
    });
  }
}
