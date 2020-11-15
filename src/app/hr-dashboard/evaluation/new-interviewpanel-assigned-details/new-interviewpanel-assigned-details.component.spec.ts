import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInterviewpanelAssignedDetailsComponent } from './new-interviewpanel-assigned-details.component';

describe('NewInterviewpanelAssignedDetailsComponent', () => {
  let component: NewInterviewpanelAssignedDetailsComponent;
  let fixture: ComponentFixture<NewInterviewpanelAssignedDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInterviewpanelAssignedDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInterviewpanelAssignedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
