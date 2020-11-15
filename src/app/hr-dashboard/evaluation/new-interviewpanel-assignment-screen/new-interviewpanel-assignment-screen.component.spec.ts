import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInterviewpanelAssignmentScreenComponent } from './new-interviewpanel-assignment-screen.component';

describe('NewInterviewpanelAssignmentScreenComponent', () => {
  let component: NewInterviewpanelAssignmentScreenComponent;
  let fixture: ComponentFixture<NewInterviewpanelAssignmentScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInterviewpanelAssignmentScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInterviewpanelAssignmentScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
