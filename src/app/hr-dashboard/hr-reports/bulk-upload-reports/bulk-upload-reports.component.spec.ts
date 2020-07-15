import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadReportsComponent } from './bulk-upload-reports.component';

describe('BulkUploadReportsComponent', () => {
  let component: BulkUploadReportsComponent;
  let fixture: ComponentFixture<BulkUploadReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
