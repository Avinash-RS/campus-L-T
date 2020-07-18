import { TestBed, async, inject } from '@angular/core/testing';

import { TpocanloadGuard } from './tpocanload.guard';

describe('TpocanloadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TpocanloadGuard]
    });
  });

  it('should ...', inject([TpocanloadGuard], (guard: TpocanloadGuard) => {
    expect(guard).toBeTruthy();
  }));
});
