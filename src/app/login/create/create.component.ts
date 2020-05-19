import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormCustomValidators } from '../../custom-form-validators/autocompleteDropdownMatch';
import { Router } from '@angular/router';
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
  autoPopulateMailId: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService
  ) {
    if (this.router.url === '/' + `${CONSTANT.ROUTES.PASSWORD.RESET}`) {
      this.currentRoute = 'Reset the password';
      this.autoPopulateMailId = this.appConfig.getLocalData('resetAutoPopulateMailId');
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
    }, { validators: FormCustomValidators.identityRevealedValidator }
    ), this.autoPopulateMail(); // Function to auto populate mail after form loads.
  }

  autoPopulateMail() {
    if (this.currentRoute === 'Reset the password') {
      this.createForm.patchValue({
        email: this.autoPopulateMailId
      });
    }
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
        name: this.createForm.value.email,
        temp_pass: this.createForm.value.temp,
        new_pass: this.createForm.value.password
      };

      this.apiService.passwordReset(apiData).subscribe((success: any) => {
        this.appConfig.consoleLog('success', success);
        this.appConfig.success((this.currentRoute.includes('Reset')) ? `Password has been resetted Successfully` :
          `Account has been created Successfully`, '');
        this.currentRoute === 'Reset the password' ? this.appConfig.clearLocalDataOne('autoPopulateMailId') : '';
        this.appConfig.routeNavigation('/' + CONSTANT.ROUTES.LOGIN);
      }, (error) => {
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
