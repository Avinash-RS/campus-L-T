import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewpanelDetailsComponent } from './interviewpanel-details.component';

describe('InterviewpanelDetailsComponent', () => {
  let component: InterviewpanelDetailsComponent;
  let fixture: ComponentFixture<InterviewpanelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewpanelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewpanelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
