import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewPanelBulkUploadComponent } from './interview-panel-bulk-upload.component';

describe('InterviewPanelBulkUploadComponent', () => {
  let component: InterviewPanelBulkUploadComponent;
  let fixture: ComponentFixture<InterviewPanelBulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewPanelBulkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewPanelBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
