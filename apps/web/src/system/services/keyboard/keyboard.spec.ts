import { TestBed } from '@angular/core/testing';

import { Keyboard } from './keyboard';

describe('Keyboard', () => {
  let service: Keyboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Keyboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
