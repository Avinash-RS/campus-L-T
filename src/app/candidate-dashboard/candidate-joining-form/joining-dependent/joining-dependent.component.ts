import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-joining-dependent',
  templateUrl: './joining-dependent.component.html',
  styleUrls: ['./joining-dependent.component.scss']
})
export class JoiningDependentComponent implements OnInit {

  dependentForm: FormGroup;
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
  }

  formSubmit() {

  }

  routeNext(route) {

  }

  formInitialize() {
    this.dependentForm = this.fb.group({
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
  return this.dependentForm.get(this.form_present_address_1);
  }
  get present_address_2() {
  return this.dependentForm.get(this.form_present_address_2);
  }
  get present_address_3() {
  return this.dependentForm.get(this.form_present_address_3);
  }
  get present_city() {
  return this.dependentForm.get(this.form_present_city);
  }
  get present_state() {
  return this.dependentForm.get(this.form_present_state);
  }
  get present_zip_code() {
  return this.dependentForm.get(this.form_present_zip_code);
  }
  get present_region() {
  return this.dependentForm.get(this.form_present_region);
  }
  get same_as_checkbox() {
  return this.dependentForm.get(this.form_same_as_checkbox);
  }
  get permanent_address_1() {
  return this.dependentForm.get(this.form_permanent_address_1);
  }
  get permanent_address_2() {
  return this.dependentForm.get(this.form_permanent_address_2);
  }
  get permanent_address_3() {
  return this.dependentForm.get(this.form_permanent_address_3);
  }
  get permanent_city() {
  return this.dependentForm.get(this.form_permanent_city);
  }
  get permanent_state() {
  return this.dependentForm.get(this.form_permanent_state);
  }
  get permanent_zip_code() {
  return this.dependentForm.get(this.form_permanent_zip_code);
  }
  get permanent_region() {
  return this.dependentForm.get(this.form_permanent_region);
  }


}
