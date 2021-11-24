import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteEvaluatorAssignForVideoAssessComponent } from './route-evaluator-assign-for-video-assess.component';

describe('RouteEvaluatorAssignForVideoAssessComponent', () => {
  let component: RouteEvaluatorAssignForVideoAssessComponent;
  let fixture: ComponentFixture<RouteEvaluatorAssignForVideoAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteEvaluatorAssignForVideoAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteEvaluatorAssignForVideoAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
