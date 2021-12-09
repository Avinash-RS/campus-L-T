import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormCustomValidators } from '../../custom-form-validators/autocompleteDropdownMatch';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup;
  toggleVisibility = true;
  toggleVisibilityConfirmPassword = true;
  toggleVisibilityTempPassword = true;
  currentRoute: string;
  passwordTempToken: any;
  prePoulteEmailId: any;
  type: string;
  capsOn: any;
  getCurrentYear = this.appConfig.getCurrentYear();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.router.url.includes(CONSTANT.ENDPOINTS.PASSWORD.RESET)) {
      this.verifyPassword();
      // this.currentRoute = 'Create the password';
    } else {
      // this.currentRoute = 'Reset the password';
    }
  }

  ngOnInit() {
    this.getEncriptedMail();
    this.formInitialize();
  }

  verifyPassword() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['mail'] && params['temp-token']) {
        const ApiData = {
          name: params['mail'],
          temp_token: params['temp-token']
        };
        // this.appConfig.routeNavigation(`/${CONSTANT.ROUTES.PASSWORD.RESET}`);
        this.passwordTempToken = params['temp-token'];
        this.prePoulteEmailId = params['mail'];
        this.currentRoute = 'Create the password';
        if (params['type'] === 'reset') {
          this.type = 'reset';
          this.currentRoute = 'Reset the password';
        }
      } else {
        this.appConfig.error(`Reset password temp token is invalid`, '');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.PASSWORD.FORGOT);
      }
    });
  }

  getEncriptedMail(){
    let apiData = {
      "email_id": this.prePoulteEmailId
    }
    this.apiService.getEmailDecryption(apiData).subscribe((success: any) => {

      if (success) {
        this.prePoulteEmailId = success.decode_id;
      }
      this.autoPopulateMail();     // Function to auto populate mail after form loads.

    }, (error) => {
    });
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
      // temp: ['', [Validators.required]],
      password: ['', [Validators.required, FormCustomValidators.patternValidator()]],
      confirmpassword: ['', [Validators.required]]
    }, { validators: FormCustomValidators.identityRevealedValidator }
    )
    // , this.autoPopulateMail(); // Function to auto populate mail after form loads.
  }

  autoPopulateMail() {
    if (this.currentRoute) {
      this.createForm.patchValue({
        email: this.prePoulteEmailId ? this.prePoulteEmailId : ''
      });
      this.createForm.controls['email'].disable();
    }
  }

  get email() {
    return this.createForm.get('email');
  }
  get password() {
    return this.createForm.get('password');
  }
  // get temp() {
  //   return this.createForm.get('temp');
  // }
  get confirmpassword() {
    return this.createForm.get('confirmpassword');
  }

  submit() {
    if (this.createForm.valid) {
      const apiData = {
        name: this.prePoulteEmailId ? this.prePoulteEmailId : '',
        temp_pass: this.passwordTempToken ? this.passwordTempToken : '',
        new_pass: this.createForm.value.password
      };
      this.apiService.passwordReset(apiData).subscribe((success: any) => {

        // this.appConfig.consoleLog('success', success);
        this.appConfig.success((this.currentRoute.includes('Reset')) ? `Password has been reset successfully` :
          `Account has been created Successfully`, '');
        this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.LOGIN, { mail: apiData.name });
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.createForm);
    }

  }

  signIn() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.LOGIN);
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
