import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateUploadsComponent } from './candidate-uploads.component';

describe('CandidateUploadsComponent', () => {
  let component: CandidateUploadsComponent;
  let fixture: ComponentFixture<CandidateUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
