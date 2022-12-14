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
export class GeneralJoiningDependentComponent implements OnInit, AfterViewInit, OnDestroy {

  dependentForm: FormGroup;
  minDate: Date;
  maxDate: Date;

  diffAbledDropdownList = [
    {
      label: 'Yes',
      value: 1
    },
    {
      label: 'No',
      value: 0
    }
  ];
  activeDropdownList = [
    {
      label: 'Active',
      value: 1
    },
    {
      label: 'Inactive',
      value: 0
    }
  ];
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
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  newSaveProfileDataSubscription: Subscription;
  DOBMaxDate: Date;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) {
    this.dateValidation();
  }

  ngOnInit() {
    this.formInitialize();
    this.getDependentApiDetails();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
    this.joiningFormDataFromJoiningFormComponentRxjs();
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
       this.getDependentApiDetails();
     });
   }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('dependent');
  }

  getDependentApiDetails() {
    if (this.candidateService.getLocalProfileData()) {
      this.formInitialize();
      this.dependedentDetails = this.candidateService.getLocaldependent_details();
      this.dependedentDetails && this.dependedentDetails.length > 0 ? this.ifDependentDetails() : this.ifNotDependentDetails();
    } else {
      // let apiData = {
      //   form_name: 'joining',
      //   section_name: ''
      // }
      // this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
      //   this.candidateService.saveAllProfileToLocal(data);
      //   this.dependedentDetails = this.candidateService.getLocaldependent_details();
      //   this.dependedentDetails && this.dependedentDetails.length > 0 ? this.ifDependentDetails() : this.ifNotDependentDetails();
      // });
    }
  }

  ifDependentDetails() {
    this.patchDependentForm();
  }
  ifNotDependentDetails() {
    this.dependedentDetails = [];
    for (let index = 0; index < 2; index++) {
      this.getDependentArr.push(this.initDependentArray());
      if (index == 0) {
        this.getDependentArr.at(0).patchValue({
          [this.form_dependent_relationship]: 'Father',
        });
        this.getDependentArr.controls[0]['controls'][this.form_dependent_relationship].disable({ emitEvent: false });
      }
      if (index == 1) {
        this.getDependentArr.at(1).patchValue({
          [this.form_dependent_relationship]: 'Mother',
        });
        this.getDependentArr.controls[1]['controls'][this.form_dependent_relationship].disable({ emitEvent: false });
      }
    }
  }

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 90, 0, 1);
    this.maxDate = new Date(currentYear + 20, 11, 31);
    this.DOBMaxDate = new Date();
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
    if(this.dependentForm.valid) {
      let formArray = this.dependentForm.getRawValue()[this.form_dependentArray];
      formArray.forEach(element => {
        if (element[this.form_dependent_dob]) {
          element[this.form_dependent_dob] = element[this.form_dependent_dob];
        }
      });
      const DependentApiRequestDetails = {
        form_name: "joining",
        section_name: "dependent_details",
        saving_data: formArray
      }
     this.newSaveProfileDataSubscription = this.candidateService.newSaveProfileData(DependentApiRequestDetails).subscribe((data: any)=> {
        this.candidateService.saveFormtoLocalDetails(data.section_name, data.saved_data);
        this.candidateService.saveFormtoLocalDetails('section_flags', data.section_flags);
        this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Dependent details is updated');
        this.sharedService.joiningFormStepperStatus.next();
        return routeValue ? this.appConfig.routeNavigation(routeValue) : this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
      });
    } else {
      this.ngAfterViewInit();
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
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
      if(data.current == 'dependent') {
        if (!this.dependentForm.dirty) {
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      }
    });
  }

  routeNext(route) {
    if (!this.dependentForm.dirty) {
      if (route == 'contact') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT);
      } else {
        if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().dependent_details == '1') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
        } else {
         if (this.dependentForm.valid) {
          return this.sharedService.openJoiningRoutePopUp.next(route == 'contact' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
          }
          this.glovbal_validators.validateAllFormArrays(this.dependentForm.get([this.form_dependentArray]) as FormArray);
          this.ngAfterViewInit();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'contact' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION);
    }
  }

  patchDependentForm() {
    this.getDependentArr.clear();
    this.dependedentDetails.forEach((element, i) => {
      this.getDependentArr.push(this.patching(element, i));
    });
    this.getDependentArr.at(0).patchValue({
      [this.form_dependent_relationship]: 'Father',
    });
    this.getDependentArr.at(1).patchValue({
      [this.form_dependent_relationship]: 'Mother',
    });
    this.getDependentArr.controls[0]['controls'][this.form_dependent_relationship].disable({ emitEvent: false });
    this.getDependentArr.controls[1]['controls'][this.form_dependent_relationship].disable({ emitEvent: false });
  }

  patching(data, index) {
    return this.fb.group({
      [this.form_dependent_name]: [data[this.form_dependent_name], index > 1 ? [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()] : [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_dob]: [this.dateConvertion(data[this.form_dependent_dob])],
      [this.form_dependent_occupation]: [data[this.form_dependent_occupation], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_relationship]: [data[this.form_dependent_relationship], [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_differently_abled]: [(data[this.form_dependent_differently_abled] == 1 || data[this.form_dependent_differently_abled] == 0) ? (data[this.form_dependent_differently_abled] == 1 ? 1 : 0) : 0],
      [this.form_dependent_status]: [(data[this.form_dependent_status] == 1 || data[this.form_dependent_status] == 0) ? ((data[this.form_dependent_status] == 0 && data[this.form_dependent_status] != '') ? 0 : 1) : 1],
      [this.form_isDependent]: [(data[this.form_isDependent] == 1 || data[this.form_isDependent] == 0) ? (data[this.form_isDependent] == 1 ? 1 : 0) : 0]
    })
  }

  initDependentArray(dependentArrayLength?: any) {
    return this.fb.group({
      [this.form_dependent_name]: [null, dependentArrayLength >= 2 ? [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.alphaNum255()] : [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_dob]: [null],
      [this.form_dependent_occupation]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_relationship]: [null, [RemoveWhitespace.whitespace(), this.glovbal_validators.alphaNum255()]],
      [this.form_dependent_differently_abled]: [0],
      // ? [Validators.required] : []
      [this.form_dependent_status]: [1],
      // ? [Validators.required] : []
      [this.form_isDependent]: [0]
    })
  }

  formInitialize() {
    this.dependentForm = this.fb.group({
      [this.form_dependentArray]: this.fb.array([])
    })
  }

  addToDependentArray() {
    if (this.dependentForm.valid) {
      let dependentArrayLength = this.getDependentArr.length;
     return this.getDependentArr.push(this.initDependentArray(dependentArrayLength));
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
  get isDependent() {
    return this.dependentForm.get(this.form_isDependent);
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
    this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
    this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
    }

}
