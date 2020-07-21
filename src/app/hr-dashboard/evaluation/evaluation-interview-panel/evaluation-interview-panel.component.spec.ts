import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationInterviewPanelComponent } from './evaluation-interview-panel.component';

describe('EvaluationInterviewPanelComponent', () => {
  let component: EvaluationInterviewPanelComponent;
  let fixture: ComponentFixture<EvaluationInterviewPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationInterviewPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationInterviewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
