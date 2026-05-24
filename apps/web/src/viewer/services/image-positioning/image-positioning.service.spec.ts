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
});
