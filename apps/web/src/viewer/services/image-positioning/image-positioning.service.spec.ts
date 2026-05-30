import { TestBed } from '@angular/core/testing';

import { ImagePositioningService } from './image-positioning.service';

describe('ImagePositioningService', () => {
  let service: ImagePositioningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagePositioningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // describe('resizeToFit', () => {
  //   it('should resize image to fit viewport width (landscape image in landscape viewport)', () => {
  //     const imageDimensions = { width: 1000, height: 500 };
  //     const viewportDimensions = { width: 500, height: 500 };
  //
  //     const result = (service as any).resizeToFit(imageDimensions, viewportDimensions);
  //
  //     expect(result).toEqual({ width: 500, height: 250 });
  //   });
  //
  //   it('should resize image to fit viewport height (portrait image in landscape viewport)', () => {
  //     const imageDimensions = { width: 500, height: 1000 };
  //     const viewportDimensions = { width: 1000, height: 500 };
  //
  //     const result = (service as any).resizeToFit(imageDimensions, viewportDimensions);
  //
  //     expect(result).toEqual({ width: 250, height: 500 });
  //   });
  //
  //   it('should upscale image to fit viewport', () => {
  //     const imageDimensions = { width: 100, height: 100 };
  //     const viewportDimensions = { width: 500, height: 1000 };
  //
  //     const result = (service as any).resizeToFit(imageDimensions, viewportDimensions);
  //
  //     expect(result).toEqual({ width: 500, height: 500 });
  //   });
  //
  //   it('should maintain aspect ratio when both dimensions are equal', () => {
  //     const imageDimensions = { width: 200, height: 100 };
  //     const viewportDimensions = { width: 200, height: 100 };
  //
  //     const result = (service as any).resizeToFit(imageDimensions, viewportDimensions);
  //
  //     expect(result).toEqual({ width: 200, height: 100 });
  //   });
  // });
});
