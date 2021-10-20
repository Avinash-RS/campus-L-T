import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleVideoAssessComponent } from './schedule-video-assess.component';

describe('ScheduleVideoAssessComponent', () => {
  let component: ScheduleVideoAssessComponent;
  let fixture: ComponentFixture<ScheduleVideoAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleVideoAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleVideoAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
