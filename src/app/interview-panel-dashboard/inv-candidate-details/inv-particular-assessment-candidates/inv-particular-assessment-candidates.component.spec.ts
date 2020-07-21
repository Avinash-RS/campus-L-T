import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvParticularAssessmentCandidatesComponent } from './inv-particular-assessment-candidates.component';

describe('InvParticularAssessmentCandidatesComponent', () => {
  let component: InvParticularAssessmentCandidatesComponent;
  let fixture: ComponentFixture<InvParticularAssessmentCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvParticularAssessmentCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvParticularAssessmentCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
