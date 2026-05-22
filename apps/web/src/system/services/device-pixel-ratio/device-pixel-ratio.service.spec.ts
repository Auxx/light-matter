import { TestBed } from '@angular/core/testing';

import { DevicePixelRatioService } from './device-pixel-ratio.service';

describe('DevicePixelRatioService', () => {
  let service: DevicePixelRatioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicePixelRatioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
