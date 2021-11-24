import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAssessEvaluationScreenComponent } from './video-assess-evaluation-screen.component';

describe('VideoAssessEvaluationScreenComponent', () => {
  let component: VideoAssessEvaluationScreenComponent;
  let fixture: ComponentFixture<VideoAssessEvaluationScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAssessEvaluationScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAssessEvaluationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
