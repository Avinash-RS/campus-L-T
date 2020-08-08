import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {

  loginForm: FormGroup;
  toggleVisibility = true;
  toggleVisibilityConfirmPassword = true;
  subscribe1: Subscription;
  prePoulteEmailId: any;
  verifyArr = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {

    this.verifyEmail();
    this.formInitialize();
  }

  verifyEmail() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['mail'] && params['temp-token']) {
        console.log(params['mail'], params['temp-token']);

        this.verifyArr.push({
          name: params['mail'],
          temp_token: params['temp-token']
        });
        console.log('Calling apicalling');
        this.apiCalling();
      }
      if (params['mail']) {
        this.prePoulteEmailId = params['mail'];
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.LOGIN);
        console.log('Not getting mail or token in param', params['mail'], params['temp-token']);
      }
    });
  }

  apiCalling() {
    console.log('entering apiCalling methid');
    this.apiService.getAllState().subscribe((datas: any) => {
      this.apiService.emailVerification(this.verifyArr[0]).subscribe((data: any) => {
        console.log('entering verify API');

        this.appConfig.hideLoader();
        this.prePoulteEmailId = this.verifyArr[0]['name'];
        this.appConfig.success(`${data.message}`, '');
        this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.LOGIN}`);
      }, (err) => {
        console.log(err);

        if (err.status === 400 && err.error.error === 'This User was not found or invalid') {
          this.appConfig.error(`${err.error.error}`, '');
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.VERIFY.EMAIL_ERROR);
        }
      });
    }, (err) => {
      // if (err.status === 200) {
      //   this.appConfig.setSessionData('csrf', err.error.text);
      // }


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
    const apiData = {
      name: this.loginForm.value.email,
      pass: this.loginForm.value.password
    };

    // Login API
    if (this.loginForm.valid) {
      if (apiData.name && apiData.pass) {
        this.apiService.getAllState().subscribe((datas: any) => {
          this.apiService.login(apiData).subscribe((data: any) => {
            this.appConfig.hideLoader();
            this.appConfig.consoleLog('data', data);
            // this.appConfig.setLocalData('username', "data && data.current_user.name ? data.current_user.name : ''");
            this.appConfig.setLocalData('username', data && data.current_user.name ? data.current_user.name : '');
            this.appConfig.setLocalData('userId', data && data.current_user.uid ? data.current_user.uid : '');
            this.appConfig.setLocalData('userEmail', data && data.current_user.mail ? data.current_user.mail : '');
            this.appConfig.setLocalData('csrf-login', data && data.csrf_token ? data.csrf_token : '');
            this.appConfig.setLocalData('logout-token', data && data.logout_token ? data.logout_token : '');
            this.appConfig.setLocalData('roles', data && data.current_user && data.current_user.roles && data.current_user.roles[1] ? data.current_user.roles[1] : null);
            if (data && data.current_user && data.current_user.roles && (data.current_user.roles[2] == 'institute' || data.current_user.roles[1] == 'institute')) {
              // return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.HOME);
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.TPO_DASHBOARD.HOME);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'administrator') {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.HOME);
              // return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.TPO_DASHBOARD.HOME);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'hr') {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HOME);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'candidate') {
              if (data['form_submmited'] && data['form_submmited'] === '1') {
                this.appConfig.setLocalData('reDirectView', data && ['form_submmited'] && data['form_submmited'] === '1' ? 'true' : 'false');
                this.appConfig.setLocalData('field_isformsubmitted', 'true');
                this.appConfig.setLocalData('personalFormSubmitted', 'true');
                this.appConfig.setLocalData('educationalFormSubmitted', 'true');
                this.appConfig.setLocalData('familyFormSubmitted', 'true');
                this.appConfig.setLocalData('generalFormSubmitted', 'true');
                this.appConfig.setLocalData('confirmFormSubmitted', 'true');
                return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE);
                // return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE);
              } else {
                this.appConfig.setLocalData('reDirectView', data && ['form_submmited'] && data['form_submmited'] === '1' ? 'true' : 'false');
                // return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.HOME);
                return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE);
              }
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'interview_panel') {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.HOME);
            } else {
              // if (data['form_submmited'] && data['form_submmited'] === '1') {

              //   this.appConfig.setLocalData('reDirectView', data && ['form_submmited'] && data['form_submmited'] === '1' ? 'true' : 'false');
              //   this.appConfig.setLocalData('field_isformsubmitted', 'true');
              //   this.appConfig.setLocalData('personalFormSubmitted', 'true');
              //   this.appConfig.setLocalData('educationalFormSubmitted', 'true');
              //   this.appConfig.setLocalData('familyFormSubmitted', 'true');
              //   this.appConfig.setLocalData('generalFormSubmitted', 'true');
              //   this.appConfig.setLocalData('confirmFormSubmitted', 'true');
              //   return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE);
              // } else {
              //   this.appConfig.setLocalData('reDirectView', data && ['form_submmited'] && data['form_submmited'] === '1' ? 'true' : 'false');
              //   return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE);
              // }
            }

          }, (error) => {

          });
        }, (err) => {
          // if (err.status === 200) {
          //   this.appConfig.setSessionData('csrf', err.error.text);
          // }
        });
      }
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
