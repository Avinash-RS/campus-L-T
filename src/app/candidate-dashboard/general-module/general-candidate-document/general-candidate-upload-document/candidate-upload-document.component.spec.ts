import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCandidateUploadDocumentComponent } from './candidate-upload-document.component';

describe('CandidateUploadDocumentComponent', () => {
  let component: GeneralCandidateUploadDocumentComponent;
  let fixture: ComponentFixture<GeneralCandidateUploadDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralCandidateUploadDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCandidateUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
