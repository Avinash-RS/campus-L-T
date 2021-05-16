import { CONSTANT } from 'src/app/constants/app-constants.service';
import { GlobalValidatorService } from './../../../custom-form-validators/globalvalidators/global-validator.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateMappersService } from './../../../services/candidate-mappers.service';
import { SharedServiceService } from './../../../services/shared-service.service';
import { AdminServiceService } from './../../../services/admin-service.service';
import { ApiServiceService } from './../../../services/api-service.service';
import { AppConfigService } from './../../../config/app-config.service';
import { Component, OnInit } from '@angular/core';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';

@Component({
  selector: 'app-joining-contact',
  templateUrl: './joining-contact.component.html',
  styleUrls: ['./joining-contact.component.scss']
})
export class JoiningContactComponent implements OnInit {

  contactForm: FormGroup;
  titleDropdownList = [
    {
      id: '0',
      value: 'Mr.'
    },
    {
      id: '1',
      value: 'Ms.'
    }
  ];
  //form Variables
  form_present_address_1 = 'present_address_1';
  form_present_address_2 = 'present_address_2';
  form_present_address_3 = 'present_address_3';
  form_present_city = 'present_city';
  form_present_state = 'present_state';
  form_present_zip_code = 'present_zip_code';
  form_present_region = 'present_region';
  form_same_as_checkbox = 'same_as_checkbox';
  form_permanent_address_1 = 'permanent_address_1';
  form_permanent_address_2 = 'permanent_address_2';
  form_permanent_address_3 = 'permanent_address_3';
  form_permanent_city = 'permanent_city';
  form_permanent_state = 'permanent_state';
  form_permanent_zip_code = 'permanent_zip_code';
  form_permanent_region = 'permanent_region';

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) {
  }

  ngOnInit() {
    this.formInitialize();
    // this.valueChangesForAddress();
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

  matchangeYes(e) {
    if (e.checked) {
      this.updatePermanentAsPerPresent();
    } else {
      this.updatePermanentAsPerPresent();
    }
  }

  formSubmit() {
    if (this.contactForm['value'][this.form_same_as_checkbox]) {
        this.updatePermanentAsPerPresent();      
    }
    if (this.contactForm.valid) {
      this.appConfig.nzNotification('success', 'Saved', 'Contact details has been updated');
      console.log(this.contactForm.value);
    } else {
      this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
      this.glovbal_validators.validateAllFields(this.contactForm);
    }

  }
  routeNext(route) {
    if (this.contactForm.valid) {
      if (route == 'personal') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PERSONAL);
      }
      return
    }
    this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
  }

  formInitialize() {
    this.contactForm = this.fb.group({
      [this.form_present_address_1]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_present_address_2]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_present_address_3]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_present_city]: [null],
      [this.form_present_state]: [null],
      [this.form_present_region]: [null],
      [this.form_present_zip_code]: [null, [this.glovbal_validators.numberOnly(), RemoveWhitespace.whitespace()]],
      [this.form_same_as_checkbox]: [null],
      [this.form_permanent_address_1]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_permanent_address_2]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_permanent_address_3]: [null, [Validators.required, this.glovbal_validators.address255(), RemoveWhitespace.whitespace()]],
      [this.form_permanent_city]: [null],
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

  releaseDisabledValue() {
    this.contactForm.controls[this.form_permanent_address_1].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_address_2].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_address_3].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_city].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_state].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_region].enable({ emitEvent: false });
    this.contactForm.controls[this.form_permanent_zip_code].enable({ emitEvent: false });
  }
  // Value changes to check present and permanent are same
  valueChangesForAddress() {
    this.contactForm.valueChanges.subscribe((data: any) => {
      if (data[this.form_same_as_checkbox]) {
        return this.updatePermanentAsPerPresent();
      } else {
        return this.releaseDisabledValue();
      }
    });
  }

}
