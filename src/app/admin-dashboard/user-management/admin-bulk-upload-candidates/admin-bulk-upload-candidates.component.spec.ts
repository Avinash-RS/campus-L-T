import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBulkUploadCandidatesComponent } from './admin-bulk-upload-candidates.component';

describe('AdminBulkUploadCandidatesComponent', () => {
  let component: AdminBulkUploadCandidatesComponent;
  let fixture: ComponentFixture<AdminBulkUploadCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBulkUploadCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBulkUploadCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
