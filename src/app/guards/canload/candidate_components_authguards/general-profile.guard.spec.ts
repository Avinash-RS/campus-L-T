import { TestBed, async, inject } from '@angular/core/testing';

import { GeneralProfileGuard } from './general-profile.guard';

describe('GeneralProfileGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralProfileGuard]
    });
  });

  it('should ...', inject([GeneralProfileGuard], (guard: GeneralProfileGuard) => {
    expect(guard).toBeTruthy();
  }));
});
