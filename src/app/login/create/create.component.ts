import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormCustomValidators } from '../../custom-form-validators/autocompleteDropdownMatch';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;
  toggleVisibility = true;
  toggleVisibilityConfirmPassword = true;
  currentRoute: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private commonService: CommonService
  ) {
    if (this.router.url === '/signup/reset-password') {
      this.currentRoute = 'Reset the password';
    } else {
      this.currentRoute = 'Create an account';
    }
  }

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
      temp: ['', [Validators.required]],
      password: ['', [Validators.required, FormCustomValidators.patternValidator()]],
      confirmpassword: ['', [Validators.required]]
    }, { validators: FormCustomValidators.identityRevealedValidator });
  }

  get email() {
    return this.createForm.get('email');
  }
  get password() {
    return this.createForm.get('password');
  }
  get temp() {
    return this.createForm.get('temp');
  }
  get confirmpassword() {
    return this.createForm.get('confirmpassword');
  }

  submit() {

    if (this.createForm.valid) {
      const apiData = {
        mail: this.createForm.value.email,
        temp_pass: this.createForm.value.temp,
        new_pass: this.createForm.value.password
      };

      this.apiService.passwordReset(apiData).subscribe((success: any) => {
        console.log(success);
        this.commonService.success((this.currentRoute.includes('Reset')) ? `Password has been resetted Successfully` :
          `Account has been created Successfully`, '');
        this.router.navigate(['/signup/login']);
      }, (error) => {
        console.log(error);
        if (error.status === 422) {
          return this.commonService.error('Usermail or Username has already taken', '');
        }
        if (error.status === 400) {
          return this.commonService.error(error.error ? error.error : '400 bad request', '');
        }
        if (error.status === 401) {
          return this.commonService.error('Unauthorized', '');
        } else {
          this.commonService.error(!error.error ? 'Something went wrong' :
            error.error.message ? error.error.message : 'Something went wrong.. Please try again', '');
        }
      });
    } else {
      this.validateAllFields(this.createForm);
    }

  }

  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

}
