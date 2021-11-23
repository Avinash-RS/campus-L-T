import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAssessAssignedCandidatesComponent } from './video-assess-assigned-candidates.component';

describe('VideoAssessAssignedCandidatesComponent', () => {
  let component: VideoAssessAssignedCandidatesComponent;
  let fixture: ComponentFixture<VideoAssessAssignedCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAssessAssignedCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAssessAssignedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
