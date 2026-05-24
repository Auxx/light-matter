import { inject, Injectable } from '@angular/core';
import { MouseTrackerService } from '@light-matter/ui';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  pipe,
  startWith,
  switchMap,
  take
} from 'rxjs';
import { DevicePixelRatioService } from '../../../system/services/device-pixel-ratio/device-pixel-ratio.service';
import {
  defaultImagePositioningResult,
  defaultImageZoom,
  ImageDimensions,
  ImageOffset,
  ImagePositioningResult,
  ImageZoom
} from './image-positioning.types';

@Injectable({ providedIn: 'root' })
export class ImagePositioningService {
  private readonly devicePixelRatioService = inject(DevicePixelRatioService);

  private readonly mouseTrackerService = inject(MouseTrackerService);

  private readonly imageDimensions$ = new BehaviorSubject<ImageDimensions>({ width: 0, height: 0 });

  private readonly viewport$ = new BehaviorSubject<HTMLElement | null>(null);

  private readonly zoom$ = new BehaviorSubject<ImageZoom>(defaultImageZoom());

  private readonly panningOffset$ = new BehaviorSubject<ImageOffset>({ dx: 0, dy: 0 });

  private readonly imageLocation$ = new BehaviorSubject<ImagePositioningResult>(defaultImagePositioningResult());

  constructor() {
    this.combineData()
      .subscribe(([ imageDimensions, viewportDimensions, zoom, pixelRatio, offset ]) =>
        this.updateImageLocation(imageDimensions, viewportDimensions, zoom, pixelRatio, offset)
      );
  }

  readonly setImageDimensions = (dimensions: ImageDimensions) => {
    this.imageDimensions$.next(dimensions);
    this.panningOffset$.next({ dx: 0, dy: 0 });
    this.setZoom(defaultImageZoom());
  };

  readonly setViewport = (viewport: HTMLElement) => {
    this.viewport$.next(viewport);
  };

  readonly removeViewport = () => {
    this.viewport$.next(null);
  };

  readonly setZoom = (zoom: ImageZoom) => {
    this.zoom$.next(zoom);
  };

  readonly zoom = () => this.zoom$.asObservable();

  readonly startPanning = (event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    this.combineData()
      .pipe(
        take(1),
        switchMap(([ imageDimensions, viewportDimensions, zoom, pixelRatio, origin ]) =>
          this.mouseTrackerService
            .mouseDown(event)
            .pipe(
              map(state => {
                const dimensions = this.getAdjustedDimensions(imageDimensions, viewportDimensions, zoom);

                if (
                  dimensions.width <= viewportDimensions.width
                  && dimensions.height <= viewportDimensions.height
                ) {
                  return { dx: 0, dy: 0 };
                }

                const target = {
                  dx: origin.dx + state.dx / pixelRatio,
                  dy: origin.dy + state.dy / pixelRatio
                };

                const location = this.calculateImageLocation(viewportDimensions, dimensions, target);

                if (location.x > 0) {
                  target.dx = target.dx - location.x;
                }

                if (location.y > 0) {
                  target.dy = target.dy - location.y;
                }

                if (location.x + dimensions.width < viewportDimensions.width) {
                  target.dx = target.dx - (dimensions.width - viewportDimensions.width + location.x);
                }

                if (location.y + dimensions.height < viewportDimensions.height) {
                  target.dy = target.dy - (dimensions.height - viewportDimensions.height + location.y);
                }

                return target;
              }),
              distinctUntilChanged((previous, current) => previous.dx === current.dx && previous.dy === current.dy)
            )
        )
      )
      .subscribe(result => this.panningOffset$.next(result));
  };

  readonly imageLocation = () => this.imageLocation$.asObservable();

  private readonly detectZoomForDimension = (value: number, zoom: unknown): number => {
    if (typeof zoom === 'string' && zoom.length > 0) {
      const result = value / Number(zoom);

      if (!isNaN(result)) {
        return value;
      }
    }

    return -value;
  };

  private readonly adjustDimensionForZoom = (value: number, pixelRatio: number): number =>
    value < 0
      ? (-value) / pixelRatio
      : value;

  private readonly trackImageDimensions = () =>
    this.imageDimensions$
      .pipe(
        filter(imageDimensions => imageDimensions.width !== 0 && imageDimensions.height !== 0),
        distinctUntilChanged()
      );

