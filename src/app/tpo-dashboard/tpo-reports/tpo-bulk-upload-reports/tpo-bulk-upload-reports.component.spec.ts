import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoBulkUploadReportsComponent } from './tpo-bulk-upload-reports.component';

describe('TpoBulkUploadReportsComponent', () => {
  let component: TpoBulkUploadReportsComponent;
  let fixture: ComponentFixture<TpoBulkUploadReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpoBulkUploadReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpoBulkUploadReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
