import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAssessEvaluationComponent } from './video-assess-evaluation.component';

describe('VideoAssessEvaluationComponent', () => {
  let component: VideoAssessEvaluationComponent;
  let fixture: ComponentFixture<VideoAssessEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAssessEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAssessEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
