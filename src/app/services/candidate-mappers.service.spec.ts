import { TestBed } from '@angular/core/testing';

import { CandidateMappersService } from './candidate-mappers.service';

describe('CandidateMappersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CandidateMappersService = TestBed.get(CandidateMappersService);
    expect(service).toBeTruthy();
  });
});
