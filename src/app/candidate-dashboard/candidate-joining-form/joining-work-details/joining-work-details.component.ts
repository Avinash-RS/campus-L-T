import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

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
  selector: 'app-joining-work-details',
  templateUrl: './joining-work-details.component.html',
  styleUrls: ['./joining-work-details.component.scss'],
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
  ]
})
export class JoiningWorkDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  workDetailsForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  diffAbledDropdownList = [
    {
      label: 'Yes',
      value: '1'
    },
    {
      label: 'No',
      value: '0'
    }
  ];
  activeDropdownList = [
    {
      label: 'Active',
      value: '1'
    },
    {
      label: 'Inactive',
      value: '0'
    }
  ];
  //form Variables
  form_workDetails = "workDetails";
  form_total_exp_years = "total_exp_years";
  form_total_exp_months = "total_exp_months";
  form_break_in_emp = "break_in_emp";
  form_employed_us = "employed_us";
  form_oc = "oc";
  form_payslip = "payslip";
  form_interviewed_by_us = "interviewed_by_us";
  form_post = "post";
  form_when_interview = "when_interview"
  form_employment_name_address = "employment_name_address";
  form_duration_from = "duration_from";
  form_duration_to = "duration_to";
  form_duration_year = "duration_year";
  form_duration_month = "duration_month";
  form_postion_field = "postion_field";
  form_name_designation_supervisor = "name_designation_supervisor";
  form_nature_work = "nature_work";
  form_gross_emploment = "gross_emploment";
  form_reason_leaving = "reason_leaving";
  form_bgvDetails = "bgvDetails";
  form_convicted_by_Court = "convicted_by_Court";
  form_arrested = "arrested";
  form_prosecuted = "prosecuted";
  form_detention = "detention";
  form_fined_by_court = "fined_by_court";
  form_debarred_exam_university = "debarred_exam_university";
  form_debarred_psc_company = "debarred_psc_company";
  form_court_case_pending = "court_case_pending";
  form_university_case_pending = "university_case_pending";
  form_disciplinary_proceedings = "disciplinary_proceedings";
  form_full_particulars = "full_particulars"

  form_Employment_Array = "Employment"

  workDetails: any;

  isWorkExp = new FormControl(null);
  showWorkExp: any = '0';
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
    this.getWorkApiDetails();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
  }

  changeWorkExp(e) {
    if (e.checked) {
      this.showWorkExp = '1';
    } else {
      this.showWorkExp = '0';
    }
  }

  ngAfterViewInit() {
    this.sharedService.joiningFormActiveSelector.next('work');
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getWorkApiDetails() {
    this.candidateService.joiningFormGetWorkDetails().subscribe((data: any) => {
      this.appConfig.hideLoader();
      if (data) {
        let work = {
          workDetails: data && data.workDetails ? data.workDetails : null,
          Employment: data && data.Employment ? data.Employment : [],
          bgvDetails: data && data.bgvDetails ? data.bgvDetails : null,
        }
        this.showWorkExp = data && data['isworkexp'] =='1' ? '1' : '0';        
        this.isWorkExp.setValue(data && data['isworkexp'] && data['isworkexp'] == '1' ? true : false);
        this.workDetails = work;
        this.patchWorkForm();
      } else {
        this.workDetails = null;
        this.getEmploymentArr.push(this.initEmploymentArray());
      }
    });

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

  momentForm1(date) {
    if (date) {
      const split = moment(date).format();
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


  patchWorkForm() {
    if (this.workDetails && this.workDetails.bgvDetails) {
      this.OtherConditionsPatch(this.workDetails.bgvDetails);
    }
    if (this.workDetails && this.workDetails.workDetails) {
      this.OtherDetailsPatch(this.workDetails.workDetails);
    }
    if (this.workDetails && this.workDetails.Employment && this.workDetails.Employment.length > 0) {
      this.getEmploymentArr.clear();
      this.workDetails.Employment.forEach((element, i) => {
        this.getEmploymentArr.push(this.EmploymentArrayPatch(element));
      });
    } else {
      this.getEmploymentArr.push(this.initEmploymentArray());
    }
  }

  OtherConditionsPatch(data) {
    this.workDetailsForm.patchValue({
      [this.form_convicted_by_Court]: data[this.form_convicted_by_Court] && data[this.form_convicted_by_Court] == '1' ? true : false,
      [this.form_arrested]: data[this.form_arrested] && data[this.form_arrested] == '1' ? true : false,
      [this.form_prosecuted]: data[this.form_prosecuted] && data[this.form_prosecuted] == '1' ? true : false,
      [this.form_detention]: data[this.form_detention] && data[this.form_detention] == '1' ? true : false,
      [this.form_fined_by_court]: data[this.form_fined_by_court] && data[this.form_fined_by_court] == '1' ? true : false,
      [this.form_debarred_exam_university]: data[this.form_debarred_exam_university] && data[this.form_debarred_exam_university] == '1' ? true : false,
      [this.form_debarred_psc_company]: data[this.form_debarred_psc_company] && data[this.form_debarred_psc_company] == '1' ? true : false,
      [this.form_court_case_pending]: data[this.form_court_case_pending] && data[this.form_court_case_pending] == '1' ? true : false,
      [this.form_university_case_pending]: data[this.form_university_case_pending] && data[this.form_university_case_pending] == '1' ? true : false,
      [this.form_disciplinary_proceedings]: data[this.form_disciplinary_proceedings] && data[this.form_disciplinary_proceedings] == '1' ? true : false,
      [this.form_full_particulars]: data[this.form_full_particulars]
    });
    this.requiredDesc();
  }
  
  OtherDetailsPatch(data) {
    this.workDetailsForm.patchValue({
      [this.form_total_exp_years]: data[this.form_total_exp_years],
      [this.form_total_exp_months]: data[this.form_total_exp_months],
      [this.form_break_in_emp]: data[this.form_break_in_emp],
      [this.form_employed_us]: data[this.form_employed_us] && data[this.form_employed_us] == '1' ? '1' : '0',
      [this.form_oc]: data[this.form_oc],
      [this.form_payslip]: data[this.form_payslip],
      [this.form_interviewed_by_us]: data[this.form_interviewed_by_us] && data[this.form_interviewed_by_us] == '1' ? '1' : '0',
      [this.form_post]: data[this.form_post],
      [this.form_when_interview]: this.dateConvertion(data[this.form_when_interview])
    });
    this.requiredValidator(data[this.form_employed_us] && data[this.form_employed_us] == '1' ? '1' : '0', this.form_oc, this.form_payslip);
    this.requiredValidator(data[this.form_interviewed_by_us] && data[this.form_interviewed_by_us] == '1' ? '1' : '0', this.form_post, this.form_when_interview);
    }
  EmploymentArrayPatch(data) {
    return this.fb.group({
      [this.form_employment_name_address]: [data[this.form_employment_name_address], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_duration_from]: [this.dateConvertion(data[this.form_duration_from])],
      [this.form_duration_to]: [this.dateConvertion(data[this.form_duration_to])],
      [this.form_duration_year]: [data[this.form_duration_year]],
      [this.form_duration_month]: [data[this.form_duration_month]],
      [this.form_postion_field]: [data[this.form_postion_field], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_name_designation_supervisor]: [data[this.form_name_designation_supervisor], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_nature_work]: [data[this.form_nature_work], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_gross_emploment]: [data[this.form_gross_emploment], [RemoveWhitespace.whitespace(), this.glovbal_validators.address50()]],
      [this.form_reason_leaving]: [data[this.form_reason_leaving], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
    },
      { validator: FormCustomValidators.WorkanyOneSelected }
    )
  }

  initEmploymentArray() {
    return this.fb.group({
      [this.form_employment_name_address]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_duration_from]: [null],
      [this.form_duration_to]: [null],
      [this.form_duration_year]: [null],
      [this.form_duration_month]: [null],
      [this.form_postion_field]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_name_designation_supervisor]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_nature_work]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_gross_emploment]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address50()]],
      [this.form_reason_leaving]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
    },
      { validator: FormCustomValidators.WorkanyOneSelected }
    )
  }

  formInitialize() {
    this.workDetailsForm = this.fb.group({
      [this.form_convicted_by_Court]: [null],
      [this.form_arrested]: [null],
      [this.form_prosecuted]: [null],
      [this.form_detention]: [null],
      [this.form_fined_by_court]: [null],
      [this.form_debarred_exam_university]: [null],
      [this.form_debarred_psc_company]: [null],
      [this.form_court_case_pending]: [null],
      [this.form_university_case_pending]: [null],
      [this.form_disciplinary_proceedings]: [null],
      [this.form_full_particulars]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_total_exp_years]: [null],
      [this.form_total_exp_months]: [null],
      [this.form_break_in_emp]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_employed_us]: ['0'],
      [this.form_oc]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_payslip]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_interviewed_by_us]: ['0'],
      [this.form_post]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_when_interview]: [null],
      [this.form_Employment_Array]: this.fb.array([])
    })
  }

  addToEmploymentArray() {
    let i = this.getEmploymentArr['controls'].length - 1;
    if (this.getEmploymentArr.valid) {
      if (this.getEmploymentArr && this.getEmploymentArr['controls'] && this.getEmploymentArr['controls'][i] && this.getEmploymentArr['controls'][i]['value'] && this.getEmploymentArr['controls'][i]['value'][this.form_employment_name_address]) {
        return this.getEmploymentArr.push(this.initEmploymentArray());
      } else {
        this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the fields in the Work Details section');
        this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
      }
    } else {
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the fields in the Work Details section');
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);  
    }
}

  removeEmploymentArray(i) {
    this.getEmploymentArr.removeAt(i);
  }

  radioChange(e, form) {
    if (form == 1) {
      this.requiredValidator(e.value, this.form_oc, this.form_payslip);
    } else {
      this.requiredValidator(e.value, this.form_post, this.form_when_interview);
    }
  }

  requiredValidator(value, form, form1) {
    if (value == '1') {
      this.workDetailsForm.get(form).setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]), { emitEvent: false };
      if (form1 == this.form_when_interview) {
        this.workDetailsForm.get(form1).setValidators([Validators.required]), { emitEvent: false };
      } else {
        this.workDetailsForm.get(form1).setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]), { emitEvent: false };
      }
    } else {
      this.workDetailsForm.patchValue({
        [form]: null,
        [form1]: null
      });
      this.workDetailsForm.get(form).clearValidators(), { emitEvent: false };
      this.workDetailsForm.get(form1).clearValidators(), { emitEvent: false };
    }
    this.workDetailsForm.get(form).updateValueAndValidity(), { emitEvent: false };
    this.workDetailsForm.get(form1).updateValueAndValidity(), { emitEvent: false };
  }

  requiredDesc() {
    let formValues = this.workDetailsForm.getRawValue();
    const bgvDetails = {
      [this.form_convicted_by_Court]: formValues[this.form_convicted_by_Court] && (formValues[this.form_convicted_by_Court] == '1' || formValues[this.form_convicted_by_Court] == true) ? '1' : '0',
      [this.form_arrested]: formValues[this.form_arrested] && (formValues[this.form_arrested] == '1' || formValues[this.form_arrested] == true) ? '1' : '0',
      [this.form_prosecuted]: formValues[this.form_prosecuted] && (formValues[this.form_prosecuted] == '1' || formValues[this.form_prosecuted] == true) ? '1' : '0',
      [this.form_detention]: formValues[this.form_detention] && (formValues[this.form_detention] == '1' || formValues[this.form_detention] == true) ? '1' : '0',
      [this.form_fined_by_court]: formValues[this.form_fined_by_court] && (formValues[this.form_fined_by_court] == '1' || formValues[this.form_fined_by_court] == true) ? '1' : '0',
      [this.form_debarred_exam_university]: formValues[this.form_debarred_exam_university] && (formValues[this.form_debarred_exam_university] == '1' || formValues[this.form_debarred_exam_university] == true) ? '1' : '0',
      [this.form_debarred_psc_company]: formValues[this.form_debarred_psc_company] && (formValues[this.form_debarred_psc_company] == '1' || formValues[this.form_debarred_psc_company] == true) ? '1' : '0',
      [this.form_court_case_pending]: formValues[this.form_court_case_pending] && (formValues[this.form_court_case_pending] == '1' || formValues[this.form_court_case_pending] == true) ? '1' : '0',
      [this.form_university_case_pending]: formValues[this.form_university_case_pending] && (formValues[this.form_university_case_pending] == '1' || formValues[this.form_university_case_pending] == true) ? '1' : '0',
      [this.form_disciplinary_proceedings]: formValues[this.form_disciplinary_proceedings] && (formValues[this.form_disciplinary_proceedings] == '1' || formValues[this.form_disciplinary_proceedings] == true) ? '1' : '0',
      [this.form_full_particulars]: formValues[this.form_full_particulars]
    }
    if (bgvDetails[this.form_convicted_by_Court] == '1' || bgvDetails[this.form_arrested] == '1' || bgvDetails[this.form_prosecuted] == '1' || bgvDetails[this.form_detention] == '1' || bgvDetails[this.form_fined_by_court] == '1' || bgvDetails[this.form_debarred_exam_university] == '1' || bgvDetails[this.form_debarred_psc_company] == '1' || bgvDetails[this.form_court_case_pending] == '1' || bgvDetails[this.form_university_case_pending] == '1' || bgvDetails[this.form_disciplinary_proceedings] == '1') {
      this.workDetailsForm.get(this.form_full_particulars).setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]), { emitEvent: false };
    } else {
      this.workDetailsForm.get(this.form_full_particulars).setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]), { emitEvent: false };
    }
    this.workDetailsForm.get(this.form_full_particulars).updateValueAndValidity(), { emitEvent: false };
  }

  formSubmit(routeValue?: any) {
    // this.requiredDesc();
    console.log('form', this.workDetailsForm.getRawValue());
    let formValues = this.workDetailsForm.getRawValue();
    if (this.workDetailsForm.valid) {
      const workDetails = {
        [this.form_total_exp_years]: this.showWorkExp == '1' ? formValues[this.form_total_exp_years] : null,
        [this.form_total_exp_months]: this.showWorkExp == '1' ? formValues[this.form_total_exp_months] : null,
        [this.form_break_in_emp]: this.showWorkExp == '1' ? formValues[this.form_break_in_emp] : null,
        [this.form_employed_us]: formValues[this.form_employed_us] && (formValues[this.form_employed_us] == '1' || formValues[this.form_employed_us] == true) ? '1' : '0',
        [this.form_oc]: formValues[this.form_oc],
        [this.form_payslip]: formValues[this.form_payslip],
        [this.form_interviewed_by_us]: formValues[this.form_interviewed_by_us] && (formValues[this.form_interviewed_by_us] == '1' || formValues[this.form_interviewed_by_us] == true) ? '1' : '0',
        [this.form_post]: formValues[this.form_post],
        [this.form_when_interview]: formValues[this.form_when_interview]
      };
      const bgvDetails = {
        [this.form_convicted_by_Court]: formValues[this.form_convicted_by_Court] && (formValues[this.form_convicted_by_Court] == '1' || formValues[this.form_convicted_by_Court] == true) ? '1' : '0',
        [this.form_arrested]: formValues[this.form_arrested] && (formValues[this.form_arrested] == '1' || formValues[this.form_arrested] == true) ? '1' : '0',
        [this.form_prosecuted]: formValues[this.form_prosecuted] && (formValues[this.form_prosecuted] == '1' || formValues[this.form_prosecuted] == true) ? '1' : '0',
        [this.form_detention]: formValues[this.form_detention] && (formValues[this.form_detention] == '1' || formValues[this.form_detention] == true) ? '1' : '0',
        [this.form_fined_by_court]: formValues[this.form_fined_by_court] && (formValues[this.form_fined_by_court] == '1' || formValues[this.form_fined_by_court] == true) ? '1' : '0',
        [this.form_debarred_exam_university]: formValues[this.form_debarred_exam_university] && (formValues[this.form_debarred_exam_university] == '1' || formValues[this.form_debarred_exam_university] == true) ? '1' : '0',
        [this.form_debarred_psc_company]: formValues[this.form_debarred_psc_company] && (formValues[this.form_debarred_psc_company] == '1' || formValues[this.form_debarred_psc_company] == true) ? '1' : '0',
        [this.form_court_case_pending]: formValues[this.form_court_case_pending] && (formValues[this.form_court_case_pending] == '1' || formValues[this.form_court_case_pending] == true) ? '1' : '0',
        [this.form_university_case_pending]: formValues[this.form_university_case_pending] && (formValues[this.form_university_case_pending] == '1' || formValues[this.form_university_case_pending] == true) ? '1' : '0',
        [this.form_disciplinary_proceedings]: formValues[this.form_disciplinary_proceedings] && (formValues[this.form_disciplinary_proceedings] == '1' || formValues[this.form_disciplinary_proceedings] == true) ? '1' : '0',
        [this.form_full_particulars]: formValues[this.form_full_particulars]
      }
      const Employment = this.showWorkExp == '1' ? this.workDetailsForm.getRawValue()[this.form_Employment_Array] : [];
      let apiData = {
        workDetails,
        bgvDetails,
        Employment,
        isworkexp: this.showWorkExp == '1' ? '1' : '0'
      }
      this.candidateService.joiningFormGetWorkDetailsSave(apiData).subscribe((data: any) => {
        this.appConfig.hideLoader();
        this.appConfig.nzNotification('success', 'Saved', 'Work Experience details has been updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
      });
    } else {
      this.ngAfterViewInit();
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFields(this.workDetailsForm);
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
    }

  }


  saveRequestRxJs() {
    this.sendPopupResultSubscription = this.sharedService.sendPopupResult.subscribe((result: any) => {

      if (result.result == 'save') {
        this.formSubmit(result.route);
      }
    });
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any) => {
      if (data.current == 'work') {
        if (!this.workDetailsForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      }
    });
  }

  routeNext(route) {
    if (!this.workDetailsForm.dirty) {
      if (route == 'education') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
      } else {
        if (this.appConfig.getLocalData('work') == '1') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
        } else {
          if (this.workDetailsForm.valid) {
            return this.sharedService.openJoiningRoutePopUp.next(route == 'education' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
          }
          this.glovbal_validators.validateAllFields(this.workDetailsForm);
          this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
          this.ngAfterViewInit();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'education' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
    }
  }


  detectDateCalc(form, i) {
      let yearCount = 0;
      let monthCount = 0;
      let element = form.value;
      if (element[this.form_duration_from] && element[this.form_duration_to]) {
        let eventStartTime = new Date(`${this.momentForm1(element[this.form_duration_from])}`);
        let eventEndTime = new Date(`${this.momentForm1(element[this.form_duration_to])}`);  
        let m = moment(eventEndTime);
        let years = m.diff(eventStartTime, 'years');
        m.add(-years, 'years');
        let months = m.diff(eventStartTime, 'months');
        m.add(-months, 'months');
        let days = m.diff(eventStartTime, 'days');

        this.getEmploymentArr.at(i).patchValue({
            [this.form_duration_month]: months,
            [this.form_duration_year]: years
        });

          this.getEmploymentArr.getRawValue().forEach(ele => {
          monthCount += Number(ele[this.form_duration_month] ? ele[this.form_duration_month] : 0);
          yearCount += Number(ele[this.form_duration_year] ? ele[this.form_duration_year] : 0);
          if (monthCount > 12) {
            let y; let m;
            y = Math.floor(monthCount / 12);
            m = monthCount % 12;
            this.workDetailsForm.patchValue({
              [this.form_total_exp_years]: yearCount + y,
              [this.form_total_exp_months]: m
            })
          } else {
            this.workDetailsForm.patchValue({
              [this.form_total_exp_years]: yearCount,
              [this.form_total_exp_months]: monthCount
            })
          }
        });

      }
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getEmploymentArr() { return this.workDetailsForm.get([this.form_Employment_Array]) as FormArray; }

  get convicted_by_Court() {
    return this.workDetailsForm.get(this.form_convicted_by_Court);
  }
  get arrested() {
    return this.workDetailsForm.get(this.form_arrested);
  }
  get prosecuted() {
    return this.workDetailsForm.get(this.form_prosecuted);
  }
  get detention() {
    return this.workDetailsForm.get(this.form_detention);
  }
  get fined_by_court() {
    return this.workDetailsForm.get(this.form_fined_by_court);
  }
  get debarred_exam_university() {
    return this.workDetailsForm.get(this.form_debarred_exam_university);
  }
  get debarred_psc_company() {
    return this.workDetailsForm.get(this.form_debarred_psc_company);
  }
  get court_case_pending() {
    return this.workDetailsForm.get(this.form_court_case_pending);
  }
  get university_case_pending() {
    return this.workDetailsForm.get(this.form_university_case_pending);
  }
  get disciplinary_proceedings() {
    return this.workDetailsForm.get(this.form_disciplinary_proceedings);
  }
  get full_particulars() {
    return this.workDetailsForm.get(this.form_full_particulars);
  }
  get total_exp_years() {
    return this.workDetailsForm.get(this.form_total_exp_years);
  }
  get total_exp_months() {
    return this.workDetailsForm.get(this.form_total_exp_months);
  }
  get break_in_emp() {
    return this.workDetailsForm.get(this.form_break_in_emp);
  }
  get employed_us() {
    return this.workDetailsForm.get(this.form_employed_us);
  }
  get oc() {
    return this.workDetailsForm.get(this.form_oc);
  }
  get payslip() {
    return this.workDetailsForm.get(this.form_payslip);
  }
  get interviewed_by_us() {
    return this.workDetailsForm.get(this.form_interviewed_by_us);
  }
  get post() {
    return this.workDetailsForm.get(this.form_post);
  }
  get when_interview() {
    return this.workDetailsForm.get(this.form_when_interview);
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }

}
