import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {

  loginForm: FormGroup;
  toggleVisibility = true;
  toggleVisibilityConfirmPassword = true;
  subscribe1: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  submit() {

    if (this.loginForm.valid) {
      const apiData = {
        mail: this.loginForm.value.email,
        pass: this.loginForm.value.password
      };
      this.subscribe1 = this.apiService.login(apiData).subscribe((data: any) => {
        console.log(data);

      }, (error) => {
        console.log(error);
        if (error.status === 422) {
          this.commonService.error('Usermail or Username has already taken', '');
        }
        if (error.status === 400) {
          return this.commonService.error(error.error ? error.error : '400 bad request', '');
        }
        if (error.status === 401) {
          this.commonService.error('Unauthorized', '');
        } else {
          this.commonService.error(!error.error ? 'Something went wrong' :
            error.error.message ? error.error.message : 'Something went wrong.. Please try again', '');
        }
      });

    } else {
      this.validateAllFields(this.loginForm);
    }

  }

  forgotPassword() {
    this.router.navigate(['./signup/forgot-password']);
  }

  createAccount() {
    this.router.navigate(['./signup/create']);
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
