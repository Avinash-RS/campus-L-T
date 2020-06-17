import { TestBed, async, inject } from '@angular/core/testing';

import { HrcanloadGuard } from './hrcanload.guard';

describe('HrcanloadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HrcanloadGuard]
    });
  });

  it('should ...', inject([HrcanloadGuard], (guard: HrcanloadGuard) => {
    expect(guard).toBeTruthy();
  }));
});
