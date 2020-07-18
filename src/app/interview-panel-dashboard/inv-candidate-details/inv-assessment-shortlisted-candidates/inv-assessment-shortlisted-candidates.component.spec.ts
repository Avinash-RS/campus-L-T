import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvAssessmentShortlistedCandidatesComponent } from './inv-assessment-shortlisted-candidates.component';

describe('InvAssessmentShortlistedCandidatesComponent', () => {
  let component: InvAssessmentShortlistedCandidatesComponent;
  let fixture: ComponentFixture<InvAssessmentShortlistedCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvAssessmentShortlistedCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvAssessmentShortlistedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
