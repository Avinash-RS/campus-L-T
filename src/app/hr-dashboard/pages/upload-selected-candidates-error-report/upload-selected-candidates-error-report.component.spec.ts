import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSelectedCandidatesErrorReportComponent } from './upload-selected-candidates-error-report.component';

describe('UploadSelectedCandidatesErrorReportComponent', () => {
  let component: UploadSelectedCandidatesErrorReportComponent;
  let fixture: ComponentFixture<UploadSelectedCandidatesErrorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSelectedCandidatesErrorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSelectedCandidatesErrorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
