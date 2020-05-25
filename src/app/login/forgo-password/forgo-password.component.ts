import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-forgo-password',
  templateUrl: './forgo-password.component.html',
  styleUrls: ['./forgo-password.component.scss']
})
export class ForgoPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
    this.forgotPasswordForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(mobileRegex)]],
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
    });
  }

  get mobile() {
    return this.forgotPasswordForm.get('mobile');
  }
  get email() {
    return this.forgotPasswordForm.get('email');
  }

  submit() {

    if (this.forgotPasswordForm.get('mobile').valid || this.forgotPasswordForm.get('email').valid) {
      let data;
      if (this.forgotPasswordForm.get('mobile').valid) {
        data = {
          mobile: [{ value: this.forgotPasswordForm.value.mobile }],
        };
      }
      if (this.forgotPasswordForm.get('email').valid) {
        data = {
          mail: this.forgotPasswordForm.value.email
        };
      }
      if (this.forgotPasswordForm.get('mobile').valid && this.forgotPasswordForm.get('email').valid) {
        data = {
          mail: this.forgotPasswordForm.value.email
        };
      }
      this.appConfig.consoleLog('Registration Data which is passed to API', data);
      // API

      this.apiService.forgotPassword(data).subscribe((success: any) => {
        this.appConfig.hideLoader();
        this.appConfig.consoleLog('success', success);
        this.appConfig.success('Password Reset link has been successfully sent to your Email Id', '');
        this.appConfig.routeNavigation('/' + CONSTANT.ROUTES.HOME);
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.forgotPasswordForm);
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
