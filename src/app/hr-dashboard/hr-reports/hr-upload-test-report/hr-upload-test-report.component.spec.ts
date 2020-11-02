import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrUploadTestReportComponent } from './hr-upload-test-report.component';

describe('HrUploadTestReportComponent', () => {
  let component: HrUploadTestReportComponent;
  let fixture: ComponentFixture<HrUploadTestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrUploadTestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrUploadTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
