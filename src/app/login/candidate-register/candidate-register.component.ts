import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';

@Component({
  selector: 'app-candidate-register',
  templateUrl: './candidate-register.component.html',
  styleUrls: ['./candidate-register.component.scss']
})
export class CandidateRegisterComponent implements OnInit {

  candidateForm: FormGroup;
  toggleVisibility = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
  ) { }

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.candidateForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(emailregex)]],
      password: ['', [Validators.required, FormCustomValidators.patternValidator()]],
    });
  }

  get name() {
    return this.candidateForm.get('name');
  }
  get email() {
    return this.candidateForm.get('email');
  }
  get password() {
    return this.candidateForm.get('password');
  }

  submit() {

    if (this.candidateForm.valid) {
      // API
      const datas = {
        name: [{ value: this.candidateForm.value.name }],
        mail: [{ value: this.candidateForm.value.email }],
        pass: [{value: this.candidateForm.value.password}],
        field_registration_role: [{ target_id: 'candidate' }],
      };
      this.appConfig.consoleLog('Registration Data which is passed to API', datas);

      this.apiService.CandidateRegistrationForm(datas).subscribe((data: any) => {
        this.appConfig.success('Form has been Registered Successfully', '');
        this.appConfig.routeNavigation('/' + CONSTANT.ROUTES.HOME);
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.candidateForm);
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
