import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoPreAssessmentComponent } from './tpo-pre-assessment.component';

describe('TpoPreAssessmentComponent', () => {
  let component: TpoPreAssessmentComponent;
  let fixture: ComponentFixture<TpoPreAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpoPreAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpoPreAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
