import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { FormCanDeactivate } from 'src/app/guards/form-canDeactivate/form-can-deactivate';

@Component({
  selector: 'app-general-details',
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.scss']
})
export class GeneralDetailsComponent extends FormCanDeactivate implements OnInit, OnDestroy {
  @ViewChild('form', { static: false })
  // @ViewChild('form1', { static: false })
  // @ViewChild('form2', { static: false })
  // @ViewChild('form3', { static: false })
  form: NgForm;
  form1: NgForm;
  form2: NgForm;
  form3: NgForm;
  form4: NgForm;
  form5: NgForm;

  aquaintancesForm: FormGroup;
  skillForm: FormGroup;

  facultyReference1Form = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  facultyReference2Form = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);

  apiForm: any;
  generalArray: any;
  skillValueArray: any;
  showLineError: boolean;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) {
    super();
  }


  ngOnInit() {
    if (!this.appConfig.getLocalData('confirmClick')) {
      this.appConfig.setLocalData('confirmClick', 'false');
    }

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

  cancel() {
    this.ngOnInit();
    this.appConfig.nzNotification('success', 'Resetted', 'General details form has been resetted');
  }


  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
    console.log(this.apiForm);
    this.generalArray = [{
      names: this.apiForm && this.apiForm['field_relatives_l_t_group_name'] ? this.apiForm['field_relatives_l_t_group_name'].value : null,
      relationship: this.apiForm && this.apiForm['field_realationship'] ? this.apiForm['field_realationship'].value : null,
      position: this.apiForm && this.apiForm['field_position'] ? this.apiForm['field_position'].value : null,
      company: this.apiForm && this.apiForm['field_company'] ? this.apiForm['field_company'].value : null,
    },
    {
      names: this.apiForm && this.apiForm['field_relatives1'] ? this.apiForm['field_relatives1'].value : null,
      relationship: this.apiForm && this.apiForm['field_relative_relation1'] ? this.apiForm['field_relative_relation1'].value : null,
      position: this.apiForm && this.apiForm['field_relative_position1'] ? this.apiForm['field_relative_position1'].value : null,
      company: this.apiForm && this.apiForm['field_relative_company1'] ? this.apiForm['field_relative_company1'].value : null,
    }];
    this.skillValueArray = this.apiForm && this.apiForm['field_skills'] ? this.apiForm['field_skills'] : [{ value: '' }];

    this.facultyReference1Form.patchValue((this.apiForm && this.apiForm['field_faculty_reference']) ? this.apiForm['field_faculty_reference'].value : '');
    this.facultyReference2Form.patchValue((this.apiForm && this.apiForm['field_faculty_reference1']) ? this.apiForm['field_faculty_reference1'].value : '');

    this.FormInitialization();
  }

  onSubmit(OptA, OptB) {
    console.log(this.aquaintancesForm.value);

    if (this.aquaintancesForm.valid && this.skillForm.valid && this.facultyReference1Form.valid && this.facultyReference2Form.valid) {
      this.apiForm.field_skills = this.skillForm['value']['skillsArr'];
      this.apiForm.field_relatives_l_t_group_name = { value: this.aquaintancesForm.value.relativesArr[0]['names'] ? this.aquaintancesForm.value.relativesArr[0]['names'] : '' },
        this.apiForm.field_realationship = { value: this.aquaintancesForm.value.relativesArr[0]['relationship'] ? this.aquaintancesForm.value.relativesArr[0]['relationship'] : '' },
        this.apiForm.field_position = { value: this.aquaintancesForm.value.relativesArr[0]['position'] ? this.aquaintancesForm.value.relativesArr[0]['position'] : '' },
        this.apiForm.field_company = { value: this.aquaintancesForm.value.relativesArr[0]['company'] ? this.aquaintancesForm.value.relativesArr[0]['company'] : '' },

        this.apiForm.field_relatives1 = { value: this.aquaintancesForm.value.relativesArr[1]['names'] ? this.aquaintancesForm.value.relativesArr[1]['names'] : '' },
        this.apiForm.field_relative_relation1 = { value: this.aquaintancesForm.value.relativesArr[1]['relationship'] ? this.aquaintancesForm.value.relativesArr[1]['relationship'] : '' },
        this.apiForm.field_relative_position1 = { value: this.aquaintancesForm.value.relativesArr[1]['position'] ? this.aquaintancesForm.value.relativesArr[1]['position'] : '' },
        this.apiForm.field_relative_company1 = { value: this.aquaintancesForm.value.relativesArr[1]['company'] ? this.aquaintancesForm.value.relativesArr[1]['company'] : '' },

        this.apiForm.field_faculty_reference = { value: this.facultyReference1Form ? this.facultyReference1Form.value : '' },
        this.apiForm.field_faculty_reference1 = { value: this.facultyReference2Form ? this.facultyReference2Form.value : '' },
console.log(this.apiForm);

        this.appConfig.setLocalData('generalFormSubmitted', 'true');
      this.appConfig.setLocalData('confirmClick', 'true');
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
        this.addSkillForm(null);
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
    const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ ]){0,255}$/;
    if (data) {
      return this.fb.group({
        names: [data.names ? data.names : null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        relationship: [data.relationship ? data.relationship : null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        position: [data.position ? data.position : null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        company: [data.company ? data.company : null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
      });
    } else {
      return this.fb.group({
        names: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        relationship: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        position: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        company: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
      });
    }
  }

  createSkillForm(data): FormGroup {
    const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ ]){0,255}$/;
    if (data) {
      return this.fb.group({
        value: [data && data['value'] ? data['value'] : '', [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
      });
    } else {
      return this.fb.group({
        value: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
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
