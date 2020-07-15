import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBulkUploadInstitutesComponent } from './admin-bulk-upload-institutes.component';

describe('AdminBulkUploadInstitutesComponent', () => {
  let component: AdminBulkUploadInstitutesComponent;
  let fixture: ComponentFixture<AdminBulkUploadInstitutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBulkUploadInstitutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBulkUploadInstitutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
