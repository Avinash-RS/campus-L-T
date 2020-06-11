import { TestBed, async, inject } from '@angular/core/testing';

import { AdmincanloadGuard } from './admincanload.guard';

describe('AdmincanloadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdmincanloadGuard]
    });
  });

  it('should ...', inject([AdmincanloadGuard], (guard: AdmincanloadGuard) => {
    expect(guard).toBeTruthy();
  }));
});
