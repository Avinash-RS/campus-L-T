import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAssingAssessmentComponent } from './hr-assing-assessment.component';

describe('HrAssingAssessmentComponent', () => {
  let component: HrAssingAssessmentComponent;
  let fixture: ComponentFixture<HrAssingAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrAssingAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrAssingAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
