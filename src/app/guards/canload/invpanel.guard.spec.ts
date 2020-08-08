import { TestBed, async, inject } from '@angular/core/testing';

import { InvpanelGuard } from './invpanel.guard';

describe('InvpanelGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvpanelGuard]
    });
  });

  it('should ...', inject([InvpanelGuard], (guard: InvpanelGuard) => {
    expect(guard).toBeTruthy();
  }));
});
