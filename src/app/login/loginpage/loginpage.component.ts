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
            this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.VERIFY.EMAIL_ERROR}`);
          }
        });
      }
      if (params['mail']) {
        this.prePoulteEmailId = params['mail'];
      } else {
        this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.LOGIN}`);
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

  // After clicking Submit, we hit tao api to insert Test Taker details in TAO
  insertTestTakerAPI(data, email) {

    const apiData = [
      {
        subject: 'http://localhost/tao/tao.rdf#',
        predicate: 'http://www.tao.lu/Ontologies/generis.rdf#password',
        object: 'LNnIsna3nxb55bc88e792c0a4ef2dacedf466bf097a4819ea11f9ae0dfffe9ed7d4c5fd9b0'
      },
      {
        subject: 'http://localhost/tao/tao.rdf#',
        predicate: 'http://www.tao.lu/Ontologies/generis.rdf#userUILg',
        object: data.current_user.name
      },
      {
        subject: 'http://localhost/tao/tao.rdf#',
        predicate: 'http://www.tao.lu/Ontologies/generis.rdf#login',
        object: data.current_user.name
      },
      {
        subject: 'http://localhost/tao/tao.rdf#',
        predicate: 'http://www.tao.lu/Ontologies/generis.rdf#userMail',
        object: email
      },
      {
        subject: 'http://localhost/tao/tao.rdf#',
        predicate: 'http://www.tao.lu/Ontologies/generis.rdf#userLastName',
        object: data.current_user.name
      },
      {
        subject: 'http://localhost/tao/tao.rdf#',
        predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        object: 'http://www.tao.lu/Ontologies/TAOSubject.rdf#Subject'
      },
      {
        subject: 'http://localhost/tao/tao.rdf#',
        predicate: 'http://www.tao.lu/Ontologies/TAO.rdf#UpdatedAt',
        object: '1586670644.7123'
      },
      {
        subject: 'http://localhost/tao/tao.rdf#',
        predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
        object: data.current_user.name
      }
    ];
    this.apiService.insertTestTaker(apiData).subscribe((success) => {
      this.appConfig.consoleLog('success', success);
    }, (err) => {
    });
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
        this.appConfig.setLocalData('username', data.current_user.name);
        this.appConfig.setLocalData('csrf-login', data.csrf_token);
        this.appConfig.setLocalData('logout-token', data.logout_token);
        this.appConfig.routeNavigation('/' + `${CONSTANT.ROUTES.ADMIN_DASHBOARD.HOME}`);

      }, (error) => {
      });

    } else {
      this.validateAllFields(this.loginForm);
    }

  }

  forgotPassword() {
    this.appConfig.routeNavigation('./' + CONSTANT.ROUTES.PASSWORD.FORGOT);
  }

  createAccount() {
    this.appConfig.routeNavigation('./' + CONSTANT.ROUTES.PASSWORD.SETUP);
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
