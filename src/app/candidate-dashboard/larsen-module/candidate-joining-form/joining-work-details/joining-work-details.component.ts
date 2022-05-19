import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
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
import { SkillsMasterDialogComponent } from 'src/app/candidate-dashboard/helper/skills-master-dialog/skills-master-dialog.component';
import { SkillsAddedListComponent } from 'src/app/candidate-dashboard/helper/skills-added-list/skills-added-list.component';

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
  @ViewChild(SkillsAddedListComponent, {static: false}) skillsListchild;
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
  form_hr_name = 'hr_name';
  form_hr_contact_no = 'hr_contact_no';
  form_hr_email = 'hr_email';
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

  form_Employment_Array = "Employment";
  form_Skills_Array = "skills";
  form_Skill = "skill";

  form_Relatives_Array = "relatives_in_company";
  form_relatives_name = "name";
  form_relatives_position = "position";
  form_relatives_relationship = "relationship";
  form_relatives_company = "company";
  form_faculty_reference = "faculty_reference";
  form_faculty_reference_1 = "faculty_reference1";

  form_is_training_status = "is_intern_status";
  form_training_Array = "intern";
  form_training_employer_name = "employer_name";
  form_training_from_date = "from_date";
  form_training_to_date = "to_date";
  form_training_work_responsiability = "work_responsiability";

  form_training_is_articleship_status = "is_articleship_status";
  form_ca_dateofcompletion = "ca_dateofcompletion";
  form_ca_achivement = "ca_achivement";
  form_is_ca_resaon_suitable = "ca_resaon_suitable";

  workDetails: any;

  isWorkExp = new FormControl(null);
  isRelatives = new FormControl(null);
  showWorkExp: any = '0';
  workDetailsAllData: any;
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  customerName: any;
  skillsList: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService,
    private matDialog: MatDialog
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.customerName = this.appConfig.getSelectedCustomerName();
    this.formInitialize();
    this.getWorkApiDetails();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
  }

  changeWorkExp(e) {
    if (e.checked) {
      this.showWorkExp = '1';
    } else {
      this.showWorkExp = '0';
    }
  }

  changeInIsArticleship(e) {
    if (e.checked) {
    } else {
      this.workDetailsForm['controls'][this.form_ca_dateofcompletion].clearValidators();
      this.workDetailsForm['controls'][this.form_ca_dateofcompletion].updateValueAndValidity();
      this.workDetailsForm['controls'][this.form_training_is_articleship_status].setValue('1');
    }
  }
  changeInTrainingExp(e) {
    if (e.value == '1') {
      this.workDetailsForm['controls'][this.form_ca_dateofcompletion].clearValidators();
      this.workDetailsForm['controls'][this.form_ca_dateofcompletion].updateValueAndValidity();
    }
    if (e.value == '0') {
      this.workDetailsForm['controls'][this.form_ca_dateofcompletion].setValidators([Validators.required]);
      this.workDetailsForm['controls'][this.form_ca_dateofcompletion].updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    this.showStepper();
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  joiningFormDataFromJoiningFormComponentRxjs() {
    this.joiningFormDataPassingSubscription = this.sharedService.joiningFormDataPassing.subscribe((data: any)=> {
       this.getWorkApiDetails();
     });
   }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('work');
  }

  getWorkApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.workDetails = this.candidateService.getLocalexperience_details();
      this.workDetailsAllData = this.candidateService.getLocalexperience_details();
      this.workDetails ? this.ifworkDetails() : this.ifNotworkDetails();
    } else {
      // let apiData = {
      //   form_name: 'joining',
      //   section_name: ''
      // }
      // this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
      //   this.candidateService.saveAllProfileToLocal(data);
      //   this.workDetails = this.candidateService.getLocalexperience_details();
      //   this.workDetailsAllData = this.candidateService.getLocalexperience_details();
      //   this.workDetails ? this.ifworkDetails() : this.ifNotworkDetails();
      // });
    }
  }

  ifworkDetails() {
    let work = {
      workDetails: this.workDetails && this.workDetails.work_details ? this.workDetails.work_details : null,
      Employment: this.workDetails && this.workDetails.employments ? this.workDetails.employments : [],
      bgvDetails: this.workDetails && this.workDetails.bgv_details ? this.workDetails.bgv_details : null,
    }
    this.showWorkExp = this.workDetails && this.workDetails['is_work_exp'] =='1' ? '1' : '0';
    this.isWorkExp.setValue(this.workDetails && this.workDetails['is_work_exp'] && this.workDetails['is_work_exp'] == '1' ? true : false);
    this.workDetails = work;
    this.patchWorkForm();
  }
  ifNotworkDetails() {
    this.workDetails = null;
    this.getEmploymentArr.push(this.initEmploymentArray());
  }
  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 50, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
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

    if (this.workDetailsAllData && this.workDetailsAllData[this.form_Skills_Array] && this.workDetailsAllData[this.form_Skills_Array].length > 0) {
      this.getSkillsArr.clear();
      this.workDetailsAllData[this.form_Skills_Array].forEach(element => {
        element ? this.getSkillsArr.push(this.SkillsArrayPatch(element)) : '';
      });
    }

    if (this.workDetailsAllData && this.workDetailsAllData.relatives_in_company && this.workDetailsAllData.relatives_in_company.length > 0) {
      this.getRelativesArr.clear();
      this.isRelatives.setValue(true);
      this.workDetailsAllData.relatives_in_company.forEach(element => {
        element ? this.getRelativesArr.push(this.RelativesArrayPatch(element)) : '';
      });
    }

    let internArray = this.workDetailsAllData[this.form_training_Array] ? this.workDetailsAllData[this.form_training_Array] : [];
    if (this.workDetailsAllData[this.form_is_training_status] && this.workDetailsAllData[this.form_is_training_status] == 1) {
      this.getTrainingArr.clear();
      if (internArray && internArray.length > 0) {
      internArray.forEach(element => {
        element ? this.getTrainingArr.push(this.TrainingArrayPatch(element)) : '';
      });
      } else {
        this.getTrainingArr.push(this.initTrainingArray());
      }
    }
    this.workDetailsForm.patchValue({
      [this.form_faculty_reference]: this.workDetailsAllData['faculty_references'] && this.workDetailsAllData['faculty_references'][0] ? this.workDetailsAllData['faculty_references'][0] : null,
      [this.form_faculty_reference_1]: this.workDetailsAllData['faculty_references'] && this.workDetailsAllData['faculty_references'][1] ? this.workDetailsAllData['faculty_references'][1] : null,
      [this.form_is_training_status]: this.workDetailsAllData[this.form_is_training_status] && this.workDetailsAllData[this.form_is_training_status] == 1 ? this.workDetailsAllData[this.form_is_training_status] : null,
      [this.form_training_is_articleship_status]: this.workDetailsAllData[this.form_training_is_articleship_status] == 0 ? '0' : '1',
      [this.form_ca_dateofcompletion]: this.workDetailsAllData[this.form_ca_dateofcompletion] ? this.dateConvertion(this.workDetailsAllData[this.form_ca_dateofcompletion]) : null,
      [this.form_ca_achivement]: this.workDetailsAllData[this.form_ca_achivement],
      [this.form_is_ca_resaon_suitable]: this.workDetailsAllData[this.form_is_ca_resaon_suitable]
    });
    this.changeInTrainingExp({value: this.workDetailsForm.value[this.form_training_is_articleship_status]});
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
      [this.form_hr_contact_no]: [data[this.form_hr_contact_no], [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      [this.form_hr_email]: [data[this.form_hr_email], [RemoveWhitespace.whitespace(), Validators.maxLength(255), this.glovbal_validators.email()]],
      [this.form_hr_name]: [data[this.form_hr_name], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
    },
      { validator: FormCustomValidators.WorkanyOneSelectedInJoiningForm }
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
      [this.form_hr_contact_no]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.mobileRegex()]],
      [this.form_hr_email]: [null, [RemoveWhitespace.whitespace(), Validators.maxLength(255), this.glovbal_validators.email()]],
      [this.form_hr_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
    },
      { validator: FormCustomValidators.WorkanyOneSelectedInJoiningForm }
    )
  }

  initSkillsArray() {
    return this.fb.group({
      [this.form_Skill]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.skills255()]]
    })
  }

  SkillsArrayPatch(data) {
    return this.fb.group({
      [this.form_Skill]: [data, [RemoveWhitespace.whitespace(), this.glovbal_validators.skills255()]]
    })
  }

  initTrainingArray() {
    return this.fb.group({
      [this.form_training_employer_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_training_from_date]: [null],
      [this.form_training_to_date]: [null],
      [this.form_training_work_responsiability]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]]
    })
  }

  initRelativesArray() {
    return this.fb.group({
      [this.form_relatives_name]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_relatives_relationship]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_relatives_position]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_relatives_company]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
    })
  }

  RelativesArrayPatch(data) {
    return this.fb.group({
      [this.form_relatives_name]: [data[this.form_relatives_name], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_relatives_relationship]: [data[this.form_relatives_relationship], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_relatives_position]: [data[this.form_relatives_position], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_relatives_company]: [data[this.form_relatives_company], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
    })
  }

  TrainingArrayPatch(data) {
    return this.fb.group({
      [this.form_training_employer_name]: [data[this.form_training_employer_name], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_training_from_date]: [data[this.form_training_from_date]],
      [this.form_training_to_date]: [data[this.form_training_to_date]],
      [this.form_training_work_responsiability]: [data[this.form_training_work_responsiability], [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
    })
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
      [this.form_faculty_reference]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_faculty_reference_1]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_Employment_Array]: this.fb.array([]),
      [this.form_Skills_Array]: this.fb.array([this.initSkillsArray()]),
      [this.form_Relatives_Array]: this.fb.array([this.initRelativesArray()]),
      [this.form_training_Array]: this.fb.array([this.initTrainingArray()]),
      [this.form_is_training_status]: [null],
      [this.form_training_is_articleship_status]: ['1'],
      [this.form_ca_dateofcompletion]: [null],
      [this.form_ca_achivement]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]],
      [this.form_is_ca_resaon_suitable]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]]
    })
  }

  addToEmploymentArray() {
    let i = this.getEmploymentArr['controls'].length - 1;
    if (this.getEmploymentArr.valid) {
      if (this.getEmploymentArr && this.getEmploymentArr['controls'] && this.getEmploymentArr['controls'][i] && this.getEmploymentArr['controls'][i]['value'] && this.getEmploymentArr['controls'][i]['value'][this.form_employment_name_address]) {
        return this.getEmploymentArr.push(this.initEmploymentArray());
      } else {
        this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the fields in the Employment Details');
        this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
      }
    } else {
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the fields in the Employment Details');
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
    }
}

