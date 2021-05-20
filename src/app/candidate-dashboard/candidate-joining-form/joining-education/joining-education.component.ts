import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import * as moment from 'moment'; //in your component
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';

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
export const MY_FORMATS_Month = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-joining-education',
  templateUrl: './joining-education.component.html',
  styleUrls: ['./joining-education.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS || MY_FORMATS_Month },
  ],
})
export class JoiningEducationComponent implements OnInit, AfterViewInit, OnDestroy {

  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  educationForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  boardsList = DropdownListForKYC['boards'];
  HSCDiscipline = DropdownListForKYC['HSCDiscipline'];
  diplamoSpecialization = [
    {
      label: 'Diploma Engineering',
      value: 'Diploma Engineering'
    }
  ]

  modesList = [
    {
      label: 'Full time',
      value: 'fulltime'
    },
    {
      label: 'Part-time',
      value: 'parttime'
    }
  ]
  diffAbledDropdownList = [
    {
      label: 'Yes',
      value: 'yes'
    },
    {
      label: 'No',
      value: 'no'
    }
  ];
  activeDropdownList = [
    {
      label: 'Active',
      value: 'active'
    },
    {
      label: 'Inactive',
      value: 'inactive'
    }
  ];
  //form Variables
  form_educationArray = 'educationArray';
  form_qualification_type = 'level';
  form_qualification = 'specification';
  form_specialization = 'discipline';
  form_collegeName = 'institute';
  form_boardUniversity = 'board_university';
  form_startDate = 'start_date';
  form_endDate = 'end_date';
  form_yearpassing = 'year_of_passing';
  form_backlog = 'backlogs';
  form_mode = 'mode';
  form_cgpa = 'percentage';

