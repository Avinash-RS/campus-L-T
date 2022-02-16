import { TestBed, async, inject } from '@angular/core/testing';

import { GeneralProfileComponentGuard } from './general-profile-component.guard';

describe('GeneralProfileComponentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralProfileComponentGuard]
    });
  });

  it('should ...', inject([GeneralProfileComponentGuard], (guard: GeneralProfileComponentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
