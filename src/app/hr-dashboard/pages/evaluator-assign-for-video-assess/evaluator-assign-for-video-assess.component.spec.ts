import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatorAssignForVideoAssessComponent } from './evaluator-assign-for-video-assess.component';

describe('EvaluatorAssignForVideoAssessComponent', () => {
  let component: EvaluatorAssignForVideoAssessComponent;
  let fixture: ComponentFixture<EvaluatorAssignForVideoAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluatorAssignForVideoAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatorAssignForVideoAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
