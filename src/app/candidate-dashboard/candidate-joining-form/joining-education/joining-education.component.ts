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
  form_qualification_type = 'quali';
  form_qualification = 'name_of_your_family';
  form_specialization = 'family_date_of_birth';
  form_collegeName = 'relationship';
  form_boardUniversity = 'differently_abled';
  form_startDate = 'status';
  form_endDate = 'status';
  form_yearpassing = 'status';
  form_backlog = 'backlog';
  form_mode = 'mode';
  form_cgpa = 'cgpa';

  educationDetails: any;
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
    this.getEducationApiDetails();
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
    //   if (data && data.length > 0) {
    //     this.educationDetails = data;
    //     this.patchEducationForm();
    //   } else {
    //     this.educationDetails = [];
        return this.getEducationArr.push(this.initEducationArray());
    //   }
    // });
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
  }

  patching(data) {
    return this.fb.group({
    //   [this.form_dependent_name]: [data[this.form_dependent_name], [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
    //   [this.form_dependent_dob]: [this.dateConvertion(data[this.form_dependent_dob])],
    //   [this.form_dependent_relationship]: [data[this.form_dependent_relationship], [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
    //   [this.form_dependent_differently_abled]: [data[this.form_dependent_differently_abled]],
    //   [this.form_dependent_status]: [data[this.form_dependent_status]],
    })    
  }

  initEducationArray() {
    return this.fb.group({
      [this.form_qualification_type]: [null, [Validators.required]],
      [this.form_qualification]: [null, [Validators.required]],
      [this.form_specialization]: [null, [Validators.required]],
      [this.form_collegeName]: [null, [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_boardUniversity]: [null, [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
      [this.form_startDate]: [null, [Validators.required]],
      [this.form_endDate]: [null, [Validators.required]],
      [this.form_backlog]: [null, [Validators.required]],
      [this.form_mode]: [null, [Validators.required]],
      [this.form_cgpa]: [null, [Validators.required, this.glovbal_validators.alphaNum255(), RemoveWhitespace.whitespace()]],
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


  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }

}
