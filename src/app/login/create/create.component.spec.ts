import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponent } from './create.component';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';

fdescribe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, HttpClientModule, MatSnackBarModule,
        ReactiveFormsModule, RouterTestingModule
      ],
      declarations: [CreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when empty', () => {
    expect(component.createForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let errors = {};
    const email = component.createForm.controls['email'];
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
    const password = component.createForm.controls['password'];
    expect(password.valid).toBeFalsy();

    // Password field is required
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    // Password with sometext
    password.setValue('Cintana123');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    // expect(errors['FormCustomValidators.patternValidator()']).toBeTruthy();

    // Set correct pattern password
    password.setValue('Cintana@123');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    // expect(errors['FormCustomValidators.patternValidator()']).toBeFalsy();
  });

  it('Confirm password to match password', () => {
    let errors = {};
    const confirmpassword = component.createForm.controls['confirmpassword'];
    expect(confirmpassword.valid).toBeFalsy();

    // confirm password to be required
    errors = confirmpassword.errors || {};
    expect(errors['required']).toBeTruthy();

    // Confirm password to match pattern
    confirmpassword.setValue('Cintana123');
    errors = confirmpassword.errors || {};
    expect(errors['required']).toBeFalsy();

  });

  it('To create account or Password reset', () => {
    expect(component.createForm.valid).toBeFalsy();
    component.createForm.controls['email'].setValue('test@test.com');
    component.createForm.controls['temp'].setValue('Xyzdad');
    component.createForm.controls['password'].setValue('Cintana@123');
    component.createForm.controls['confirmpassword'].setValue('Cintana@123');
    expect(component.createForm.valid).toBeTruthy();

  });

});
