import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycSubmissionPageComponent } from './kyc-submission-page.component';

describe('KycSubmissionPageComponent', () => {
  let component: KycSubmissionPageComponent;
  let fixture: ComponentFixture<KycSubmissionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycSubmissionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycSubmissionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
