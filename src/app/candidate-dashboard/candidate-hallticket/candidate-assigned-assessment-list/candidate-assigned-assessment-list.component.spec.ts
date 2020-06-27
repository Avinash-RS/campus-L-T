import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAssignedAssessmentListComponent } from './candidate-assigned-assessment-list.component';

describe('CandidateAssignedAssessmentListComponent', () => {
  let component: CandidateAssignedAssessmentListComponent;
  let fixture: ComponentFixture<CandidateAssignedAssessmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateAssignedAssessmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAssignedAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
