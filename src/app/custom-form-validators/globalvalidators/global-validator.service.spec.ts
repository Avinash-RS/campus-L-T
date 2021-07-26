import { TestBed } from '@angular/core/testing';

import { GlobalValidatorService } from './global-validator.service';

describe('GlobalValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalValidatorService = TestBed.get(GlobalValidatorService);
    expect(service).toBeTruthy();
  });
});
