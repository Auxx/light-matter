import { TestBed } from '@angular/core/testing';

import { ViewNavigator } from './view-navigator';

describe('ViewNavigator', () => {
  let service: ViewNavigator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewNavigator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
