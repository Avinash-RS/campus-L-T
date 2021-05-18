import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { GlobalValidatorService } from './../../../custom-form-validators/globalvalidators/global-validator.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateMappersService } from './../../../services/candidate-mappers.service';
import { SharedServiceService } from './../../../services/shared-service.service';
import { AdminServiceService } from './../../../services/admin-service.service';
import { ApiServiceService } from './../../../services/api-service.service';
import { AppConfigService } from './../../../config/app-config.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';

@Component({
  selector: 'app-joining-contact',
  templateUrl: './joining-contact.component.html',
  styleUrls: ['./joining-contact.component.scss']
})
export class JoiningContactComponent implements OnInit, AfterViewInit, OnDestroy {

  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  contactForm: FormGroup;
  allStatesList: any;
  allPresentCityList: any;
  allPermanentCityList: any;
  regionList = [
    {
      label: 'India',
      value: '101'
    }
  ];
  //form Variables
  form_present_address_1 = 'present_line_street_addres';
  form_present_address_2 = 'present_line2_street_addre';
  form_present_address_3 = 'present_address_line_3';
  form_present_city = 'preset_city';
  form_present_state = 'present_state';
  form_present_zip_code = 'present_zip';
  form_present_region = 'present_country';
  form_same_as_checkbox = 'same_as_checkbox';
  form_permanent_address_1 = 'permanent_line1_street_add';
  form_permanent_address_2 = 'permanent_line2_street_add';
  form_permanent_address_3 = 'permanent_address_line_3';
  form_permanent_city = 'permanent_city';
  form_permanent_state = 'permanent_state';
  form_permanent_zip_code = 'permanent_zip';
  form_permanent_region = 'permanent_country';

