import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-general-details',
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.scss']
})
export class GeneralDetailsComponent implements OnInit, OnDestroy {

  aquaintancesForm: FormGroup;
  skillForm: FormGroup;

  facultyReference1;
  facultyReference2;
  apiForm: any;
  generalArray: any;
  skillValueArray: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.FormInitialization();
    this.getLocalForm();

    if (this.appConfig.getLocalData('generalFormTouched')) {
      this.appConfig.clearLocalDataOne('generalFormTouched');
    }
    // tslint:disable-next-line: triple-equals
    if (this.appConfig.getLocalData('field_isformsubmitted') == 'true') {
      this.appConfig.setLocalData('generalFormSubmitted', 'true');
    }
  }

  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
    console.log(this.apiForm);
    this.generalArray = [{
      names: this.apiForm && this.apiForm['field_relatives_l_t_group_name'] ? this.apiForm['field_relatives_l_t_group_name'].value : null,
      relationship: this.apiForm && this.apiForm['field_realationship'] ? this.apiForm['field_realationship'].value : null,
      position: this.apiForm && this.apiForm['field_position'] ? this.apiForm['field_position'].value : null,
      company: this.apiForm && this.apiForm['field_company'] ? this.apiForm['field_company'].value : null,
    }];
    this.skillValueArray = [{
      skill: this.apiForm && this.apiForm['field_add_your_skills'] ? this.apiForm['field_add_your_skills'].value : null
    }];
    this.facultyReference1 = this.apiForm && this.apiForm['field_faculty_reference'] ? this.apiForm['field_faculty_reference'].value : null;
    this.facultyReference2 = this.apiForm && this.apiForm['field_faculty_reference1'] ? this.apiForm['field_faculty_reference1'].value : null;

    this.FormInitialization();
  }

  onSubmit(OptA, OptB) {
    if (this.aquaintancesForm.valid && this.skillForm.valid) {

      this.apiForm.field_add_your_skills = { value: this.skillForm.value.skillsArr[0]['skill'] ? this.skillForm.value.skillsArr[0]['skill'] : '' },
        this.apiForm.field_relatives_l_t_group_name = { value: this.aquaintancesForm.value.relativesArr[0]['names'] ? this.aquaintancesForm.value.relativesArr[0]['names'] : '' },
        this.apiForm.field_realationship = { value: this.aquaintancesForm.value.relativesArr[0]['relationship'] ? this.aquaintancesForm.value.relativesArr[0]['relationship'] : '' },
        this.apiForm.field_position = { value: this.aquaintancesForm.value.relativesArr[0]['position'] ? this.aquaintancesForm.value.relativesArr[0]['position'] : '' },
        this.apiForm.field_company = { value: this.aquaintancesForm.value.relativesArr[0]['company'] ? this.aquaintancesForm.value.relativesArr[0]['company'] : '' },
        this.apiForm.field_faculty_reference = { value: this.facultyReference1 ? this.facultyReference1 : '' },
        this.apiForm.field_faculty_reference1 = { value: this.facultyReference2 ? this.facultyReference2 : '' },

        this.appConfig.setLocalData('generalFormSubmitted', 'true');
      this.appConfig.clearLocalDataOne('generalFormTouched');
      this.appConfig.setLocalData('kycForm', JSON.stringify(this.apiForm));

      this.appConfig.nzNotification('success', 'Submitted', 'General details has been updated');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
    } else {
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      this.validateAllFormArrays(this.aquaintancesForm.get('relativesArr') as FormArray);
      this.validateAllFormArrays(this.skillForm.get('skillsArr') as FormArray);
    }
  }

  // General Acquantancies patch
  generalPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(gen => {
        this.addaquaintancesForm(gen);
      });
      if (dataArray.length === 1) {
        this.addaquaintancesForm(null);
      }
    } else {
      for (let i = 0; i <= 1; i++) {
        this.addaquaintancesForm(null);
      }
    }

  }
  // Skill Array patch
  generalSkillPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(skill => {
        this.addSkillForm(skill);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addaquaintancesForm(null);
      }
    }
  }
  FormInitialization() {
    this.aquaintancesForm = this.fb.group({
      relativesArr: this.fb.array([])
    }), this.generalPatch(this.generalArray);

    this.skillForm = this.fb.group({
      skillsArr: this.fb.array([])
    }), this.generalSkillPatch(this.skillValueArray);
  }
  createItem(data): FormGroup {
    if (data) {
      return this.fb.group({
        names: [data.names ? data.names : null],
        relationship: [data.relationship ? data.relationship : null],
        position: [data.position ? data.position : null],
        company: [data.company ? data.company : null],
      });
    } else {
      return this.fb.group({
        names: [null],
        relationship: [null],
        position: [null],
        company: [null],
      });
    }
  }

  createSkillForm(data): FormGroup {
    if (data) {
      return this.fb.group({
        skill: [data.skill],
      });
    } else {
      return this.fb.group({
        skill: [null],
      });
    }
  }

  removeSkillForm(i) {
    this.skillsArr.removeAt(i);
  }

  addSkillForm(data) {
    if (this.skillForm.valid) {
      this.skillsArr.push(this.createSkillForm(data));
    } else {
      this.validateAllFormArrays(this.skillForm.get('skillsArr') as FormArray);
    }
  }

  removeaquaintancesForm(i) {
    this.relativesArr.removeAt(i);
  }

  addaquaintancesForm(data) {
    this.relativesArr.push(this.createItem(data));
  }
  // convenience getters for easy access to form fields
  get relativesArr() { return this.aquaintancesForm.get('relativesArr') as FormArray; }
  get skillsArr() { return this.skillForm.get('skillsArr') as FormArray; }

  detectSelectChange() {
    this.appConfig.setLocalData('generalFormTouched', 'true');
  }

  detectInput(form) {
    if (form.touched === true) {
      this.appConfig.setLocalData('generalFormTouched', 'true');
    }
  }


  // To validate all fields after submit
  validateAllFormArrays(formArray: FormArray) {
    formArray.controls.forEach(formGroup => {
      Object.keys(formGroup['controls']).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFields(control);
        }
      });

    });
  }


  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  ngOnDestroy() {
    this.appConfig.clearLocalDataOne('generalFormTouched');
  }
}
