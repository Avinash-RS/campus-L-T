import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';

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
  selector: 'app-shared-off-campus-profile',
  templateUrl: './off-campus-profile.component.html',
  styleUrls: ['./off-campus-profile.component.scss'],
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
export class OffCampusProfileComponent implements OnInit {

  offCampusRegistrationForm: FormGroup;

  // Gender DropDown List
  genderDropdownList = [
    {
      label: 'Male',
      value: 'Male'
    },
    {
      label: 'Female',
      value: 'Female'
    },
    {
      label: 'Others',
      value: 'Others'
    }
  ];
  
  form_name = 'name';
  form_email = 'email';
  form_mobile = 'mobile';
  form_dob = 'dob';
  form_gender = 'gender';
  form_education_10th_percentage = '10thPercentage';
  form_education_12th_percentage = '12thPercentage';
  form_education_UG_clg_name = 'clg_name';
  form_education_UG_clg_qualification = 'clg_qualification';
  form_education_UG_clg_discipline = 'clg_discipline';
  form_education_UG_clg_year_passing = 'clg_year_passing';
  form_education_UG_clg_marks = 'clg_marks';
  form_education_UG_clg_backlogs = 'clg_backlogs';
  form_resume = 'resume';
  form_t_c = 'terms';

  form_file_path = 'file_path';
  form_file_type = 'filetype';
  form_file_size = 'file_size';
  form_file_name = 'filename';
  form_file_id = 'file_id';
  form_label = 'label';
  minDateDOB: Date;
  passportDateOfIssueMaxDate: Date;



  constructor(
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private gv: GlobalValidatorService
  ) { }

  ngOnInit() {
    this.registrationFormInit();
  }

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDateDOB = new Date(currentYear - 90, 0, 1);
    this.passportDateOfIssueMaxDate = new Date();
    // this.maxDate = new Date(currentYear + 20, 11, 31);
    // this.passportValidminDate = new Date(currentYear - 15, 0, 1);
    // this.passportValidmaxDate = new Date(currentYear + 40, 0, 1);
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


  offCampusFormSubmit() {

  }

  registrationFormInit() {
    this.offCampusRegistrationForm = this.fb.group({
      [this.form_name]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.alphaNum255()]],
      [this.form_email]: [null, [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(255), this.gv.email()]],
      [this.form_mobile]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.mobileRegex()]],
      [this.form_dob]: [null, [Validators.required]],
      [this.form_gender]: [null, [Validators.required]],
      [this.form_education_10th_percentage]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.percentageNew(), this.gv.percentage(), Validators.maxLength(5)]],
      [this.form_education_12th_percentage]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.percentageNew(), this.gv.percentage(), Validators.maxLength(5)]],
      [this.form_education_UG_clg_name]: [null, [Validators.required]],
      [this.form_education_UG_clg_qualification]: [null, [Validators.required]],
      [this.form_education_UG_clg_discipline]: [null, [Validators.required]],
      [this.form_education_UG_clg_year_passing]: [null, [Validators.required]],
      [this.form_education_UG_clg_marks]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.percentageNew(), this.gv.percentage(), Validators.maxLength(5)]],
      [this.form_education_UG_clg_backlogs]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.backlog()]],
      [this.form_resume]: this.initResumeArray(),
      [this.form_t_c]: [null, [Validators.requiredTrue]]
    })
  }

  initResumeArray() {
    return this.fb.group({
      [this.form_label]: ['Resume'],
      [this.form_file_size]: [null],
      [this.form_file_path]: [null, [Validators.required]],
      [this.form_file_name]: [null],
      [this.form_file_type]: [null],
      [this.form_file_id]: [null],
    })
  }

  get name() {
    return this.offCampusRegistrationForm.get(this.form_name);
  }
  get email() {
    return this.offCampusRegistrationForm.get(this.form_email);
  }
  get mobile() {
    return this.offCampusRegistrationForm.get(this.form_mobile);
  }
  get dob() {
    return this.offCampusRegistrationForm.get(this.form_dob);
  }
  get gender() {
    return this.offCampusRegistrationForm.get(this.form_gender);
  }
  get education_10th_percentage() {
    return this.offCampusRegistrationForm.get(this.form_education_10th_percentage);
  }
  get education_12th_percentage() {
    return this.offCampusRegistrationForm.get(this.form_education_12th_percentage);
  }
  get education_UG_clg_name() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_name);
  }
  get education_UG_clg_qualification() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_qualification);
  }
  get education_UG_clg_discipline() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_discipline);
  }
  get education_UG_clg_year_passing() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_year_passing);
  }
  get education_UG_clg_marks() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_marks);
  }
  get education_UG_clg_backlogs() {
    return this.offCampusRegistrationForm.get(this.form_education_UG_clg_backlogs);
  }
  get resume() {
    return this.offCampusRegistrationForm.get(this.form_resume);
  }
  get filepath() {
    return this.offCampusRegistrationForm.get(this.form_resume[this.form_file_path]);
  }
  get t_c() {
    return this.offCampusRegistrationForm.get(this.form_t_c);
  }

}
