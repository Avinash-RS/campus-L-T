import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvpanelBulkUploadReportComponent } from './invpanel-bulk-upload-report.component';

describe('InvpanelBulkUploadReportComponent', () => {
  let component: InvpanelBulkUploadReportComponent;
  let fixture: ComponentFixture<InvpanelBulkUploadReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvpanelBulkUploadReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvpanelBulkUploadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
