import { TestBed, async, inject } from '@angular/core/testing';

import { KycAccessGuard } from './kyc-access.guard';

describe('KycAccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KycAccessGuard]
    });
  });

  it('should ...', inject([KycAccessGuard], (guard: KycAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
