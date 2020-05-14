import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpForgotPasswordComponent } from './otp-forgot-password.component';

describe('OtpForgotPasswordComponent', () => {
  let component: OtpForgotPasswordComponent;
  let fixture: ComponentFixture<OtpForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
