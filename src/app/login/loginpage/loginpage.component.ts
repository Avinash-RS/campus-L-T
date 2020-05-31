import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

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
  prePoulteEmailId: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute
  ) {
    this.verifyEmail();
  }

  ngOnInit() {

    this.formInitialize();
  }

  verifyEmail() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['mail'] && params['temp-token']) {
        console.log(params['mail'], params['temp-token']);

        const ApiData = {
          name: params['mail'],
          temp_token: params['temp-token']
        };
        this.apiService.emailVerification(ApiData).subscribe((data: any) => {
          this.appConfig.hideLoader();
          this.prePoulteEmailId = ApiData.name;
          // this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.LOGIN}`);
          this.appConfig.success(`${data.message}`, '');
        }, (err) => {
          if (err.status === 400 && err.error.error === 'This User was not found or invalid') {
            this.appConfig.error(`${err.error.error}`, '');
            this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.VERIFY.EMAIL_ERROR);
          }
        });
      }
      if (params['mail']) {
        this.prePoulteEmailId = params['mail'];
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.LOGIN);
      }
    });
  }

  autoPopulateMail() {
    if (this.prePoulteEmailId) {
      this.loginForm.patchValue({
        email: this.prePoulteEmailId ? this.prePoulteEmailId : ''
      });
    }
  }


  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
      password: ['', [Validators.required]],
    }), this.autoPopulateMail();
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
        name: this.loginForm.value.email,
        pass: this.loginForm.value.password
      };

      this.subscribe1 = this.apiService.login(apiData).subscribe((data: any) => {
        this.appConfig.hideLoader();
        this.appConfig.consoleLog('data', data);
        this.appConfig.setLocalData('username', data && data.current_user.name ? data.current_user.name : '');
        this.appConfig.setLocalData('userId', data && data.current_user.uid ? data.current_user.uid : '');
        this.appConfig.setLocalData('csrf-login', data && data.csrf_token ? data.csrf_token : '');
        this.appConfig.setLocalData('logout-token', data && data.logout_token ? data.logout_token : '');
        this.appConfig.setLocalData('roles', data && data.current_user && data.current_user.roles && data.current_user.roles[1] ? data.current_user.roles[1] : null);
        if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'administrator') {
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.HOME);
        } else {
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.HOME);
        }

      }, (error) => {
      });

    } else {
      this.validateAllFields(this.loginForm);
    }

  }

  forgotPassword() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.PASSWORD.FORGOT);
  }

  createAccount() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.PASSWORD.SETUP);
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