addToTrainingArray() {
  let i = this.getTrainingArr['controls'].length - 1;
  if (this.getTrainingArr.valid) {
    if (this.getTrainingArr && this.getTrainingArr['controls'] && this.getTrainingArr['controls'][i] && this.getTrainingArr['controls'][i]['value'] && (this.getTrainingArr['controls'][i]['value'][this.form_training_employer_name] || this.getTrainingArr['controls'][i]['value'][this.form_training_from_date] || this.getTrainingArr['controls'][i]['value'][this.form_training_to_date] || this.getTrainingArr['controls'][i]['value'][this.form_training_work_responsiability])) {
      return this.getTrainingArr.push(this.initTrainingArray());
    } else {
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill any one of the fields in the Training Details');
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_training_Array]) as FormArray);
    }
  } else {
    this.appConfig.nzNotification('error', 'Not Saved', 'Please evaluate the red highlighted fields in the Training Details');
    this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_training_Array]) as FormArray);
  }
}

  addSkills() {
    let i = this.getSkillsArr['controls'].length - 1;
    if (this.getSkillsArr.valid && this.getSkillsArr['controls'].length < 10) {
      if (this.getSkillsArr && this.getSkillsArr['controls'] && this.getSkillsArr['controls'][i] && this.getSkillsArr['controls'][i]['value'] && this.getSkillsArr['controls'][i]['value'][this.form_Skill]) {
        return this.getSkillsArr.push(this.initSkillsArray());
      }
    } else {
      this.appConfig.nzNotification('error', 'Not Added', 'Please fix all the red highlighted fields in the Skill Section');
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Skills_Array]) as FormArray);
    }
  }

  removeTrainingArray(i) {
    this.getTrainingArr.removeAt(i);
  }

  removeEmploymentArray(i) {
    this.getEmploymentArr.removeAt(i);
  }

  removeSkillsArray(i) {
    this.getSkillsArr.removeAt(i);
  }

  addRelatives() {
    let i = this.getRelativesArr['controls'].length - 1;
    if (this.getRelativesArr.valid && this.getRelativesArr['controls'].length < 3) {
      if (this.getRelativesArr && this.getRelativesArr['controls'] && this.getRelativesArr['controls'][i] && this.getRelativesArr['controls'][i]['value'] && this.getRelativesArr['controls'][i]['value'][this.form_relatives_name]) {
        return this.getRelativesArr.push(this.initRelativesArray());
      } else {
        this.appConfig.nzNotification('error', 'Not Added', 'Please fill the existing Relatives / Acquaintances section');
        this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Skills_Array]) as FormArray);
      }
    } else {
      this.appConfig.nzNotification('error', 'Not Added', 'Please fix all the red highlighted fields in the Relatives / Acquaintances Section');
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Skills_Array]) as FormArray);
    }
  }

  removeRelatives(i) {
    this.getRelativesArr.removeAt(i);
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

  relativesArrayChange(e) {
    if (!e.checked) {
      this.getRelativesArr.clear();
      this.getRelativesArr.push(this.initRelativesArray());
    }
  }

  formSubmit(routeValue?: any) {
    // this.requiredDesc();
    let some = this.showWorkExp == '1' ? this.workDetailsForm.getRawValue()[this.form_Employment_Array] : this.getEmploymentArr.clear();
    let formValues = this.workDetailsForm.getRawValue();
    if (this.workDetailsForm.valid) {
      const work_details = {
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
      const bgv_details = {
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
      const employments = this.showWorkExp == '1' ? this.workDetailsForm.getRawValue()[this.form_Employment_Array] : [];

      let skills = [];
      this.workDetailsForm.getRawValue()[this.form_Skills_Array].forEach(element => {
        if (element && element[this.form_Skill]) {
          skills.push(element[this.form_Skill]);
        }
      });
      let intern = [];
      if (this.workDetailsForm.getRawValue()[this.form_is_training_status] || this.workDetailsForm.getRawValue()[this.form_is_training_status] == 1) {
      this.workDetailsForm.getRawValue()[this.form_training_Array].forEach(element => {
        if (element && (element[this.form_training_employer_name] || element[this.form_training_from_date] || element[this.form_training_to_date] || element[this.form_training_work_responsiability])) {
          element[this.form_training_from_date] = element[this.form_training_from_date] ? this.momentForm(element[this.form_training_from_date]) : null;
          element[this.form_training_to_date] = element[this.form_training_to_date] ? this.momentForm(element[this.form_training_to_date]) : null;
          intern.push(element);
        }
      });
    }

      let faculty_reference1 = this.workDetailsForm.getRawValue()[this.form_faculty_reference];
      let faculty_references2 = this.workDetailsForm.getRawValue()[this.form_faculty_reference_1];
      let faculty_references = [];
      faculty_reference1 ? faculty_references.push(faculty_reference1) : '';
      faculty_references2 ? faculty_references.push(faculty_references2) : '';
      let apiData = {
        work_details,
        bgv_details,
        employments,
        is_work_exp: this.showWorkExp == '1' ? '1' : '0',
        [this.form_training_Array]: intern,
        [this.form_is_training_status]: this.workDetailsForm.getRawValue()[this.form_is_training_status] ? 1 : 0,
        [this.form_training_is_articleship_status]: this.workDetailsForm.getRawValue()[this.form_training_is_articleship_status] && this.workDetailsForm.getRawValue()[this.form_training_is_articleship_status] == '0' ? 0 : 1,
        [this.form_ca_dateofcompletion]: (this.workDetailsForm.getRawValue()[this.form_ca_dateofcompletion] && this.workDetailsForm.getRawValue()[this.form_training_is_articleship_status] && this.workDetailsForm.getRawValue()[this.form_training_is_articleship_status] == '0') ? this.momentForm(this.workDetailsForm.getRawValue()[this.form_ca_dateofcompletion]) : null,
        [this.form_ca_achivement]: this.workDetailsForm.getRawValue()[this.form_ca_achivement],
        [this.form_is_ca_resaon_suitable]: this.workDetailsForm.getRawValue()[this.form_is_ca_resaon_suitable],
        skills,
        relatives_in_company: this.workDetailsForm.getRawValue()[this.form_Relatives_Array],
        faculty_references
      };
      const WorkExperienceApiRequestDetails = {
        form_name: "joining",
        section_name: "experience_details",
        saving_data: apiData
      }

     this.newSaveProfileDataSubscription = this.candidateService.newSaveProfileData(WorkExperienceApiRequestDetails).subscribe((data: any) => {
        this.candidateService.saveFormtoLocalDetails(data.section_name, data.saved_data);
        this.candidateService.saveFormtoLocalDetails('section_flags', data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Work Experience details is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
      });
    } else {
      this.ngAfterViewInit();
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFields(this.workDetailsForm);
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Employment_Array]) as FormArray);
      this.glovbal_validators.validateAllFormArrays(this.workDetailsForm.get([this.form_Skills_Array]) as FormArray);
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
          if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().experience_details == '1') {
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

  openSkillsTab() {
    this.skillsList = this.skillsListchild.selectedSkills;
    console.log('sdad', this.skillsList);  
    const skillTabDialog = this.matDialog.open(SkillsMasterDialogComponent, {
      panelClass: 'skillsTabMaster',
      data: {name: 'larsen', skills: this.skillsListchild.selectedSkills},
      disableClose: true
    });

    skillTabDialog.afterClosed().subscribe((res: any)=> {
      this.skillsList = this.skillsListchild.selectedSkills;
      console.log('sdad', this.skillsList);  
    });
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getRelativesArr() { return this.workDetailsForm.get([this.form_Relatives_Array]) as FormArray; }

  get getSkillsArr() { return this.workDetailsForm.get([this.form_Skills_Array]) as FormArray; }

  get getEmploymentArr() { return this.workDetailsForm.get([this.form_Employment_Array]) as FormArray; }

  get getTrainingArr() { return this.workDetailsForm.get([this.form_training_Array]) as FormArray; }

  get faculty_reference_1() {
    return this.workDetailsForm.get(this.form_faculty_reference_1);
  }

  get faculty_reference() {
    return this.workDetailsForm.get(this.form_faculty_reference);
  }

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

  get is_training_status() {
    return this.workDetailsForm.get(this.form_is_training_status);
  }
  get training_is_articleship_status() {
    return this.workDetailsForm.get(this.form_training_is_articleship_status);
  }
  get ca_dateofcompletion() {
    return this.workDetailsForm.get(this.form_ca_dateofcompletion);
  }
  get ca_achivement() {
    return this.workDetailsForm.get(this.form_ca_achivement);
  }
  get ca_resaon_suitable() {
    return this.workDetailsForm.get(this.form_is_ca_resaon_suitable);
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
    this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
    this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
    }

}
