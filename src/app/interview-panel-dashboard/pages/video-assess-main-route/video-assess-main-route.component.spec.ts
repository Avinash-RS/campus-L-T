import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAssessMainRouteComponent } from './video-assess-main-route.component';

describe('VideoAssessMainRouteComponent', () => {
  let component: VideoAssessMainRouteComponent;
  let fixture: ComponentFixture<VideoAssessMainRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAssessMainRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAssessMainRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
