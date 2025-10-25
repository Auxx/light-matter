import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { startupGuard } from './startup.guard';

describe('startupGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => startupGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
