import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormCustomValidators } from '../../custom-form-validators/autocompleteDropdownMatch';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit {

  openDrop = false;
  registerForm: FormGroup;
  currentForm;
  allStatess: any;
  allCitiess: any;
  hideCityDropDown = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService
  ) {
    if (this.router.url === CONSTANT.ENDPOINTS.REGISTER.CORPORATE) {
      this.currentForm = 'corporate';
    } else {
      this.currentForm = 'institute';
    }

  }

  ngOnInit() {
    this.FormRegister();
    this.updatedStateAPI();
  }

  updatedStateAPI() {
    const datas = {
      country_id: '101'
    };
    this.candidateService.updatedState(datas).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.allStatess = data[0];

    }, (err) => {

    });
  }

  detectStateSelectChange(data) {

    if (data.value) {
      const ApiData = {
        state_id: data.value
      };
      this.registerForm.patchValue({
        city: null
      });
      this.getUpdatedCity(ApiData);
    } else {
      this.registerForm.patchValue({
        city: null
      });
      this.allCitiess = [];
      this.hideCityDropDown = true;
    }
  }


  // To get all cities
  getUpdatedCity(ApiData) {
    this.candidateService.updatedCity(ApiData).subscribe((datas: any) => {
      this.hideCityDropDown = false;
      this.appConfig.hideLoader();
      this.allCitiess = datas[0];
    }, (err) => {
    });
  }


  FormRegister() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
    const onlyAlpha: RegExp = /^[a-zA-Z ]*$/;
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(onlyAlpha), RemoveWhitespace.whitespace()]],
      lastName: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(onlyAlpha), RemoveWhitespace.whitespace()]],
      jobTitle: ['', [Validators.required, Validators.maxLength(255), RemoveWhitespace.whitespace()]],
      mobileNumber: ['', [Validators.required, Validators.pattern(mobileRegex)]],
      corporateName: ['', [Validators.required, Validators.maxLength(255), RemoveWhitespace.whitespace()]],
      corporateEmail: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(emailregex)]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      comment: ['', [Validators.maxLength(255)]]
    });
  }

  onSubmit(val) {
    if (this.registerForm.valid) {
      let cityName: any;
      let stateName: any;
      this.allCitiess.forEach(element => {
        if (element && element['id'] === this.registerForm.value.city) {
          cityName = element['name'];
        }
      });
      this.allStatess.forEach(element => {
        if (element && element['id'] === this.registerForm.value.state) {
          stateName = element['name'];
        }
      });
      // API
      // name: [{ value: this.registerForm.value.firstName }],
      // mail: [{ value: this.registerForm.value.corporateEmail }],
      const datas = {
        pass: '1234d56',
        name: this.registerForm.value.firstName,
        field_user_name: this.registerForm.value.firstName,
        roles: [{ target_id: this.currentForm }],
        field_ins_first_name: this.registerForm.value.firstName,
        field_ins_last_name: this.registerForm.value.lastName,
        field_ins_job_title: this.registerForm.value.jobTitle,
        field_ins_mobile_number: this.registerForm.value.mobileNumber,
        field_institute_name: this.registerForm.value.corporateName,
        field_institute_email: this.registerForm.value.corporateEmail,
        field_institute_state: stateName ? stateName : '',
        field_institute_city: cityName ? cityName : '',
        field_institute_comments: this.registerForm.value.comment
      };
      this.appConfig.consoleLog('Registration Data which is passed to API', datas);

      this.apiService.RegistrationForm(datas).subscribe((data: any) => {
        this.appConfig.hideLoader();
        this.appConfig.success(`Form has been Registered Successfully`, '');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.registerForm);
    }
  }


  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get jobTitle() {
    return this.registerForm.get('jobTitle');
  }
  get mobileNumber() {
    return this.registerForm.get('mobileNumber');
  }
  get corporateName() {
    return this.registerForm.get('corporateName');
  }
  get corporateEmail() {
    return this.registerForm.get('corporateEmail');
  }
  get state() {
    return this.registerForm.get('state');
  }
  get city() {
    return this.registerForm.get('city');
  }
  get comment() {
    return this.registerForm.get('comment');
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
