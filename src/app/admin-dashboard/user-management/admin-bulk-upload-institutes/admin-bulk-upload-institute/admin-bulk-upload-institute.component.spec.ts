import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBulkUploadInstituteComponent } from './admin-bulk-upload-institute.component';

describe('AdminBulkUploadInstituteComponent', () => {
  let component: AdminBulkUploadInstituteComponent;
  let fixture: ComponentFixture<AdminBulkUploadInstituteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBulkUploadInstituteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBulkUploadInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
