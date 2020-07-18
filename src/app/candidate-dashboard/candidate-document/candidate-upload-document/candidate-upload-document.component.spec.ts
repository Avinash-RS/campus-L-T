import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateUploadDocumentComponent } from './candidate-upload-document.component';

describe('CandidateUploadDocumentComponent', () => {
  let component: CandidateUploadDocumentComponent;
  let fixture: ComponentFixture<CandidateUploadDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateUploadDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
