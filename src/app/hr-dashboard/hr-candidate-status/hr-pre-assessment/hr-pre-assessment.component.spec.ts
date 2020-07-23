import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrPreAssessmentComponent } from './hr-pre-assessment.component';

describe('HrPreAssessmentComponent', () => {
  let component: HrPreAssessmentComponent;
  let fixture: ComponentFixture<HrPreAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrPreAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrPreAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
