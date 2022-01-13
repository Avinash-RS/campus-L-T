import { TestBed, async, inject } from '@angular/core/testing';

import { LarsenComponentsAuthGuard } from './larsen_components_auth.guard';

describe('LarsenComponentsAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LarsenComponentsAuthGuard]
    });
  });

  it('should ...', inject([LarsenComponentsAuthGuard], (guard: LarsenComponentsAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
