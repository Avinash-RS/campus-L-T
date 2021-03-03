import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSelectedCandidatesComponent } from './upload-selected-candidates.component';

describe('UploadSelectedCandidatesComponent', () => {
  let component: UploadSelectedCandidatesComponent;
  let fixture: ComponentFixture<UploadSelectedCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSelectedCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSelectedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
