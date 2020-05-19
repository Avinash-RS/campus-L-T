import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginpageComponent } from './loginpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';

describe('LoginpageComponent', () => {
  let component: LoginpageComponent;
  let fixture: ComponentFixture<LoginpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, MatSnackBarModule, RouterTestingModule, ReactiveFormsModule,
        HttpClientModule, BrowserAnimationsModule
      ],
      declarations: [LoginpageComponent, SnackbarComponent]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [SnackbarComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginpageComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let errors = {};
    const email = component.loginForm.controls['email'];
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

  it('password field validity', () => {
    let errors = {};
    const password = component.loginForm.controls['password'];

    // Password field is required
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    // password to something
    password.setValue('123');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('submitting a form', () => {
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('123456789');
    expect(component.loginForm.valid).toBeTruthy();

    // let user;
    // // Subscribe to the Observable and store the user in a local variable.
    // component.submit().subscribe((value) => user = value);

    // Trigger the login function
    // component.submit();

    // // Now we can check to make sure the emitted value is correct
    // expect(email).toBe('test@test.com');
    // expect(password).toBe('123456789');
  });
});
