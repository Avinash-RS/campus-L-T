import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistedCandidateListSecondLevelComponent } from './shortlisted-candidate-list-second-level.component';

describe('ShortlistedCandidateListSecondLevelComponent', () => {
  let component: ShortlistedCandidateListSecondLevelComponent;
  let fixture: ComponentFixture<ShortlistedCandidateListSecondLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortlistedCandidateListSecondLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortlistedCandidateListSecondLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
