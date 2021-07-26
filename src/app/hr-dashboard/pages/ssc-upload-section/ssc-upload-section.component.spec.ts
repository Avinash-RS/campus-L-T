import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SscUploadSectionComponent } from './ssc-upload-section.component';

describe('SscUploadSectionComponent', () => {
  let component: SscUploadSectionComponent;
  let fixture: ComponentFixture<SscUploadSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SscUploadSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SscUploadSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
