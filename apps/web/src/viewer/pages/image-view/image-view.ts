import { Dialog } from '@angular/cdk/dialog';
import { AsyncPipe, DecimalPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ActionButtonComponent,
  ConfirmationDialogComponent,
  IconComponent,
  InfoOverlayComponent,
  OverlayService,
  SliderComponent,
  TextComponent,
  ToolMenuComponent
} from '@light-matter/ui';
import { ExifTags, ImageHistogram } from 'internal-api';
import { catchError, distinctUntilChanged, filter, from, fromEvent, map, of, startWith, switchMap, take, tap } from 'rxjs';
import { ExifService } from '../../../ipc/exif';
import { HistogramService } from '../../../ipc/histogram';
import { ProcessManager } from '../../../ipc/process-manager';
import { VerticalDivider } from '../../../system/components/vertical-divider/vertical-divider';
import { DefaultPipe } from '../../../system/pipes/default/default.pipe';
import { FileNamePipe } from '../../pipes/file-name/file-name-pipe';
import { Configuration } from '../../../system/services/configuration/configuration';
import { Keyboard } from '../../../system/services/keyboard/keyboard';
import { ExifInfoComponent } from '../../components/exif-info/exif-info.component';
import { ImageRendererComponent } from '../../components/image-renderer/image-renderer.component';
import { imageDynamicRange } from '../../utils/image-dynamic-range';
import { ImagePositioningService } from '../../services/image-positioning/image-positioning.service';
import {
  defaultImagePositioningResult,
  ImageDimensions
} from '../../services/image-positioning/image-positioning.types';
import { ViewNavigator } from '../../services/view-navigator/view-navigator';
import { AnimationState } from './image-view.types';

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
    DefaultPipe,
    FileNamePipe,
    SliderComponent,
    ReactiveFormsModule,
    DecimalPipe,
    InfoOverlayComponent,
    ExifInfoComponent
  ],
  templateUrl: './image-view.html',
  styleUrl: './image-view.scss',
  host: { '[class.decoding]': 'isDecoding()' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageView {
  /* DI */
  protected readonly viewNavigator = inject(ViewNavigator);

  private readonly keyboard = inject(Keyboard);

  private readonly document = inject(DOCUMENT);

  private readonly exif = inject(ExifService);

  private readonly histogram = inject(HistogramService);

  private readonly processManager = inject(ProcessManager);

  private appTitleSuffix = '';

  private readonly imagePositioningService = inject(ImagePositioningService);

  private readonly overlayService = inject(OverlayService);

  private readonly dialog = inject(Dialog);

  private readonly configuration = inject(Configuration);

  /* State */
  protected readonly selectedImage$ = this.viewNavigator.selectedImage();

  protected readonly hasPrevious$ = this.viewNavigator.hasPrevious();

  protected readonly hasNext$ = this.viewNavigator.hasNext();

  protected readonly imagePosition$ = this.viewNavigator.imagePosition();

  protected readonly imageLocation$ = this.imagePositioningService.imageLocation();

  protected readonly defaultImageLocation = defaultImagePositioningResult();

  protected readonly imageDimensions = signal<ImageDimensions>({ width: 0, height: 0 });

  protected readonly pixelColor = signal<{ r: number; g: number; b: number } | null>(null);

  protected readonly pixelDebug = signal('waiting for mouse movement');

  protected readonly isDecoding = signal(false);

  protected readonly decodeDuration = signal<number | null>(null);

  protected readonly imageLoadFailed = signal(false);

  protected readonly comparisonMode = signal<'hdr' | 'sdr' | 'side-by-side' | 'stacked' | 'dual-side-by-side' | 'dual-stacked'>('hdr');

  protected readonly comparisonSplit = signal(50);

  protected readonly imageBitDepth = signal<string | null>(null);

  protected readonly imageTags = signal<ExifTags | null>(null);

  protected readonly histogramVisible = signal(false);

  protected readonly histogramLoading = signal(false);

  protected readonly histogramData = signal<ImageHistogram | null>(null);

  protected readonly histogramHoverStatus = signal<string | null>(null);

  protected readonly histogramError = signal(false);

  protected readonly histogramErrorMessage = signal('Histogram could not be calculated.');

  private histogramRequestId = 0;

  protected readonly histogramPaths = computed(() => {
    const data = this.histogramData();
    if (data === null) {
      return {
        linear: { white: '', red: '', green: '', blue: '', maximumCount: 1 },
        logarithmic: { white: '', red: '', green: '', blue: '', maximumCount: 1 },
        linearBoundary: 256,
        logarithmicBoundary: 256,
        linearYTicks: [],
        logarithmicYTicks: []
      };
    }

    const makePaths = (curves: typeof data.linear) => {
      const maximumCount = Math.max(1, ...curves.white, ...curves.red, ...curves.green, ...curves.blue);
      const makePath = (bins: number[]) => bins.map((count, index) => {
        const x = (index + 0.5) / bins.length * 256;
        // Logarithmic Y scale reveals low-frequency bins without changing counts.
        const y = 148 - Math.log1p(count) / Math.log1p(maximumCount) * 140;
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(' ');
      return {
        white: makePath(curves.white),
        red: makePath(curves.red),
        green: makePath(curves.green),
        blue: makePath(curves.blue),
        maximumCount
      };
    };

    const linearBoundary = Math.max(0, Math.min(256, 100 / data.maximumNits * 256));
    const logarithmicBoundary = Math.max(0, Math.min(256,
      Math.log(100 / data.minimumLogNits) /
      Math.log(data.maximumNits / data.minimumLogNits) * 256
    ));

    const linearPaths = makePaths(data.linear);
    const logarithmicPaths = makePaths(data.logarithmic);

    return {
      linear: linearPaths,
      logarithmic: logarithmicPaths,
      linearBoundary,
      logarithmicBoundary,
      linearYTicks: this.makeLogarithmicYTicks(linearPaths.maximumCount),
      logarithmicYTicks: this.makeLogarithmicYTicks(logarithmicPaths.maximumCount)
    };
  });

  private makeLogarithmicYTicks(maximumCount: number): Array<{ value: number; y: number }> {
    const maximumExponent = Math.floor(Math.log10(Math.max(1, maximumCount)));
    const ticks: Array<{ value: number; y: number }> = [];
    for (let exponent = 0; exponent <= maximumExponent; exponent++) {
      const value = Math.pow(10, exponent);
      if (value <= maximumCount) {
        ticks.push({
          value,
          y: 148 - Math.log1p(value) / Math.log1p(Math.max(1, maximumCount)) * 140
        });
      }
    }
    return ticks;
  }

  protected readonly onHistogramMouseMove = (event: MouseEvent) => {
    const data = this.histogramData();
    const svg = event.currentTarget as SVGSVGElement | null;
    const bounds = svg?.getBoundingClientRect();

    if (data === null || bounds === undefined || bounds.width === 0) {
      return;
    }

    const isLogarithmic = svg?.dataset['scale'] === 'logarithmic';
    const position = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const bin = Math.min(127, Math.floor(position * 128));
    const nits = isLogarithmic
      ? data.minimumLogNits * Math.pow(data.maximumNits / data.minimumLogNits, (bin + 0.5) / 128)
      : data.maximumNits * (bin + 0.5) / 128;
    const curves = isLogarithmic ? data.logarithmic : data.linear;
    const formatCount = (value: number) => new Intl.NumberFormat().format(value);
    const formatNits = (value: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value);
    const scaleName = isLogarithmic ? 'Log' : 'Linear';

    this.histogramHoverStatus.set(
      `${scaleName} ≈ ${formatNits(nits)} cd/m² · White ${formatCount(curves.white[bin] ?? 0)} · R ${formatCount(curves.red[bin] ?? 0)} · G ${formatCount(curves.green[bin] ?? 0)} · B ${formatCount(curves.blue[bin] ?? 0)}`
    );
  };

  protected readonly onHistogramMouseLeave = () => this.histogramHoverStatus.set(null);

  protected readonly imageDynamicRange = imageDynamicRange;

  protected readonly exifVisible = signal(false);

  protected readonly exifState = signal<false | ExifTags>(false);

  protected readonly animationState = signal<AnimationState>('none');

  protected readonly zoomSlider = new FormControl(100, { nonNullable: true });

  protected readonly isFullScreen = toSignal(
    fromEvent(this.document, 'fullscreenchange')
      .pipe(
        takeUntilDestroyed(),
        map(() => this.document.fullscreenElement !== null),
        startWith(this.document.fullscreenElement !== null)
      )
  );

  protected readonly zoomConfig = this.configuration.constants().imageZoom;

  /* Constructor */
  constructor() {
    this.processManager.getAppVersion()
      .then(version => {
        this.appTitleSuffix = version;
        this.selectedImage$.pipe(take(1)).subscribe(image => {
          this.processManager.setWindowTitle(this.makeWindowTitle(image?.path)).catch(() => undefined);
        });
      })
      .catch(() => undefined);

    this.configuration.config()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(config => {
        this.histogramVisible.set(config.system.histogramVisible === true);
        this.comparisonMode.set(config.system.comparisonMode ?? 'hdr');
        this.comparisonSplit.set(config.system.comparisonSplit ?? 50);
        this.exifVisible.set(config.system.exifVisible === true);
        if (this.exifVisible()) {
          this.exifState.set(this.imageTags() ?? false);
        }
        if (this.histogramVisible()) {
          this.selectedImage$
            .pipe(take(1), filter(image => image !== null))
            .subscribe(image => this.loadHistogram(image.path));
        }
      });

    this.selectedImage$
      .pipe(takeUntilDestroyed())
      .subscribe(image => {
        this.processManager.setWindowTitle(this.makeWindowTitle(image?.path)).catch(() => undefined);
      });

    this.trackKeyboard();

    this.selectedImage$
      .pipe(
        filter(image => image !== null),
        map(image => image.path),
        distinctUntilChanged(),
        tap(() => {
          this.imageBitDepth.set(null);
          this.imageTags.set(null);
          this.pixelColor.set(null);
        }),
        tap(path => {
          if (this.histogramVisible()) {
            this.loadHistogram(path);
          }
        }),
        switchMap(path => from(this.exif.read(path)).pipe(
          map(response => response.success ? response.data : null),
          catchError(() => of(null))
        )),
        takeUntilDestroyed()
      )
      .subscribe(tags => {
        this.imageTags.set(tags);
        this.imageBitDepth.set(tags === null ? null : this.getBitDepth(tags));
        if (this.exifVisible()) {
          this.exifState.set(tags ?? false);
        }
      });

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

  protected readonly setComparisonMode = (mode: 'hdr' | 'sdr' | 'side-by-side' | 'stacked' | 'dual-side-by-side' | 'dual-stacked') => {
    this.comparisonMode.set(mode);
    this.configuration.updateSystemConfig({ comparisonMode: mode });
  };

  protected readonly cycleComparisonMode = () => {
    this.selectedImage$
      .pipe(take(1), filter(image => image !== null))
      .subscribe(image => {
        if (imageDynamicRange(image.path, this.imageTags(), this.imageBitDepth()) !== 'HDR') {
          this.setComparisonMode('sdr');
          return;
        }

        const modes = ['hdr', 'sdr', 'side-by-side', 'stacked', 'dual-side-by-side', 'dual-stacked'] as const;
        const currentIndex = modes.indexOf(this.comparisonMode());
        this.setComparisonMode(modes[(currentIndex + 1) % modes.length]);
      });
  };

  protected readonly previewComparisonSplit = (value: string | number) => {
    this.comparisonSplit.set(Math.max(1, Math.min(99, Number(value) || 50)));
  };

  protected readonly setComparisonSplit = (value: string | number) => {
    const split = Math.max(1, Math.min(99, Number(value) || 50));
    this.comparisonSplit.set(split);
    this.configuration.updateSystemConfig({ comparisonSplit: split });
  };

  protected readonly toggleHistogram = () => {
    if (this.histogramVisible()) {
      this.histogramVisible.set(false);
      this.configuration.updateSystemConfig({ histogramVisible: false });
      this.histogramRequestId++;
      this.histogramLoading.set(false);
      return;
    }

    this.histogramVisible.set(true);
    this.configuration.updateSystemConfig({ histogramVisible: true });
    this.selectedImage$
      .pipe(take(1), filter(image => image !== null))
      .subscribe(image => this.loadHistogram(image.path));
  };

  protected readonly closeHistogram = () => {
    this.histogramVisible.set(false);
    this.configuration.updateSystemConfig({ histogramVisible: false });
    this.histogramRequestId++;
    this.histogramLoading.set(false);
  };

  protected readonly goBack = () => {
    this.processManager.setWindowTitle(this.makeWindowTitle()).catch(() => undefined);
    if (this.viewNavigator.standalone()) {
      this.processManager.quit(0).then();
    } else {
      this.overlayService.hide();
    }
  };

  protected readonly fitToWindow = () => this.imagePositioningService.setZoom('fit');

  protected readonly adjustZoom = (direction: 1 | -1) => {
    this.imageLocation$
      .pipe(take(1))
      .subscribe(location => {
        const currentZoom = location.zoom === 'fit' ? location.fitZoom : this.zoomSlider.value;
        const zoomStep = Math.min(
          Math.max(
            this.zoomConfig.scroll.minStep,
            Math.round(currentZoom * this.zoomConfig.scroll.coefficient)
          ),
          this.zoomConfig.scroll.maxStep
        );
        const nextZoom = this.calculateWheelZoom(direction > 0 ? -1 : 1, currentZoom, zoomStep);
        this.zoomSlider.setValue(Math.max(this.zoomConfig.min, Math.min(this.zoomConfig.max, nextZoom)));
      });
  };

  protected readonly toggleExifInfo = (path: string) => {
    const exifVisible = !this.exifVisible();
    this.exifVisible.set(exifVisible);
    this.configuration.updateSystemConfig({ exifVisible });
    this.exifState.set(exifVisible ? this.imageTags() ?? false : false);
  };

  protected readonly prevPhoto = () => this.viewNavigator.previous();

  protected readonly nextPhoto = () => this.viewNavigator.next();

  protected readonly deletePhoto = () => {
    this.selectedImage$
      .pipe(take(1), filter(image => image !== null))
      .subscribe(image =>
        ConfirmationDialogComponent
          .open(this.dialog, {
            title: 'Bild löschen?',
            description: `Möchtest du „${image.path}“ dauerhaft von der Festplatte löschen?`
          })
          .subscribe(async () => {
            const deleted = await this.viewNavigator.deleteImage(image.path);

            if (!deleted) {
              this.document.defaultView?.alert('Das Bild konnte nicht gelöscht werden.');
            }
          })
      );
  };

  protected readonly onAnimationEnd = (event: AnimationEvent) => {
    const split = event.animationName.split('animation-');

    if (split.length < 2) {
      return;
    }

    const name = split[1];

    switch (name) {
      case 'leave-left':
        this.viewNavigator.previous();
        this.animationState.set('enter-left');
        break;
      case 'enter-left':
        this.animationState.set('none');
        break;
      case 'leave-right':
        this.viewNavigator.next();
        this.animationState.set('enter-right');
        break;
      case 'enter-right':
        this.animationState.set('none');
        break;
      default:
        this.animationState.set('none');
        break;
    }
  };

  protected readonly onMouseWheel = (event: WheelEvent) => {
    event.preventDefault();

    this.imageLocation$
      .pipe(take(1))
      .subscribe(location => {
        const currentZoom = location.zoom === 'fit' ? location.fitZoom : this.zoomSlider.value;

        const zoomStep = Math.min(
          Math.max(
            this.zoomConfig.scroll.minStep,
            Math.round(currentZoom * this.zoomConfig.scroll.coefficient)
          ),
          this.zoomConfig.scroll.maxStep
        );

        this.zoomSlider.setValue(this.calculateWheelZoom(event.deltaY, currentZoom, zoomStep));
      });
  };

  /* Misc */
  private readonly makeWindowTitle = (imagePath?: string): string => {
    const version = this.appTitleSuffix ? ` ${this.appTitleSuffix}` : '';
    const path = imagePath ? ` - ${imagePath}` : '';
    return `Light Matter${version}${path}`;
  };

  private readonly calculateWheelZoom = (deltaY: number, currentZoom: number, zoomStep: number): number => {
    if (deltaY < 0) {
      return Math.min(currentZoom + zoomStep, this.zoomConfig.max);
    }

    if (deltaY > 0) {
      return Math.max(currentZoom - zoomStep, this.zoomConfig.min);
    }

    return currentZoom;
  };

  private readonly getBitDepth = (tags: ExifTags): string | null => {
    const bits = tags.BitsPerSample ?? tags.BitDepth;
    if (bits !== undefined) {
      return `${bits}-bit`;
    }

    return tags.ImagePixelDepth ?? null;
  };

  private readonly loadHistogram = (path: string) => {
    const requestId = ++this.histogramRequestId;
    this.histogramData.set(null);
    this.histogramError.set(false);
    this.histogramErrorMessage.set('Histogram could not be calculated.');
    this.histogramLoading.set(true);

    this.histogram.calculate(path)
      .then(result => {
        if (requestId !== this.histogramRequestId) {
          return;
        }

        if (result.success) {
          this.histogramData.set(result.data);
        } else {
          this.histogramErrorMessage.set(result.errorMessage);
          this.histogramError.set(true);
        }
      })
      .catch(error => {
        if (requestId === this.histogramRequestId) {
          this.histogramErrorMessage.set(error instanceof Error ? error.message : String(error));
          this.histogramError.set(true);
        }
      })
      .finally(() => {
        if (requestId === this.histogramRequestId) {
          this.histogramLoading.set(false);
        }
      });
  };

  private readonly trackKeyboard = () =>
    this.keyboard.keyup()
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        if ((event.shiftKey && event.key !== '+' && event.key !== '_') || event.ctrlKey || event.altKey || event.metaKey) {
          return;
        }

        if (event.key === 'Escape') {
          this.goBack();
          return;
        }

        const target = event.target;
        if (target instanceof HTMLElement && target.matches('input, textarea, [contenteditable="true"]')) {
          return;
        }

        if (event.key === '+' || event.key === '=' || event.key === 'Add') {
          event.preventDefault();
          this.adjustZoom(1);
          return;
        }

        if (event.key === '-' || event.key === '_' || event.key === 'Subtract') {
          event.preventDefault();
          this.adjustZoom(-1);
          return;
        }

        if (event.key === 'r' || event.key === 'R') {
          this.cycleComparisonMode();
          return;
        }

        if (target instanceof HTMLSelectElement) {
          return;
        }

        switch (event.key) {
          case 'i':
          case 'I':
            this.selectedImage$
              .pipe(take(1), filter(image => image !== null))
              .subscribe(image => this.toggleExifInfo(image.path));
            break;

          case 'h':
          case 'H':
            this.toggleHistogram();
            break;

          case 'ArrowLeft':
            this.hasPrevious$
              .pipe(
                take(1),
                filter(flag => flag)
              )
              .subscribe(() => this.prevPhoto());
            break;

          case 'ArrowRight':
            this.hasNext$
              .pipe(
                take(1),
                filter(flag => flag)
              )
              .subscribe(() => this.nextPhoto());
            break;

          case 'Delete':
            event.preventDefault();
            this.deletePhoto();
            break;

          case 'f':
          case 'F':
          case 'F11':
            this.toggleFullScreen().then();
            break;
        }
      });
}
