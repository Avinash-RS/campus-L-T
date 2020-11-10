import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInterviewPanelHeaderComponent } from './shared-interview-panel-header.component';

describe('SharedInterviewPanelHeaderComponent', () => {
  let component: SharedInterviewPanelHeaderComponent;
  let fixture: ComponentFixture<SharedInterviewPanelHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInterviewPanelHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInterviewPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
