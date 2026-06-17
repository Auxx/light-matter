import { TestBed } from '@angular/core/testing';

import { ThumbnailLoaderService } from './thumbnail-loader.service';

describe('ThumbnailLoaderService', () => {
  let service: ThumbnailLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThumbnailLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
