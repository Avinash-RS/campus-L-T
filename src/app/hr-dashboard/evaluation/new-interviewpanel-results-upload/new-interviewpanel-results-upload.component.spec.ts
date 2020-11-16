import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInterviewpanelResultsUploadComponent } from './new-interviewpanel-results-upload.component';

describe('NewInterviewpanelResultsUploadComponent', () => {
  let component: NewInterviewpanelResultsUploadComponent;
  let fixture: ComponentFixture<NewInterviewpanelResultsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInterviewpanelResultsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInterviewpanelResultsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
