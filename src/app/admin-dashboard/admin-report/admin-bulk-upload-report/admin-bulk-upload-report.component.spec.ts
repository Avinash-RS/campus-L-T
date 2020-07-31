import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBulkUploadReportComponent } from './admin-bulk-upload-report.component';

describe('AdminBulkUploadReportComponent', () => {
  let component: AdminBulkUploadReportComponent;
  let fixture: ComponentFixture<AdminBulkUploadReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBulkUploadReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBulkUploadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
