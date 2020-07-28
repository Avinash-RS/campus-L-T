import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTestResultsComponent } from './upload-test-results.component';

describe('UploadTestResultsComponent', () => {
  let component: UploadTestResultsComponent;
  let fixture: ComponentFixture<UploadTestResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTestResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
