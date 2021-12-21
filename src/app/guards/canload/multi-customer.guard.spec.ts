import { TestBed, async, inject } from '@angular/core/testing';

import { MultiCustomerGuard } from './multi-customer.guard';

describe('MultiCustomerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultiCustomerGuard]
    });
  });

  it('should ...', inject([MultiCustomerGuard], (guard: MultiCustomerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