  contactDetails: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) {
    this.sharedService.joiningFormActiveSelector.next('contact');
  }

  ngOnInit() {
    this.formInitialize();
    this.getAllStates();
    this.getContactDetails();
    this.saveRequestRxJs();
    this.checkFormValidRequestFromRxjs();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getAllStates() {
    const datas = {
      country_id: '101'
    };
    this.candidateService.updatedState(datas).subscribe((data: any) => {
      this.allStatesList = data[0];
    }, (err) => {

    });
  }

  getAllPresentCities(id) {
    const ApiData = {
      state_id: id
    };
    this.candidateService.updatedCity(ApiData).subscribe((datas: any) => {
      // this.hideCityDropDown = false;
      this.appConfig.hideLoader();
      this.allPresentCityList = datas[0];
    }, (err) => {
    });
  }

  getAllPermanentCities(id) {
    const ApiData = {
      state_id: id
    };
    this.candidateService.updatedCity(ApiData).subscribe((datas: any) => {
      // this.hideCityDropDown = false;
      this.appConfig.hideLoader();
      this.allPermanentCityList = datas[0];
    }, (err) => {
    });
  }



  matchangeYes(e) {
    if (e.checked) {
      this.updatePermanentAsPerPresent();
    } else {
      this.updatePermanentAsPerPresent();
    }
  }

  getContactDetails() {
    this.appConfig.showLoader();
    this.candidateService.joiningFormGetContactDetails().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.contactDetails = data ? data : null;
      if (this.contactDetails) {
        this.patchContactForm();
      }
    });
  }

  formSubmit(routeValue?: any) {
    if (this.contactForm['value'][this.form_same_as_checkbox]) {
      this.updatePermanentAsPerPresent();
    }
    if (this.contactForm.valid) {
      let rawContactFormValue = this.contactForm.getRawValue();
      // form_same_as_checkbox = 'same_as_checkbox';
        const apiData = {
        [this.form_present_address_1]: rawContactFormValue[this.form_present_address_1],
        [this.form_present_address_2]: rawContactFormValue[this.form_present_address_2],
        [this.form_present_address_3]: rawContactFormValue[this.form_present_address_3],
        [this.form_present_city]: rawContactFormValue[this.form_present_city],
        [this.form_present_state]: rawContactFormValue[this.form_present_state],
        [this.form_present_zip_code]: rawContactFormValue[this.form_present_zip_code],
        [this.form_permanent_address_1]: rawContactFormValue[this.form_permanent_address_1],
        [this.form_permanent_address_2]: rawContactFormValue[this.form_permanent_address_2],
        [this.form_permanent_city]: rawContactFormValue[this.form_permanent_city],
        [this.form_permanent_state]: rawContactFormValue[this.form_permanent_state],
        [this.form_permanent_zip_code]: rawContactFormValue[this.form_permanent_zip_code],
        [this.form_present_region]: rawContactFormValue[this.form_present_region],
        [this.form_permanent_address_3]: rawContactFormValue[this.form_permanent_address_3],
        [this.form_permanent_region]: rawContactFormValue[this.form_permanent_region],
        [this.form_same_as_checkbox]: rawContactFormValue[this.form_same_as_checkbox] ? rawContactFormValue[this.form_same_as_checkbox] : false,
        user_id: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
        }
        this.candidateService.joiningFormGetContactDetailsSave(apiData).subscribe((data: any)=> {
          this.appConfig.hideLoader();
          this.appConfig.nzNotification('success', 'Saved', 'Contact details has been updated');
          this.sharedService.joiningFormStepperStatus.next();
          return this.appConfig.routeNavigation(routeValue ? routeValue : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);    
      });
    } else {
      this.ngAfterViewInit();
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFields(this.contactForm);
    }
  }

  saveRequestRxJs() {
    this.sendPopupResultSubscription = this.sharedService.sendPopupResult.subscribe((result: any)=> {
     if (result.result == 'save') {
            this.formSubmit(result.route);
      }     
    });
  }

  checkFormValidRequestFromRxjs() {
    this.checkFormValidRequest = this.sharedService.StepperNavigationCheck.subscribe((data: any)=> {
      if(data.current == 'contact') {
        if (!this.contactForm.dirty) {
          this.sharedService.joiningFormStepperStatus.next();
          return this.appConfig.routeNavigation(data.goto);
        } else {
          return this.sharedService.openJoiningRoutePopUp.next(data.goto);
        }
      } 
    });
  }

  routeNext(route) {
    if (!this.contactForm.dirty) {
      if (route == 'personal') {
        this.sharedService.joiningFormStepperStatus.next();
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
      } else {
        if (this.contactForm.valid || this.appConfig.getLocalData('contact') == '1') {
          this.sharedService.joiningFormStepperStatus.next();
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
        } else {
          this.glovbal_validators.validateAllFields(this.contactForm);
          this.ngAfterViewInit();
          this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
        }
      }
    } else {
      return this.sharedService.openJoiningRoutePopUp.next(route == 'personal' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
    }
  }

  patchContactForm() {
    this.contactForm.patchValue({
      [this.form_present_address_1]: this.contactDetails[this.form_present_address_1],
      [this.form_present_address_2]: this.contactDetails[this.form_present_address_2],
      [this.form_present_address_3]: this.contactDetails[this.form_present_address_3],
      [this.form_present_city]: this.contactDetails[this.form_present_city],
      [this.form_present_state]: this.contactDetails[this.form_present_state],
      [this.form_present_region]: this.contactDetails[this.form_present_region],
      [this.form_present_zip_code]: this.contactDetails[this.form_present_zip_code],
      [this.form_same_as_checkbox]: this.contactDetails[this.form_same_as_checkbox],
      [this.form_permanent_address_1]: this.contactDetails[this.form_permanent_address_1],
      [this.form_permanent_address_2]: this.contactDetails[this.form_permanent_address_2],
      [this.form_permanent_address_3]: this.contactDetails[this.form_permanent_address_3],
      [this.form_permanent_city]: this.contactDetails[this.form_permanent_city],
      [this.form_permanent_state]: this.contactDetails[this.form_permanent_state],
      [this.form_permanent_region]: this.contactDetails[this.form_permanent_region],
      [this.form_permanent_zip_code]: this.contactDetails[this.form_permanent_zip_code]
    });
    this.disableOrEnableState(this.form_present_state);
    this.disableOrEnableState(this.form_permanent_state);
    this.patchApiCityId();
  }

  patchApiCityId() {
    this.contactForm.patchValue({
      [this.form_present_city]: this.contactDetails[this.form_present_city],
      [this.form_permanent_city]: this.contactDetails[this.form_permanent_city]
    })
  }

  formInitialize() {
    this.contactForm = this.fb.group({
      [this.form_present_address_1]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_present_address_2]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_present_address_3]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_present_city]: [{ value: null, disabled: true }],
      [this.form_present_state]: [null],
      [this.form_present_region]: [null],
      [this.form_present_zip_code]: [null, [this.glovbal_validators.numberOnly(), RemoveWhitespace.whitespace()]],
      [this.form_same_as_checkbox]: [null],
      [this.form_permanent_address_1]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_permanent_address_2]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_permanent_address_3]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_permanent_city]: [{ value: null, disabled: true }],
      [this.form_permanent_state]: [null],
      [this.form_permanent_region]: [null],
      [this.form_permanent_zip_code]: [null, [this.glovbal_validators.numberOnly(), RemoveWhitespace.whitespace()]]
    })
  }

  // Form getters
  get present_address_1() {
    return this.contactForm.get(this.form_present_address_1);
  }
  get present_address_2() {
    return this.contactForm.get(this.form_present_address_2);
  }
  get present_address_3() {
    return this.contactForm.get(this.form_present_address_3);
  }
  get present_city() {
    return this.contactForm.get(this.form_present_city);
  }
  get present_state() {
    return this.contactForm.get(this.form_present_state);
  }
  get present_zip_code() {
    return this.contactForm.get(this.form_present_zip_code);
  }
  get present_region() {
    return this.contactForm.get(this.form_present_region);
  }
  get same_as_checkbox() {
    return this.contactForm.get(this.form_same_as_checkbox);
  }
  get permanent_address_1() {
    return this.contactForm.get(this.form_permanent_address_1);
  }
  get permanent_address_2() {
    return this.contactForm.get(this.form_permanent_address_2);
  }
  get permanent_address_3() {
    return this.contactForm.get(this.form_permanent_address_3);
  }
  get permanent_city() {
    return this.contactForm.get(this.form_permanent_city);
  }
  get permanent_state() {
    return this.contactForm.get(this.form_permanent_state);
  }
  get permanent_zip_code() {
    return this.contactForm.get(this.form_permanent_zip_code);
  }
  get permanent_region() {
    return this.contactForm.get(this.form_permanent_region);
  }

  updatePermanentAsPerPresent() {
    this.contactForm.patchValue({
      [this.form_permanent_address_1]: this.contactForm['value'][this.form_present_address_1] ? this.contactForm['value'][this.form_present_address_1] : null,
      [this.form_permanent_address_2]: this.contactForm['value'][this.form_present_address_2] ? this.contactForm['value'][this.form_present_address_2] : null,
      [this.form_permanent_address_3]: this.contactForm['value'][this.form_present_address_3] ? this.contactForm['value'][this.form_present_address_3] : null,
      [this.form_permanent_city]: this.contactForm['value'][this.form_present_city] ? this.contactForm['value'][this.form_present_city] : null,
      [this.form_permanent_state]: this.contactForm['value'][this.form_present_state] ? this.contactForm['value'][this.form_present_state] : null,
      [this.form_permanent_region]: this.contactForm['value'][this.form_present_region] ? this.contactForm['value'][this.form_present_region] : null,
      [this.form_permanent_zip_code]: this.contactForm['value'][this.form_present_zip_code] ? this.contactForm['value'][this.form_present_zip_code] : null
    }, { emitEvent: false });
    // this.contactForm.controls[this.form_permanent_address_1].disable({ emitEvent: false });
    // this.contactForm.controls[this.form_permanent_address_2].disable({ emitEvent: false });
    // this.contactForm.controls[this.form_permanent_address_3].disable({ emitEvent: false });
    // this.contactForm.controls[this.form_permanent_city].disable({ emitEvent: false });
    // this.contactForm.controls[this.form_permanent_state].disable({ emitEvent: false });
    // this.contactForm.controls[this.form_permanent_region].disable({ emitEvent: false });
    // this.contactForm.controls[this.form_permanent_zip_code].disable({ emitEvent: false });
  }

  releaseDisabledValue() {
    this.contactForm.controls[this.form_permanent_address_1].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_address_2].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_address_3].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_city].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_state].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_region].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_zip_code].enable({ emitEvent: false });
  }
  disablePresentCity() {
    this.contactForm.patchValue({
      [this.form_present_city]: null,
    }), { emitEvent: false };
    if (this.contactForm['value'][this.form_same_as_checkbox]) {
      this.contactForm.patchValue({
        [this.form_permanent_city]: null,
      }), { emitEvent: false };
      this.contactForm.controls[this.form_present_city].disable({ emitEvent: false });
      return this.contactForm.controls[this.form_permanent_city].disable({ emitEvent: false });
    }
    return this.contactForm.controls[this.form_present_city].disable({ emitEvent: false });
  }
  enablePresentCity(id) {
    this.contactForm.controls[this.form_present_city].enable({ emitEvent: false });
    if (this.contactForm['value'][this.form_same_as_checkbox]) {
      this.contactForm.controls[this.form_permanent_city].enable({ emitEvent: false });
      this.getAllPresentCities(id);
      return this.getAllPermanentCities(id);  
    }
    return this.getAllPresentCities(id);
  }
  disablePermanentCity() {
    this.contactForm.patchValue({
      [this.form_permanent_city]: null,
    }), { emitEvent: false };
    return this.contactForm.controls[this.form_permanent_city].disable({ emitEvent: false });
  }
  enablePermanentCity(id) {
    this.contactForm.controls[this.form_permanent_city].enable({ emitEvent: false });
    return this.getAllPermanentCities(id);
  }

  disableOrEnableState(formField) {
    if (this.form_present_state == formField) {
      if (this.contactForm['value'][formField]) {
        return this.enablePresentCity(this.contactForm['value'][formField]);
      }
      this.disablePresentCity();
    } else {
      if (this.contactForm['value'][formField]) {
        return this.enablePermanentCity(this.contactForm['value'][formField]);
      }
      this.disablePermanentCity();
    }
  }

  // Value changes to check present and permanent are same
  valueChanges() {
    this.contactForm.valueChanges.subscribe((data: any) => {
      // Below is for automatic update of permanent address
      // if (data[this.form_same_as_checkbox]) {
      //   return this.updatePermanentAsPerPresent();
      // } else {
      //   return this.releaseDisabledValue();
      // }
    });
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
  }
}
