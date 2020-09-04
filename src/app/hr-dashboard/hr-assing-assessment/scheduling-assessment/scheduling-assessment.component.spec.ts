import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingAssessmentComponent } from './scheduling-assessment.component';

describe('SchedulingAssessmentComponent', () => {
  let component: SchedulingAssessmentComponent;
  let fixture: ComponentFixture<SchedulingAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
