import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import moment from 'moment';
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
  selector: 'app-joining-upload',
  templateUrl: './joining-upload.component.html',
  styleUrls: ['./joining-upload.component.scss'],
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
export class JoiningUploadComponent implements OnInit, AfterViewInit, OnDestroy {

  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  dependentForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  //form Variables
  form_dependentArray = 'dependentArray';
  form_dependent_name = 'name_of_your_family';
  form_dependent_dob = 'family_date_of_birth';
  form_dependent_relationship = 'relationship';
  form_dependent_occupation = 'occupation';
  form_dependent_differently_abled = 'differently_abled';
  form_dependent_status = 'status';
  form_isDependent = 'dependent'

  dependedentDetails: any;
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
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
  }

  ngAfterViewInit() {
    this.sharedService.joiningFormActiveSelector.next('upload');
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
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
    // if(this.dependentForm.valid) {
      this.candidateService.joiningFormUpload().subscribe((data: any)=> {
        this.appConfig.hideLoader();
        this.appConfig.nzNotification('success', 'Saved', 'Upload details has been updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
      });
    // } else {
    //   this.ngAfterViewInit();
    //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
    //   this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
    // }

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
      if(data.current == 'upload') {
        // if (!this.dependentForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        // } else {
        //   return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        // }
      } 
    });
  }

  routeNext(route) {
    // if (!this.dependentForm.dirty) {
      if (route == 'education') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION);
      } else {
        this.formSubmit();
        // if (this.appConfig.getLocalData('upload') == '1') {
        //   return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
        // } else {
        //  if (this.dependentForm.valid) {
        //   return this.sharedService.openJoiningRoutePopUp.next(route == 'education' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
        //   // }
        //   this.ngAfterViewInit();
        //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        // }
      }
    // } else {
      // return this.sharedService.openJoiningRoutePopUp.next(route == 'education' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_EDUCATION : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
    // }
  }



  
  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }

}
