import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCandidateDocumentComponent } from './candidate-document.component';

describe('CandidateDocumentComponent', () => {
  let component: GeneralCandidateDocumentComponent;
  let fixture: ComponentFixture<GeneralCandidateDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralCandidateDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCandidateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
