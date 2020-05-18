import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterpageComponent } from './registerpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatAutocompleteModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/material/material.module';

describe('RegisterpageComponent', () => {
  let component: RegisterpageComponent;
  let fixture: ComponentFixture<RegisterpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, MatSnackBarModule, RouterTestingModule, ReactiveFormsModule,
        HttpClientModule, MatAutocompleteModule, MaterialModule
      ],
      declarations: [RegisterpageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterpageComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('form should be invalid', (async () => {
    component.registerForm.controls['firstName'].setValue('');
    component.registerForm.controls['lastName'].setValue('');
    component.registerForm.controls['jobTitle'].setValue('');
    component.registerForm.controls['mobileNumber'].setValue('');
    component.registerForm.controls['corporateName'].setValue('');
    component.registerForm.controls['corporateEmail'].setValue('');
    component.registerForm.controls['state'].setValue('');
    component.registerForm.controls['city'].setValue('');
    component.registerForm.controls['comment'].setValue('');
    expect(component.registerForm.valid).toBeFalsy();
  }));
  it('form should be valid', (async () => {
    component.registerForm.controls['firstName'].setValue('ABC');
    component.registerForm.controls['lastName'].setValue('XYZ');
    component.registerForm.controls['jobTitle'].setValue('Software');
    component.registerForm.controls['mobileNumber'].setValue('9865258894');
    component.registerForm.controls['corporateName'].setValue('some name');
    component.registerForm.controls['corporateEmail'].setValue('some@mail.com');
    component.registerForm.controls['state'].setValue('Tamilnadu');
    component.registerForm.controls['city'].setValue('Chennai');
    component.registerForm.controls['comment'].setValue('hi');
    expect(component.registerForm.valid).toBeFalsy();
  }));

  // it('email field validity', () => {
  //   let errors = {};
  //   const email = component.registerForm.controls['corporateEmail'];
  //   expect(email.valid).toBeFalsy();

  //   // Email field is required
  //   errors = email.errors || {};
  //   expect(errors['required']).toBeTruthy();

  //   // Set email to something
  //   email.setValue('test');
  //   errors = email.errors || {};
  //   expect(errors['required']).toBeFalsy();
  //   expect(errors['pattern']).toBeTruthy();

  //   // Set email to something correct
  //   email.setValue('test@example.com');
  //   errors = email.errors || {};
  //   expect(errors['required']).toBeFalsy();
  //   expect(errors['pattern']).toBeFalsy();
  // });

  // it('password field validity', () => {
  //   let errors = {};
  //   const password = component.registerForm.controls['password'];

  //   // Password field is required
  //   errors = password.errors || {};
  //   expect(errors['required']).toBeTruthy();

  //   // password to something
  //   password.setValue('123');
  //   errors = password.errors || {};
  //   expect(errors['required']).toBeFalsy();
  // });

  // it('submitting a form', () => {
  //   expect(component.registerForm.valid).toBeFalsy();
  //   component.registerForm.controls['email'].setValue('test@test.com');
  //   component.registerForm.controls['password'].setValue('123456789');
  //   expect(component.registerForm.valid).toBeTruthy();

  //   // let user;
  //   // // Subscribe to the Observable and store the user in a local variable.
  //   // component.submit().subscribe((value) => user = value);

  //   // Trigger the login function
  //   // component.submit();

  //   // // Now we can check to make sure the emitted value is correct
  //   // expect(email).toBe('test@test.com');
  //   // expect(password).toBe('123456789');
  // });

});
