import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBulkUploadCandidateCompComponent } from './admin-bulk-upload-candidate-comp.component';

describe('AdminBulkUploadCandidateCompComponent', () => {
  let component: AdminBulkUploadCandidateCompComponent;
  let fixture: ComponentFixture<AdminBulkUploadCandidateCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBulkUploadCandidateCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBulkUploadCandidateCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
