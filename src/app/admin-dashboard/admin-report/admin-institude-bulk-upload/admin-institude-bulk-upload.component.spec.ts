import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstitudeBulkUploadComponent } from './admin-institude-bulk-upload.component';

describe('AdminInstitudeBulkUploadComponent', () => {
  let component: AdminInstitudeBulkUploadComponent;
  let fixture: ComponentFixture<AdminInstitudeBulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInstitudeBulkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInstitudeBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
