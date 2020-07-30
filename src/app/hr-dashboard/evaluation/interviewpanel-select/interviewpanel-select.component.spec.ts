import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewpanelSelectComponent } from './interviewpanel-select.component';

describe('InterviewpanelSelectComponent', () => {
  let component: InterviewpanelSelectComponent;
  let fixture: ComponentFixture<InterviewpanelSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewpanelSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewpanelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
