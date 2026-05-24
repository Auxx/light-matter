import { inject, Injectable } from '@angular/core';
import { MouseTrackerService } from '@light-matter/ui';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs';
import { DevicePixelRatioService } from '../../../system/services/device-pixel-ratio/device-pixel-ratio.service';
import {
  defaultImagePositioningResult,
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

  private readonly zoom$ = new BehaviorSubject<ImageZoom>('fit');

  private readonly imageLocation$ = new BehaviorSubject<ImagePositioningResult>(defaultImagePositioningResult());

  constructor() {
    combineLatest([
      this.imageDimensions$
        .pipe(
          filter(imageDimensions => imageDimensions.width !== 0 && imageDimensions.height !== 0),
          distinctUntilChanged()
        ),

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
        ),

      this.zoom$.pipe(distinctUntilChanged()),

      this.devicePixelRatioService.pixelRatio().pipe(distinctUntilChanged())
    ])
      .pipe(
        map(([ imageDimensions, viewportDimensions, zoom, pixelRatio ]) =>
          [
            imageDimensions,
            {
              width: this.adjustDimensionForZoom(viewportDimensions.width, pixelRatio),
              height: this.adjustDimensionForZoom(viewportDimensions.height, pixelRatio)
            },
            zoom,
            pixelRatio
          ] as [ ImageDimensions, ImageDimensions, ImageZoom, number ]
        )
      )
      .subscribe(([ imageDimensions, viewportDimensions, zoom, pixelRatio ]) => {
        // console.log('---------------');
        // console.log(imageDimensions);
        // console.log(viewportDimensions);
        // console.log(zoom);
        // console.log(pixelRatio);

        if (zoom === 'fit') {
          this.fitImage(imageDimensions, viewportDimensions, pixelRatio);
        }
      });
  }

  readonly imageLocation = () => this.imageLocation$.asObservable();

  private readonly fitImage = (
    imageDimensions: ImageDimensions,
    viewportDimensions: ImageDimensions,
    pixelRatio: number
  ) => {
    if (
      imageDimensions.width > viewportDimensions.width
      || imageDimensions.height > viewportDimensions.height
    ) {
      return;
    }

    const location = this.calculateImageLocation(viewportDimensions, imageDimensions, { dx: 0, dy: 0 });

    const result: ImagePositioningResult = {
      width: imageDimensions.width,
      height: imageDimensions.height,
      x: location.x,
      y: location.y,
      pixelRatio: pixelRatio
    };

    this.imageLocation$.next(result);
  };

  private readonly calculateImageLocation = (
    viewportDimensions: ImageDimensions,
    displayDimensions: ImageDimensions,
    panOffset: ImageOffset
  ) => ({
    x: (viewportDimensions.width - displayDimensions.width) / 2 + panOffset.dx,
    y: (viewportDimensions.height - displayDimensions.height) / 2 + panOffset.dy
  });

  readonly setImageDimensions = (dimensions: ImageDimensions) => {
    this.imageDimensions$.next(dimensions);
    this.setZoom('fit');
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
}
