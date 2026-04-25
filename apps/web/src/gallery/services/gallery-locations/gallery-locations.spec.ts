import { TestBed } from '@angular/core/testing';

import { GalleryLocations } from './gallery-locations';

describe('GalleryLocations', () => {
  let service: GalleryLocations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryLocations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
