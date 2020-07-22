import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentCandidateDetailsComponent } from './assessment-candidate-details.component';

describe('AssessmentCandidateDetailsComponent', () => {
  let component: AssessmentCandidateDetailsComponent;
  let fixture: ComponentFixture<AssessmentCandidateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentCandidateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentCandidateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
