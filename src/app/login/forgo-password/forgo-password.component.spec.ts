import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgoPasswordComponent } from './forgo-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ForgoPasswordComponent', () => {
  let component: ForgoPasswordComponent;
  let fixture: ComponentFixture<ForgoPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, MatSnackBarModule, RouterTestingModule, ReactiveFormsModule, HttpClientModule
      ],
      declarations: [ForgoPasswordComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgoPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when empty', () => {
  expect(component.forgotPasswordForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let errors = {};
    const email = component.forgotPasswordForm.controls['email'];
    expect(email.valid).toBeFalsy();

    // Email field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    email.setValue('test');
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Set email to something correct
    email.setValue('test@example.com');
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('submitting a form with email', () => {
    expect(component.forgotPasswordForm.controls['email'].valid).toBeFalsy();
    component.forgotPasswordForm.controls['email'].setValue('test@test.com');
    expect(component.forgotPasswordForm.controls['email'].valid).toBeTruthy();
  });
});
