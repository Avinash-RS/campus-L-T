import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import moment from 'moment';
import { differenceInCalendarDays } from 'date-fns/esm';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss']
})
export class FamilyDetailsComponent implements OnInit, OnDestroy {
  familyForm: FormGroup;

  dateFormat = 'dd/MM/yyyy';
  monthFormat = 'yyyy/MM';
  apiForm: any;
  familyValuesArr: any;
  today = new Date();

  disabledYears = (current: Date): boolean => {

    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  }

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

    if (this.appConfig.getLocalData('familyFormTouched')) {
      this.appConfig.clearLocalDataOne('familyFormTouched');
    }
    // tslint:disable-next-line: triple-equals
    if (this.appConfig.getLocalData('field_isformsubmitted') == 'true') {
      this.appConfig.setLocalData('familyFormSubmitted', 'true');
    }
  }

  cancel() {
    this.ngOnInit();
    this.appConfig.nzNotification('success', 'Resetted', 'Family details form has been resetted');
  }

  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
    this.familyValuesArr = [{
      names: this.apiForm && this.apiForm['field_name_of_your_family_member'] ? this.apiForm['field_name_of_your_family_member'].value : null,
      dob: this.apiForm && this.apiForm['field_family_date_of_birth'] ? this.apiForm['field_family_date_of_birth'].value : null,
      relationship: this.apiForm && this.apiForm['field_relationship'] ? this.apiForm['field_relationship'].value : null,
      occupation: this.apiForm && this.apiForm['field_occupation'] ? this.apiForm['field_occupation'].value : null,
    }];
    this.FormInitialization();
  }

  onSubmit(OptA) {
    if (this.familyForm.valid) {
      // this.apiForm.field_board_university = { value: this.educationForm.value.educationArr[0]['board'] },

      this.apiForm.field_name_of_your_family_member = { value: this.familyForm.value.familyArr[0]['names'] ? this.familyForm.value.familyArr[0]['names'] : '' },
        this.apiForm.field_family_date_of_birth = { value: moment(this.familyForm.value.familyArr[0]['dob']).format() !== 'Invalid date' ? moment(this.familyForm.value.familyArr[0]['dob']).format() : '' },
        this.apiForm.field_relationship = { value: this.familyForm.value.familyArr[0]['relationship'] ? this.familyForm.value.familyArr[0]['relationship'] : '' },
        this.apiForm.field_occupation = { value: this.familyForm.value.familyArr[0]['occupation'] ? this.familyForm.value.familyArr[0]['occupation'] : '' };

      console.log(this.apiForm);

      this.appConfig.setLocalData('familyFormSubmitted', 'true');
      this.appConfig.clearLocalDataOne('familyFormTouched');
      this.appConfig.setLocalData('kycForm', JSON.stringify(this.apiForm));

      this.appConfig.nzNotification('success', 'Submitted', 'Family details has been updated');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_GENERAL_DETAILS);
      console.log(this.familyForm.value);
    } else {
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      this.validateAllFormArrays(this.familyForm.get('familyArr') as FormArray);
    }
  }

  // Family Patch
  familyPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(fam => {
        this.addfamilyForm(fam);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addfamilyForm(null);
      }
    }
  }

  FormInitialization() {
    this.familyForm = this.fb.group({
      familyArr: this.fb.array([])
    }), this.familyPatch(this.familyValuesArr);
  }
  createItem(fam): FormGroup {
    // /^[1-9][0-9]{9}$/;
    const onlyNumbers: RegExp = /^[1-9]\d*(\.\d+)?$/;
    if (fam) {
      return this.fb.group({
        names: [fam.names, RemoveWhitespace.whitespace()],
        dob: [fam.dob],
        relationship: [fam.relationship, RemoveWhitespace.whitespace()],
        occupation: [fam.occupation, RemoveWhitespace.whitespace()],
      });
    } else {
      return this.fb.group({
        names: [null, RemoveWhitespace.whitespace()],
        dob: [null],
        relationship: [null, RemoveWhitespace.whitespace()],
        occupation: [null, RemoveWhitespace.whitespace()],
      });
    }
  }

  removefamilyForm(i) {
    this.familyArr.removeAt(i);
  }

  addfamilyForm(data?: any) {
    if (this.familyForm.valid) {
      this.familyArr.push(this.createItem(data));
    } else {
      this.validateAllFormArrays(this.familyForm.get('familyArr') as FormArray);
    }

  }
  // convenience getters for easy access to form fields
  get familyArr() { return this.familyForm.get('familyArr') as FormArray; }

  detectSelectChange() {
    this.appConfig.setLocalData('familyFormTouched', 'true');
  }

  detectInput(form) {
    if (form.touched === true) {
      this.appConfig.setLocalData('familyFormTouched', 'true');
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
    this.appConfig.clearLocalDataOne('familyFormTouched');
  }
}
