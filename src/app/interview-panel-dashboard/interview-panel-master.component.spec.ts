import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewPanelMasterComponent } from './interview-panel-master.component';

describe('InterviewPanelMasterComponent', () => {
  let component: InterviewPanelMasterComponent;
  let fixture: ComponentFixture<InterviewPanelMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewPanelMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewPanelMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
