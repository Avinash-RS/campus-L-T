import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationCandidateDetailsComponent } from './evaluation-candidate-details.component';

describe('EvaluationCandidateDetailsComponent', () => {
  let component: EvaluationCandidateDetailsComponent;
  let fixture: ComponentFixture<EvaluationCandidateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationCandidateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationCandidateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
