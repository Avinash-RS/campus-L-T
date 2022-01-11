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
  selector: 'app-adani-joining-contact',
  templateUrl: './joining-contact.component.html',
  styleUrls: ['./joining-contact.component.scss']
})
export class AdaniJoiningContactComponent implements OnInit, AfterViewInit, OnDestroy {

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
  checkFormValidRequest: Subscription;
  sendPopupResultSubscription: Subscription;
  joiningFormDataPassingSubscription: Subscription;
  updatedCitySubscription: Subscription;
  updatedCitySubscription1: Subscription;
  newSaveProfileDataSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) {
  }

  ngOnInit() {
    this.formInitialize();
    this.getAllStates();
    this.getContactDetails();
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
       this.getContactDetails();
     });
   }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('contact');
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
   this.updatedCitySubscription = this.candidateService.updatedCity(ApiData).subscribe((datas: any) => {
      // this.hideCityDropDown = false;

      if(datas && datas[0] && datas[0].error) {
        this.allPresentCityList = [];
        return this.appConfig.warning('No City Data available for the selected state');
      }
      this.allPresentCityList = datas[0];
    }, (err) => {
    });
  }

  getAllPermanentCities(id) {
    const ApiData = {
      state_id: id
    };
   this.updatedCitySubscription1 = this.candidateService.updatedCity(ApiData).subscribe((datas: any) => {
      // this.hideCityDropDown = false;

      if(datas && datas[0] && datas[0].error) {
        this.allPermanentCityList = [];
        return this.appConfig.warning('No City Data available for the selected state');
      }
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
    if (this.candidateService.getLocalProfileData()) {
      this.contactDetails = this.candidateService.getLocalcontact_details();
      this.contactDetails ? this.patchContactForm() : '';
    } else {
      // let apiData = {
      //   form_name: 'joining',
      //   section_name: ''
      // }
      // this.candidateService.newGetProfileData(apiData).subscribe((data: any)=> {
      //   this.candidateService.saveAllProfileToLocal(data);
      //   this.contactDetails = this.candidateService.getLocalcontact_details();
      //   this.contactDetails ? this.patchContactForm() : '';
      // });
    }
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
        const ContactApiRequestDetails = {
          form_name: "joining",
          section_name: "contact_details",
          saving_data: apiData
        }
      this.newSaveProfileDataSubscription = this.candidateService.newSaveProfileData(ContactApiRequestDetails).subscribe((data: any)=> {
          this.candidateService.saveFormtoLocalDetails(data.section_name, data.saved_data);
          this.candidateService.saveFormtoLocalDetails('section_flags', data.section_flags);
          this.appConfig.nzNotification('success', 'Saved', data && data.message ? data.message : 'Contact details is updated');
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
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
      } else {
        if(this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().contact_details == '1') {
          return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
        } else {
         if (this.contactForm.valid) {
          return this.sharedService.openJoiningRoutePopUp.next(route == 'personal' ? CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL : CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_DEPENDENT);
            }
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
      [this.form_present_city]: this.contactDetails[this.form_present_city] ? this.contactDetails[this.form_present_city].toString() : null,
      [this.form_present_state]: this.contactDetails[this.form_present_state] ? this.contactDetails[this.form_present_state].toString() : null,
      [this.form_present_region]: this.contactDetails[this.form_present_region] ? this.contactDetails[this.form_present_region].toString() : null,
      [this.form_present_zip_code]: this.contactDetails[this.form_present_zip_code] ? this.contactDetails[this.form_present_zip_code].toString() : null,
      [this.form_same_as_checkbox]: this.contactDetails[this.form_same_as_checkbox],
      [this.form_permanent_address_1]: this.contactDetails[this.form_permanent_address_1],
      [this.form_permanent_address_2]: this.contactDetails[this.form_permanent_address_2],
      [this.form_permanent_address_3]: this.contactDetails[this.form_permanent_address_3],
      [this.form_permanent_city]: this.contactDetails[this.form_permanent_city] ? this.contactDetails[this.form_permanent_city].toString() : null,
      [this.form_permanent_state]: this.contactDetails[this.form_permanent_state] ? this.contactDetails[this.form_permanent_state].toString() : null,
      [this.form_permanent_region]: this.contactDetails[this.form_permanent_region] ? this.contactDetails[this.form_permanent_region].toString() : null,
      [this.form_permanent_zip_code]: this.contactDetails[this.form_permanent_zip_code] ? this.contactDetails[this.form_permanent_zip_code].toString() : null
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
      [this.form_present_address_1]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      [this.form_present_address_2]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      [this.form_present_address_3]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      [this.form_present_city]: [{ value: null, disabled: true }, [Validators.required]],
      [this.form_present_state]: [null, [Validators.required]],
      [this.form_present_region]: [null, [Validators.required]],
      [this.form_present_zip_code]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.zipOnly()]],
      [this.form_same_as_checkbox]: [null],
      [this.form_permanent_address_1]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      [this.form_permanent_address_2]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      [this.form_permanent_address_3]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      [this.form_permanent_city]: [{ value: null, disabled: true }, [Validators.required]],
      [this.form_permanent_state]: [null, [Validators.required]],
      [this.form_permanent_region]: [null, [Validators.required]],
      [this.form_permanent_zip_code]: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.zipOnly()]]
    })
    this.setJoiningAndKYCValidators(this.candidateService.checkKycOrJoiningForm());
  }

  setJoiningAndKYCValidators(isJoining) {
    if (isJoining) {
    } else {
      this.contactForm.controls[this.form_present_address_1].setValidators([RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]);
      this.contactForm.controls[this.form_present_address_2].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]);
      this.contactForm.controls[this.form_present_address_3].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]);
      this.contactForm.controls[this.form_present_city].setValidators(null);
      this.contactForm.controls[this.form_present_state].setValidators(null);
      this.contactForm.controls[this.form_present_region].setValidators(null);
      this.contactForm.controls[this.form_present_zip_code].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.zipOnly()]);
      this.contactForm.controls[this.form_permanent_address_1].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]);
      this.contactForm.controls[this.form_permanent_address_2].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]);
      this.contactForm.controls[this.form_permanent_address_3].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.address255()]);
      this.contactForm.controls[this.form_permanent_city].setValidators(null);
      this.contactForm.controls[this.form_permanent_state].setValidators(null);
      this.contactForm.controls[this.form_permanent_region].setValidators(null);
      this.contactForm.controls[this.form_permanent_zip_code].setValidators([RemoveWhitespace.whitespace(), this.glovbal_validators.zipOnly()]);
    }
    let form = this.contactForm;
    for (const key in form.controls) {
      form.get(key).updateValueAndValidity();
    }
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
        this.contactForm.patchValue({
          [this.form_present_city]: null,
        }), { emitEvent: false };
            return this.enablePresentCity(this.contactForm['value'][formField]);
      }
      this.disablePresentCity();
    } else {
      if (this.contactForm['value'][formField]) {
        this.contactForm.patchValue({
          [this.form_permanent_city]: null,
        }), { emitEvent: false };
        return this.enablePermanentCity(this.contactForm['value'][formField]);
      }
      this.disablePermanentCity();
    }
  }

  ngOnDestroy() {
    this.sendPopupResultSubscription ? this.sendPopupResultSubscription.unsubscribe() : '';
    this.checkFormValidRequest ? this.checkFormValidRequest.unsubscribe() : '';
    this.joiningFormDataPassingSubscription ? this.joiningFormDataPassingSubscription.unsubscribe() : '';
    this.updatedCitySubscription ? this.updatedCitySubscription.unsubscribe() : '';
    this.updatedCitySubscription1 ? this.updatedCitySubscription1.unsubscribe() : '';
    this.newSaveProfileDataSubscription ? this.newSaveProfileDataSubscription.unsubscribe() : '';
  }
}