  educationLevels: any;
  pgSpecializationList: any;
  ugSpecializationList: any;
  diplomaDisciplineList: any;
  pgDisciplineList: any;
  ugDisciplineList: any;
  diplomaInstitutesList: any;
  pgInstitutesList: any;
  ugInstitutesList: any;

educationDetails: any;
mastersList: any;
selectedPost: any;
selectedPostLabel: any;
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
    this.getSelectedPost();
    this.formInitialize();
    // Getting required datas for dropdowns
    this.getEducationLevels();
    this.getUGSpecialization();
    this.getPGSpecialization();
    this.getDiplomaDiscipline();
    this.getUGDiscipline();
    this.getPGDiscipline();
    this.getDiplomaInstitutes();
    this.getUGandPGInstitutes();
    this.getEducationApiDetails();
    // End of Getting required datas for dropdowns
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
  }

  ngAfterViewInit() {
    this.sharedService.joiningFormActiveSelector.next('education');
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  chosenYearHandler(normalizedYear: Moment, i) {
    const ctrlValue = this.getEducationArr['value'][i][this.form_yearpassing];    
    if (ctrlValue) {
      ctrlValue.year(normalizedYear.year());
      console.log('ctrlValue', ctrlValue);
      this.getEducationArr.at(i).patchValue({
        [this.form_yearpassing]: ctrlValue,
      });    
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, i) {
    if (this.dateConvertion(normalizedMonth['_d'])) {
    this.getEducationArr.at(i).patchValue({
      [this.form_yearpassing]: this.dateConvertionMonth(normalizedMonth['_d']),
    });      
  }
    datepicker.close();
  }

  getSelectedPost() {
    this.mastersList = localStorage.getItem('masters') ? JSON.parse(localStorage.getItem('masters')) : '';
    this.selectedPost = localStorage.getItem('selectedPost') ? localStorage.getItem('selectedPost') : '';
    this.mastersList?.education_master.forEach(element => {
      if (element.value == this.selectedPost) {
        this.selectedPostLabel = element.label;
      }  
    });
  }

  getEducationApiDetails() {
    this.candidateService.joiningFormGetEducationDetails().subscribe((data: any)=> {
      this.appConfig.hideLoader();
      if (data && data.education &&  data.education.length > 0) {
        this.educationDetails = data.education;
        this.patchEducationForm();
      } else {
        this.educationDetails = [];
        this.initalPatchWithValidations();
      }
    });
  }

  initalPatchWithValidations() {
    for (let index = 0; index < 1; index++) {
      this.getEducationArr.push(this.initEducationArray());
      this.getEducationArr.at(0).patchValue({
        [this.form_qualification_type]: 'SSLC',
      });  
      this.setValidations();
    }
  }
  
  
    educationLevelChange(i) {
        this.getEducationArr.at(i).patchValue({
          [this.form_qualification]: null,
          [this.form_specialization]: null,
          [this.form_collegeName]: null,
          [this.form_boardUniversity]: null,
          [this.form_startDate]: null,
          [this.form_endDate]: null,
          [this.form_yearpassing]: null,
          [this.form_backlog]: null,
          [this.form_mode]: null,
          [this.form_cgpa]: null
          });
     return this.setValidations();
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

dateConvertionMonth(date) {
  if (date) {      
    const split = moment(date).format();
    if (split == 'Invalid date') {
      const ddFormat = moment(date, 'DD-MM-YYYY').format();
      return ddFormat == 'Invalid date' ? null : ddFormat;
    }
   return split == 'Invalid date' ? null : split;
  }
}


validSelectedPost() {
  let valid;
    let value = {
      hscDiploma: false,
      ug: false,
      pg: false,
      label: ''
    };
    if (this.selectedPost == 'det') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
      });
      valid = value.hscDiploma ? true : false;
      value.label = 'det';
      return {
        valid,
        value
      }
    }

    if (this.selectedPost == 'gct' || this.selectedPost == 'get') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'HSC' || element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
          value.ug = true;
        }
      });
      valid = value.hscDiploma && value.ug ? true : false;
      value.label = 'gct';
      return {
        valid,
        value
      }
    }
    if (this.selectedPost == 'pgct' || this.selectedPost == 'pget' || this.selectedPost == 'pgt') {
      this.getEducationArr.controls.forEach((element: any, j) => {
        if (element['controls'][this.form_qualification_type]['value'] == 'HSC' || element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
          value.hscDiploma = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
          value.ug = true;
        }
        if (element['controls'][this.form_qualification_type]['value'] == 'PG') {
          value.pg = true;
        }
      });
      valid = value.hscDiploma && value.ug && value.pg ? true : false;
      value.label = 'pgct';
      return {
        valid,
        value
      }
    }

}
  formSubmit(routeValue?: any) {
    console.log(this.educationForm.getRawValue());
    if (this.educationForm.valid) {
      let entryValid = this.validSelectedPost();
      if (entryValid.valid) {
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
      } else {
        this.appConfig.nzNotification('error', 'Not Submitted', entryValid?.value?.label == 'gct' ? '12th or Diploma and Undergraduate are mandatory' : entryValid?.value?.label == 'pgct' ? '12th or Diploma, Undergraduate and Postgraduate are mandatory' : entryValid?.value?.label == 'det' ? 'Diploma is mandatory' : '');
      }
    } else {
      this.ngAfterViewInit();
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFormArrays(this.educationForm.get([this.form_educationArray]) as FormArray);
    }

  }

  saveRequestRxJs() {
    this.sendPopupResultSubscription =  this.sharedService.sendPopupResult.subscribe((result: any)=> {
      
      if (result.result == 'save') {
      this.formSubmit(result.route);
      }     
    });
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any)=> {
      if(data.current == 'education') {
        if (!this.educationForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      } 
    });
  }

  routeNext(route) {
    if (!this.educationForm.dirty) {
      if (route == 'dependent') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
      } else {
        if (this.appConfig.getLocalData('education') == '1') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
        } else {
         if (this.educationForm.valid) {
          return this.sharedService.openJoiningRoutePopUp.next(route == 'dependent' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
         }
          this.glovbal_validators.validateAllFormArrays(this.educationForm.get([this.form_educationArray]) as FormArray);
          this.ngAfterViewInit();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'dependent' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
    }
  }

  patchEducationForm() {
    this.getEducationArr.clear();
    this.educationDetails.forEach((element, i) => {
      this.getEducationArr.push(this.patching(element));
    });
    this.setValidations();
  }

  patching(data) {
    return this.fb.group({
      [this.form_qualification_type]: [data[this.form_qualification_type], [Validators.required]],
      [this.form_qualification]: [data[this.form_qualification], [Validators.required]],
      [this.form_specialization]: [data[this.form_specialization], [Validators.required]],
      [this.form_collegeName]: [data[this.form_collegeName], [Validators.required]],
      [this.form_boardUniversity]: [data[this.form_boardUniversity], [Validators.required]],
      [this.form_startDate]: [this.dateConvertion(data[this.form_startDate]), [Validators.required]],
      [this.form_endDate]: [this.dateConvertion(data[this.form_endDate]), [Validators.required]],
      [this.form_yearpassing]: [this.dateConvertionMonth(data[this.form_yearpassing]), [Validators.required]],
      [this.form_backlog]: [data[this.form_backlog], [Validators.required, this.glovbal_validators.backlog(), RemoveWhitespace.whitespace()]],
      [this.form_mode]: [data[this.form_mode], [Validators.required]],
      [this.form_cgpa]: [data[this.form_cgpa], [Validators.required, this.glovbal_validators.percentage(), RemoveWhitespace.whitespace()]],
    })    
  }

  initEducationArray() {
    return this.fb.group({
      [this.form_qualification_type]: [null, [Validators.required]],
      [this.form_qualification]: [null, [Validators.required]],
      [this.form_specialization]: [null, [Validators.required]],
      [this.form_collegeName]: [null, [Validators.required]],
      [this.form_boardUniversity]: [null, [Validators.required]],
      [this.form_startDate]: [null, [Validators.required]],
      [this.form_endDate]: [null, [Validators.required]],
      [this.form_yearpassing]: [null, [Validators.required]],
      [this.form_backlog]: [null, [Validators.required, this.glovbal_validators.backlog(), RemoveWhitespace.whitespace()]],
      [this.form_mode]: [null, [Validators.required]],
      [this.form_cgpa]: [null, [Validators.required, this.glovbal_validators.percentage(), RemoveWhitespace.whitespace()]],
    })      
  }

  formInitialize() {
    this.educationForm = this.fb.group({
      [this.form_educationArray]: this.fb.array([])
    })
  }

  addToEducationArray() {
    if (this.educationForm.valid) {
     return this.getEducationArr.push(this.initEducationArray());
    }
    this.glovbal_validators.validateAllFormArrays(this.educationForm.get([this.form_educationArray]) as FormArray);
  }

  removeEducationArray(i) {
    this.getEducationArr.removeAt(i);
  }

  // Form getters
  // convenience getters for easy access to form fields
  get getEducationArr() { return this.educationForm.get([this.form_educationArray]) as FormArray; }

  setValidations() {
      this.getEducationArr.controls.forEach((element: any, j) => {
      if (element['controls'][this.form_qualification_type]['value'] == 'SSLC') {
        // Disable
        element['controls'][this.form_qualification_type].disable({ emitEvent: false });
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_collegeName].setValidators([Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
        }
      if (element['controls'][this.form_qualification_type]['value'] == 'HSC') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_qualification].setValidators([this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([Validators.required],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'Diploma') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'UG') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }
      if (element['controls'][this.form_qualification_type]['value'] == 'PG') {
        // Below are dynamically changing data based on education
        element['controls'][this.form_qualification].clearValidators({ emitEvent: false });
        element['controls'][this.form_specialization].clearValidators({ emitEvent: false });
        element['controls'][this.form_collegeName].clearValidators({ emitEvent: false });
        element['controls'][this.form_boardUniversity].clearValidators({ emitEvent: false });

        element['controls'][this.form_qualification].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_specialization].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_collegeName].setValidators([Validators.required],{ emitEvent: false });
        element['controls'][this.form_boardUniversity].setValidators([this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()],{ emitEvent: false });

        element['controls'][this.form_qualification].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_specialization].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_collegeName].updateValueAndValidity({ emitEvent: false });
        element['controls'][this.form_boardUniversity].updateValueAndValidity({ emitEvent: false });
      }

      });
    }


  getEducationLevels() {
    this.candidateService.getEducationList().subscribe((data: any) => {
      this.appConfig.hideLoader();
      const list = data && data[0] ? data[0] : [];
      list.forEach((element, i) => {
        if (element['id'] === '1') {
          element['label'] = 'SSLC / 10th'
        }
        if (element['id'] === '2') {
          element['label'] = 'HSC / 12th'
        }
        if (element['id'] === '3') {
          element['label'] = 'Diploma'
        }
        if (element['id'] === '4') {
          element['label'] = 'Undergraduate'
        }
        if (element['id'] === '5') {
          element['label'] = 'Postgraduate'
        }
      });
      this.educationLevels = list;
    }, (err) => {

    });
  }

  getUGSpecialization() {
    const api = {
      level: '',
      discipline: '',
      specification: 'UG'
    };
    this.candidateService.getDiplomaList(api).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const list = data && data[0] ? data[0] : [];
      this.ugSpecializationList = list;
    }, (err) => {

    });
  }


  getPGSpecialization() {
    const api = {
      level: '',
      discipline: '',
      specification: 'PG'
    };
    this.candidateService.getDiplomaList(api).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const list = data && data[0] ? data[0] : [];
      this.pgSpecializationList = list;
    }, (err) => {

    });
  }

  getDiplomaDiscipline() {
    const api = {
      level: '',
      discipline: 'Diploma',
      specification: ''
    };
    this.candidateService.getDiplomaList(api).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const list = data && data[0] ? data[0] : [];
      this.diplomaDisciplineList = list;
    }, (err) => {

    });
  }

  getUGDiscipline() {
    const api = {
      level: '',
      discipline: 'UG',
      specification: ''
    };
    this.candidateService.getDiplomaList(api).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const list = data && data[0] ? data[0] : [];
      this.ugDisciplineList = list;
    }, (err) => {

    });
  }

  getPGDiscipline() {
    const api = {
      level: '',
      discipline: 'PG',
      specification: ''
    };
    this.candidateService.getDiplomaList(api).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const list = data && data[0] ? data[0] : [];
      this.pgDisciplineList = list;
    }, (err) => {

    });
  }

  getDiplomaInstitutes() {
    const api = {
      level: 'Diploma',
      discipline: '',
      specification: ''
    };
    this.candidateService.getDiplomaList(api).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const list = data && data[0] ? data[0] : [];
      this.diplomaInstitutesList = list;
    }, (err) => {

    });
  }

  getUGandPGInstitutes() {
    const api = {
      level: 'PG',
      discipline: '',
      specification: ''
    };
    this.candidateService.getDiplomaList(api).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const list = data && data[0] ? data[0] : [];
      this.ugInstitutesList = list;
      const exceptOthers = list.filter((data: any) => data.college_name !== 'Others');
      this.pgInstitutesList = exceptOthers;
    }, (err) => {

    });
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }

}