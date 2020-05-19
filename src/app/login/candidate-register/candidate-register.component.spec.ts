import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CandidateRegisterComponent } from './candidate-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('CandidateRegisterComponent', () => {
  let component: CandidateRegisterComponent;
  let fixture: ComponentFixture<CandidateRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, MatSnackBarModule, RouterTestingModule, ReactiveFormsModule,
        HttpClientModule
      ],
      declarations: [ CandidateRegisterComponent ],
      schemas: [ NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.candidateForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let errors = {};
    const email = component.candidateForm.controls['email'];
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

  it('name field validity', () => {
    let errors = {};
    const name = component.candidateForm.controls['name'];

    // name field is required
    errors = name.errors || {};
    expect(errors['required']).toBeTruthy();

    // name to something
    name.setValue('test');
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('submitting a form', () => {
    expect(component.candidateForm.valid).toBeFalsy();
    component.candidateForm.controls['name'].setValue('test');
    component.candidateForm.controls['email'].setValue('test@test.com');
    expect(component.candidateForm.valid).toBeTruthy();
  });

});
