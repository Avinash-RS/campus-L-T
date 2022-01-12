import { TestBed, async, inject } from '@angular/core/testing';

import { CandidateCanloadGuard } from './candidate_canload.guard';

describe('CandidateCanloadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandidateCanloadGuard]
    });
  });

  it('should ...', inject([CandidateCanloadGuard], (guard: CandidateCanloadGuard) => {
    expect(guard).toBeTruthy();
  }));
});