  private readonly trackZoom = () => this.zoom$.pipe(distinctUntilChanged());

  private readonly trackPixelRatio = () => this.devicePixelRatioService.pixelRatio().pipe(distinctUntilChanged());

  private readonly trackPanningOffset = () => this.panningOffset$;

  private readonly trackViewportUpdates = () =>
    this.viewport$
      .pipe(
        filter(viewport => viewport !== null),
        switchMap(viewport =>
          this.devicePixelRatioService
            .windowResize()
            .pipe(
              startWith(null),
              map(() => ({
                width: this.detectZoomForDimension(viewport.offsetWidth, viewport.style.zoom),
                height: this.detectZoomForDimension(viewport.offsetHeight, viewport.style.zoom)
              } as ImageDimensions))
            )
        ),
        distinctUntilChanged((previous, current) =>
          previous.width === current.width && previous.height === current.height
        )
      );

  private readonly prepareData = () =>
    pipe(
      map(([ imageDimensions, viewportDimensions, zoom, pixelRatio, offset ]) =>
        [
          imageDimensions,
          {
            width: this.adjustDimensionForZoom(viewportDimensions.width, pixelRatio),
            height: this.adjustDimensionForZoom(viewportDimensions.height, pixelRatio)
          },
          zoom,
          pixelRatio,
          offset
        ] as [ ImageDimensions, ImageDimensions, ImageZoom, number, ImageOffset ]
      )
    );

  private readonly combineData = () =>
    combineLatest([
      this.trackImageDimensions(),
      this.trackViewportUpdates(),
      this.trackZoom(),
      this.trackPixelRatio(),
      this.trackPanningOffset()
    ])
      .pipe(this.prepareData());

  private readonly updateImageLocation = (
    imageDimensions: ImageDimensions,
    viewportDimensions: ImageDimensions,
    zoom: ImageZoom,
    pixelRatio: number,
    offset: ImageOffset
  ) => {
    const dimensions = this.getAdjustedDimensions(imageDimensions, viewportDimensions, zoom);
    const location = this.calculateImageLocation(
      viewportDimensions,
      dimensions,
      zoom === 'fit'
        ? { dx: 0, dy: 0 }
        : offset
    );

    const result: ImagePositioningResult = {
      width: dimensions.width,
      height: dimensions.height,
      x: location.x,
      y: location.y,
      pixelRatio,
      zoom,
      fitZoom: dimensions.width / imageDimensions.width * 100
    };

    this.imageLocation$.next(result);
  };

  private readonly getAdjustedDimensions = (
    imageDimensions: ImageDimensions,
    viewportDimensions: ImageDimensions,
    zoom: ImageZoom
  ): ImageDimensions =>
    zoom === 'fit'
      ? this.resizeToFit(imageDimensions, viewportDimensions)
      : this.resizeToZoom(imageDimensions, zoom);

  private readonly calculateImageLocation = (
    viewportDimensions: ImageDimensions,
    displayDimensions: ImageDimensions,
    offset: ImageOffset
  ) => {
    const dx = viewportDimensions.width > displayDimensions.width ? 0 : offset.dx;
    const dy = viewportDimensions.height > displayDimensions.height ? 0 : offset.dy;

    const result = {
      x: (viewportDimensions.width - displayDimensions.width) / 2 + dx,
      y: (viewportDimensions.height - displayDimensions.height) / 2 + dy
    };

    return result;
  };

  private readonly resizeToFit = (
    imageDimensions: ImageDimensions,
    viewportDimensions: ImageDimensions
  ): ImageDimensions => {
    if (
      imageDimensions.width > viewportDimensions.width
      || imageDimensions.height > viewportDimensions.height
    ) {
      const widthRatio = viewportDimensions.width / imageDimensions.width;
      const heightRatio = viewportDimensions.height / imageDimensions.height;
      const ratio = Math.min(widthRatio, heightRatio);

      return {
        width: imageDimensions.width * ratio,
        height: imageDimensions.height * ratio
      };
    }

    return {
      width: imageDimensions.width,
      height: imageDimensions.height
    };
  };

  private readonly resizeToZoom = (imageDimensions: ImageDimensions, zoom: number): ImageDimensions => ({
    width: imageDimensions.width * zoom,
    height: imageDimensions.height * zoom
  });
}
