import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Subscription } from 'rxjs';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {

  loginForm: FormGroup;
  isProduction = environment.production;
  isWebrtc;
  toggleVisibility = true;
  toggleVisibilityConfirmPassword = true;
  subscribe1: Subscription;
  prePoulteEmailId: any;
  capsOn; any;
  verifyArr = [];
  disableLogin = false;
  getCurrentYear = this.appConfig.getCurrentYear();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private candidateService: CandidateMappersService,
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

        this.verifyArr.push({
          name: params['mail'],
          temp_token: params['temp-token']
        });
        this.apiCalling();
      }
      if (params['mail']) {
        this.prePoulteEmailId = params['mail'];
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.LOGIN);
      }
    });
  }

  apiCalling() {
    // this.apiService.getAllState().subscribe((datas: any) => {
    // this.candidateService.getEducationList().subscribe((datas: any) => {
      this.apiService.emailVerification(this.verifyArr[0]).subscribe((data: any) => {


        this.prePoulteEmailId = this.verifyArr[0]['name'];
        this.appConfig.success(`${data.message}`, '');
        this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.LOGIN}`);
      }, (err) => {

        if (err.status === 400 && err.error.error === 'This User was not found or invalid') {
          this.appConfig.error(`${err.error.error}`, '');
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.VERIFY.EMAIL_ERROR);
        }
      });
    // }, (err) => {
      // if (err.status === 200) {
      //   this.appConfig.setSessionData('csrf', err.error.text);
      // }


    // });
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
    this.disableLogin = true;
    const apiData = {
      name: this.loginForm.value.email,
      pass: this.loginForm.value.password
    };

    // Login API
    if (this.loginForm.valid) {
      if (apiData.name && apiData.pass) {
          this.apiService.login(apiData).subscribe((data: any) => {

            this.isProduction ? this.appConfig.setLocalData('webrtc', 'true') : this.isWebrtc ? this.appConfig.setLocalData('webrtc', 'true') : this.appConfig.setLocalData('webrtc', 'true');
            this.appConfig.setLocalData('username', data && data.current_user.name ? data.current_user.name : '');
            this.appConfig.setLocalData('userId', data && data.current_user.uid ? data.current_user.uid : '');
            this.appConfig.setLocalData('userEmail', data && data.current_user.mail ? data.current_user.mail : '');
            this.appConfig.setLocalData('csrf-login', data && data.csrf_token ? data.csrf_token : '');
            this.appConfig.setLocalData('logout-token', data && data.logout_token ? data.logout_token : '');
            this.appConfig.setLocalData('masters', data && data.master_list && data.master_list.data ? JSON.stringify(data.master_list.data) : '');
            this.appConfig.setLocalData('roles', data && data.current_user && data.current_user.roles && data.current_user.roles[1] ? data.current_user.roles[1] : null);

            this.appConfig.setLocalData('driveId', data && data['drives'] && data['drives'][0] && data['drives'][0]['drive_id'] ? data['drives'][0]['drive_id'] : null);
            this.appConfig.setLocalData('driveList', data && data['drives'] && data['drives'].length > 0 ? JSON.stringify(data['drives']) : []);

            if (data && data.current_user && data.current_user.roles && (data.current_user.roles[2] == 'institute' || data.current_user.roles[1] == 'institute')) {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.TPO_DASHBOARD.HOME);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'administrator') {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.HOME);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'hr') {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HOME);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'ic') {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.BUSINESSROUTE);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'ssc_hr') {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.BUSINESSROUTE);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'interview_panel') {
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.HOME);
            }
            if (data && data.current_user && data.current_user.roles && data.current_user.roles[1] === 'candidate') {
              this.appConfig.setLocalData('driveId', data && data['active_drive_id'] && data['active_drive_id'] ? data['active_drive_id'] : null);
              this.appConfig.setLocalData('secondShortlist', data && data['second_shortlist'] && data['second_shortlist'] == '1' ? 'true' : 'false');
              this.appConfig.setLocalData('joiningFormAccess', data && data['joiningform'] && data['joiningform'] == '1' ? 'true' : 'false');
              this.appConfig.setLocalData('firstShortlist', data && data['first_shortlist'] && data['first_shortlist'] == '1' ? 'true' : 'false');
              this.appConfig.setLocalData('form_submmited', data && data['form_submmited'] && data['form_submmited'] == '1' ? 'true' : 'false');
              this.appConfig.setLocalData('isKYCNotExempted', data && data['is_kyc_exempted'] && data['is_kyc_exempted'] == 1 ? 'false' : 'true');
              return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING);
            } else {
            }
          }, (error) => {
            this.disableLogin = false;
          });
      }
    } else {
      this.disableLogin = false;
      this.validateAllFields(this.loginForm);
    }


  }

  forgotPassword() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.PASSWORD.FORGOT);
  }

  createAccount() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.PASSWORD.SETUP);
  }
  candidateSignup() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.REGISTER.CANDIDATE);
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
