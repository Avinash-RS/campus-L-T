import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondLevelAssessmentReportsComponent } from './second-level-assessment-reports.component';

describe('SecondLevelAssessmentReportsComponent', () => {
  let component: SecondLevelAssessmentReportsComponent;
  let fixture: ComponentFixture<SecondLevelAssessmentReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondLevelAssessmentReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondLevelAssessmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
