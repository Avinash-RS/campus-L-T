import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrSubInterviewResultsComponent } from './hr-sub-interview-results.component';

describe('AdaniEvaluationFormComponent', () => {
  let component: HrSubInterviewResultsComponent;
  let fixture: ComponentFixture<HrSubInterviewResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrSubInterviewResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrSubInterviewResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
