import { TestBed, async, inject } from '@angular/core/testing';

import { KycthanksGuard } from './kycthanks.guard';

describe('KycthanksGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KycthanksGuard]
    });
  });

  it('should ...', inject([KycthanksGuard], (guard: KycthanksGuard) => {
    expect(guard).toBeTruthy();
  }));
});
