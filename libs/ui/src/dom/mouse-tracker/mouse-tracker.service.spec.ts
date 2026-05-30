import { TestBed } from '@angular/core/testing';

import { MouseTrackerService } from './mouse-tracker.service';

describe('MouseTrackerService', () => {
  let service: MouseTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
