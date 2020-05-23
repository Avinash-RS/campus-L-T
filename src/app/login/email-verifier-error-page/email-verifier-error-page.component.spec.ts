import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerifierErrorPageComponent } from './email-verifier-error-page.component';

describe('EmailVerifierErrorPageComponent', () => {
  let component: EmailVerifierErrorPageComponent;
  let fixture: ComponentFixture<EmailVerifierErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerifierErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerifierErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
