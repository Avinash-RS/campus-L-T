import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateBulkUploadComponent } from './candidate-bulk-upload.component';

describe('CandidateBulkUploadComponent', () => {
  let component: CandidateBulkUploadComponent;
  let fixture: ComponentFixture<CandidateBulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateBulkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
