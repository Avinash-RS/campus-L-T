import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import * as moment from 'moment'; //in your component
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-joining-dependent',
  templateUrl: './joining-dependent.component.html',
  styleUrls: ['./joining-dependent.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class JoiningDependentComponent implements OnInit {

  dependentForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  titleDropdownList = [
    {
      id: '0',
      value: 'Mr.'
    },
    {
      id: '1',
      value: 'Ms.'
    }
  ];
  //form Variables
  form_dependentArray = 'dependentArray';
  form_dependent_name = 'dependent_name';
  form_dependent_dob = 'dependent_dob';
  form_dependent_relationship = 'dependent_relationship';
  form_dependent_differently_abled = 'dependent_differently_abled';
  form_dependent_status = 'dependent_status';

  dummyvalues = [
    {
    dependent_name: 'Avinash',
    dependent_dob: '1995-10-29T00:00:00+05:30',
    dependent_relationship: 'Ms.',
    dependent_differently_abled: 'Ms.',
    dependent_status: 'Ms.'
    },
    {
      dependent_name: 'Selva',
      dependent_dob: '2012-10-29T00:00:00+05:30',
      dependent_relationship: 'Mr.',
      dependent_differently_abled: 'Mr.',
      dependent_status: 'Mr.'
      },
      {
        dependent_name: 'Thilaga',
        dependent_dob: '2018-07-25T00:00:00+05:30',
        dependent_relationship: 'Ms.',
        dependent_differently_abled: 'Ms.',
        dependent_status: 'Ms.'
        },
        {
          dependent_name: 'Selva',
          dependent_dob: '2012-01-04T00:00:00+05:30',
          dependent_relationship: 'Mr.',
          dependent_differently_abled: 'Mr.',
          dependent_status: 'Mr.'
          }
  ]
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) { 
    this.dateValidation();
  }

  ngOnInit() {
    this.formInitialize();
      this.patchDependentForm();
  }

  getDependentApiValues() {

  }
  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date(currentYear + 20, 11, 31);
}

momentForm(date) {
if (date) {
  const split = moment(date).format('DD-MM-YYYY');
 return split;    
}
}

dateConvertion(date) {
  if (date) {      
    const split = moment(date).format();
    if (split == 'Invalid date') {
      const ddFormat = moment(date, 'DD-MM-YYYY').format();
      return ddFormat == 'Invalid date' ? null : ddFormat;
    }
   return split == 'Invalid date' ? null : split;
  }
}

  formSubmit() {
    console.log('form', this.dependentForm.value);
    
    if(this.dependentForm.valid) {

    } else {
      this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
    }

  }

  routeNext(route) {

  }

  patchDependentForm() {
    if (this.dummyvalues.length > 1) {
      return this.getDependentArr.push(this.initDependentArray());
    }
    this.getDependentArr.clear();
    this.dummyvalues.forEach((element, i) => {
      this.getDependentArr.push(this.patching(element));
    });
  }

  patching(data) {
    return this.fb.group({
      [this.form_dependent_name]: [data[this.form_dependent_name], [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_dependent_dob]: [this.dateConvertion(data[this.form_dependent_dob])],
      [this.form_dependent_relationship]: [data[this.form_dependent_relationship], [Validators.required]],
      [this.form_dependent_differently_abled]: [data[this.form_dependent_differently_abled]],
      [this.form_dependent_status]: [data[this.form_dependent_status]],
    })    
  }

  formInitialize() {
    this.dependentForm = this.fb.group({
      [this.form_dependentArray]: this.fb.array([])
    })
  }

  initDependentArray() {
    return this.fb.group({
      [this.form_dependent_name]: [null, [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_dependent_dob]: [null],
      [this.form_dependent_relationship]: [null, [Validators.required]],
      [this.form_dependent_differently_abled]: [null],
      [this.form_dependent_status]: [null],
    })    
  }

  addToDependentArray() {
    if (this.dependentForm.valid) {
     return this.getDependentArr.push(this.initDependentArray());
    }
    this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
  }

  removeDependentArray(i) {
    this.getDependentArr.removeAt(i);
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getDependentArr() { return this.dependentForm.get([this.form_dependentArray]) as FormArray; }

  get dependent_name() {
  return this.dependentForm.get(this.form_dependent_name);
  }
  get dependent_dob() {
  return this.dependentForm.get(this.form_dependent_dob);
  }
  get dependent_relationship() {
  return this.dependentForm.get(this.form_dependent_relationship);
  }
  get dependent_differently_abled() {
  return this.dependentForm.get(this.form_dependent_differently_abled);
  }
  get dependent_status() {
  return this.dependentForm.get(this.form_dependent_status);
  }


}
