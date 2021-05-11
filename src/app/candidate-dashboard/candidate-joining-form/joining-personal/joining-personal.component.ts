import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-joining-personal',
  templateUrl: './joining-personal.component.html',
  styleUrls: ['./joining-personal.component.scss']
})
export class JoiningPersonalComponent implements OnInit {

  
  personalForm: FormGroup;
  titleDropdownList = [
    // {
    //   id: '0',
    //   value: 'Mr.'
    // },
    // {
    //   id: '1',
    //   value: 'Ms.'
    // }
    'Mr.' , 'Ms.'
  ];
  //form Variables
  form_candidate_id = 'candidate_id';
  form_title = 'title';
  form_name = 'name';
  form_dob = 'dob';
  form_gender = 'gender';
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
  ) { 

  }

  ngOnInit() {
    this.formInitialize();
  }


  formInitialize() {
    this.personalForm = this.fb.group({
      [this.form_candidate_id]: ['', [Validators.required, RemoveWhitespace.whitespace()]],
      [this.form_title]: ['', [Validators.required, RemoveWhitespace.whitespace()]],
      [this.form_name]: ['', [Validators.required, RemoveWhitespace.whitespace()]],
      [this.form_dob]: ['', [Validators.required, RemoveWhitespace.whitespace()]],
      [this.form_gender]: ['', [Validators.required, RemoveWhitespace.whitespace()]],
    })
  }

  
  formSubmit() {
    console.log('aad', this.personalForm.value);
    
  }
  
  // Form getters
  get candidate_id() {
    return this.personalForm.get(this.form_candidate_id);
  }

  get ftitle() {
    return this.personalForm.get(this.form_title);
  }

  get fname() {
    return this.personalForm.get(this.form_name);
  }

  get dob() {
    return this.personalForm.get(this.form_dob);
  }

  get gender() {
    return this.personalForm.get(this.form_gender);
  }


}
