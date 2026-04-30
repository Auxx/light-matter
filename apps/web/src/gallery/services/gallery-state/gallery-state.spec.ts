import { TestBed } from '@angular/core/testing';

import { GalleryState } from './gallery-state';

describe('GalleryState', () => {
  let service: GalleryState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
