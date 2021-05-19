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

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
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
  form_qualification_type = 'qualification_type';
  form_qualification = 'qualification';
  form_specialization = 'specialization';
  form_collegeName = 'collegeName';
  form_boardUniversity = 'boardUniversity';
  form_startDate = 'startDate';
  form_endDate = 'endDate';
  form_yearpassing = 'yearpassing';
  form_backlog = 'backlog';
  form_mode = 'mode';
  form_cgpa = 'cgpa';

  educationLevels: any;
  pgSpecializationList: any;
  ugSpecializationList: any;
  diplomaDisciplineList: any;
  pgDisciplineList: any;
  ugDisciplineList: any;
  diplomaInstitutesList: any;
  pgInstitutesList: any;
  ugInstitutesList: any;
  educationDetails = [
{
backlog: "0",
boardUniversity: "CBSE",
cgpa: "20",
collegeName: "Bishop",
endDate: '04-05-2011',
mode: "fulltime",
qualification: null,
qualification_type: 'SSLC',
specialization: null,
startDate: "01-06-2010",
yearpassing: "active",
},
{
backlog: "0",
boardUniversity: "State Board",
cgpa: "10",
collegeName: "Bishop Heber",
endDate: '05-03-2013',
mode: "parttime",
qualification: "Board",
qualification_type: "HSC",
specialization: "Science",
startDate: "03-06-2011",
yearpassing: "inactive"
},
{
backlog: "0",
boardUniversity: "Autonomous",
cgpa: "90",
collegeName: "Government Polytechnic College, Betul",
endDate: "12-03-2016",
mode: "fulltime",
qualification: "Diploma Engineering",
qualification_type: "Diploma",
specialization: "Electrical ",
startDate: "05-06-2013",
yearpassing: "active",
},
{
backlog: "2",
boardUniversity: "Dot",
cgpa: "67",
collegeName: "Atmaram Sanatan College",
endDate: "20-04-2020",
mode: "fulltime",
qualification: "B.E.",
qualification_type: "UG",
specialization: "Computer Science",
startDate: "10-06-2016",
yearpassing: "active",
},
{
backlog: "01",
boardUniversity: "Autonomous",
cgpa: "76",
collegeName: "Gmr Institute Of Technology, Rajam",
endDate: "12-05-2021",
mode: "fulltime",
qualification: "M.E.",
qualification_type: "PG",
specialization: "Chemical",
startDate: "11-06-2020",
yearpassing: "inactive",
}
];

  
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


  getEducationApiDetails() {
    // this.candidateService.joiningFormGetDependentDetails().subscribe((data: any)=> {
    //   this.appConfig.hideLoader();
    let data = this.educationDetails;
      if (data && data.length > 0) {
        this.educationDetails = data;
        this.patchEducationForm();
      } else {
        this.educationDetails = [];
        this.initalPatchWithValidations();
      }
    // });
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

  formSubmit(routeValue?: any) {
    console.log(this.educationForm.getRawValue());    
    if(this.educationForm.valid) {
      this.sharedService.joiningFormStepperStatus.next();
      return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
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
        if (this.educationForm.valid || this.appConfig.getLocalData('education') == '1') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
        } else {
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
      [this.form_yearpassing]: [data[this.form_yearpassing], [Validators.required]],
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
