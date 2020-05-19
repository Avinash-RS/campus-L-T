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

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit {

  filteredCities: Observable<any[]>;
  filteredStates: Observable<any[]>;
  openDrop = false;
  registerForm: FormGroup;
  currentForm;
  allCities: any;
  allStates: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private appConfig: AppConfigService
  ) {
    if (this.router.url === '/' + `${CONSTANT.ROUTES.REGISTER.CORPORATE}`) {
      this.currentForm = 'corporate';
    } else {
      this.currentForm = 'institute';
    }

  }

  ngOnInit() {
    this.FormRegister();
    // To reduce load speee, On first time, we hit api and stored that value on local storage.
    // On Subsquent refreshes or redirects, it will take value from local storage itself.
    if (this.appConfig.getLocalData('allStates') && this.appConfig.getLocalData('allCities')) {
      this.allCities = JSON.parse(this.appConfig.getLocalData('allCities'));
      this.allStates = JSON.parse(this.appConfig.getLocalData('allStates'));

      // update validations for state and city form control
      // Updating State Form control validation
      this.registerForm.controls['state'].setValidators([Validators.required, FormCustomValidators.statevalueSelected(this.allStates)]);
      this.registerForm.controls['state'].updateValueAndValidity();
      // Updating City Form control validation
      this.registerForm.controls['city'].setValidators([Validators.required, FormCustomValidators.cityvalueSelected(this.allCities)]);
      this.registerForm.controls['city'].updateValueAndValidity();

    } else {
      // If value not found on local storage, we hit api
      this.cityAPI();
      this.stateAPI();
    }


    this.autocomplete();
  }


  autocomplete() {
    // tslint:disable-next-line: no-non-null-assertion
    this.filteredCities = this.registerForm.get('city')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this.city_filter(name, this.allCities) : this.allCities ? this.allCities.slice() : '')
    );

    // tslint:disable-next-line: no-non-null-assertion
    this.filteredStates = this.registerForm.get('state')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this.state_filter(name, this.allStates) : this.allStates ? this.allStates.slice() : '')
    );

  }

  citydisplayFn(user): string {
    return user && user.City ? user.City : '';
  }
  statedisplayFn(user): string {
    return user && user.state ? user.state : '';
  }

  private city_filter(name: string, paramArrayFromAutoComplete): any[] {
    const filterValue = name.toLowerCase();

    return paramArrayFromAutoComplete.filter(option => option.City.toLowerCase().indexOf(filterValue) === 0);
  }
  private state_filter(name: string, paramArrayFromAutoComplete): any[] {
    const filterValue = name.toLowerCase();

    return paramArrayFromAutoComplete.filter(option => option.state.toLowerCase().indexOf(filterValue) === 0);
  }


  openDropdown(event, trigger: MatAutocompleteTrigger) {
    if (trigger.panelOpen) {
      event.stopPropagation();
      trigger.closePanel();
    } else {
      event.stopPropagation();
      trigger.openPanel();
    }
  }

  FormRegister() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobileRegex: RegExp = /^[1-9][0-9]{9}$/;
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern(mobileRegex)]],
      corporateName: ['', [Validators.required]],
      corporateEmail: ['', [Validators.required, Validators.pattern(emailregex)]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      comment: ['']
    });
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

  onSubmit(val) {
    if (this.registerForm.valid) {
      // API
      const datas = {
        name: [{ value: this.registerForm.value.firstName }],
        mail: [{ value: this.registerForm.value.corporateEmail }],
        roles: [{ target_id: this.currentForm }],
        field_first_name: [{ value: this.registerForm.value.firstName }],
        field_lname: [{ value: this.registerForm.value.lastName }],
        field_job_title: [{ value: this.registerForm.value.jobTitle }],
        field_mobile_number: [{ value: this.registerForm.value.mobileNumber }],
        field_institute_name: [{ value: this.registerForm.value.corporateName }],
        field_institute_email: [{ value: this.registerForm.value.corporateEmail }],
        field_state: [{ value: this.registerForm.value.state.state }],
        field_city: [{ value: this.registerForm.value.city.City }],
        field_comments: [{ value: this.registerForm.value.comment }]
      };
      this.appConfig.consoleLog('Registration Data which is passed to API', datas);

      this.apiService.RegistrationForm(datas).subscribe((data: any) => {
        this.appConfig.success(`Form has been Registered Successfully`, '');
        this.appConfig.routeNavigation('/' + CONSTANT.ROUTES.HOME);
      }, (error) => {
      });
    } else {
      this.validateAllFields(this.registerForm);
    }
  }


  // To get all cities
  cityAPI() {
    this.apiService.getAllCity().subscribe((data) => {
      this.allCities = data;
      this.appConfig.setLocalData('allCities', JSON.stringify(this.allCities));

      // Updating Form control validation
      this.registerForm.controls['city'].setValidators([Validators.required, FormCustomValidators.cityvalueSelected(this.allCities)]);
      this.registerForm.controls['city'].updateValueAndValidity();

    }, (err) => {
    });
  }

  // To get all cities
  stateAPI() {
    this.apiService.getAllState().subscribe((data) => {
      const stateArr = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const datas = {
            name: data[key],
            state: data[key]
          };
          stateArr.push(datas);
        }
      }
      this.allStates = stateArr;
      this.appConfig.setLocalData('allStates', JSON.stringify(this.allStates));

      // Updating Form control validation
      this.registerForm.controls['state'].setValidators([Validators.required, FormCustomValidators.statevalueSelected(this.allStates)]);
      this.registerForm.controls['state'].updateValueAndValidity();

    }, (err) => {
    });
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
