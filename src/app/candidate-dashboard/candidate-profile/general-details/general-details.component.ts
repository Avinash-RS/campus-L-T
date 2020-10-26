import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { FormCanDeactivate } from 'src/app/guards/form-canDeactivate/form-can-deactivate';
import { differenceInCalendarDays } from 'date-fns/esm';
import * as moment from "moment";
// import {extendMoment} from 'moment-range';
// import moment from 'moment';
// import moment from 'moment-precise-range-plugin';
import { FormCustomValidators } from 'src/app/custom-form-validators/autocompleteDropdownMatch';

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

  familyForm: FormGroup;

  dateFormat = 'dd/MM/yyyy';
  monthFormat = 'yyyy/MM';
  familyValuesArr: any;
  today = new Date();
  notShow: boolean;

  yes = false;
  no = false;
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

    // this.valueChangesWork();
  }

  cancel() {
    this.ngOnInit();
    this.appConfig.nzNotification('success', 'Resetted', 'General details form has been resetted');
  }


  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
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

    this.aquaintancesForm = this.fb.group({
      relativesArr: this.fb.array([])
    }), this.generalPatch(this.generalArray);

    this.skillForm = this.fb.group({
      skillsArr: this.fb.array([])
    }), this.generalSkillPatch(this.skillValueArray);
  }

  createItem1(fam): FormGroup {
    // /^[1-9][0-9]{9}$/;
    const onlyNumbers: RegExp = /^[1-9]\d*(\.\d+)?$/;
    const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ \-,.;]){0,255}$/;
    if (fam) {
      return this.fb.group({
        names: [fam['field_name_of_your_family']['value'], [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        dateFrom: [(fam['field_family_date_of_birth']['value'] && fam['field_family_date_of_birth']['value'] != 'Invalid date') ? fam['field_family_date_of_birth']['value'] : null],
        dateTo: [(fam['field_family_date_of_birth']['value'] && fam['field_family_date_of_birth']['value'] != 'Invalid date') ? fam['field_family_date_of_birth']['value'] : null],
        dateYear: [(fam['field_family_date_of_birth']['value'] && fam['field_family_date_of_birth']['value'] != 'Invalid date') ? fam['field_family_date_of_birth']['value'] : null],
        dateMonth: [(fam['field_family_date_of_birth']['value'] && fam['field_family_date_of_birth']['value'] != 'Invalid date') ? fam['field_family_date_of_birth']['value'] : null],
        position: [fam['field_relationship']['value'], [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        supervisor: [fam['field_occupation']['value'], [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        gross: [fam['field_occupation']['value'], [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        nature: [fam['field_occupation']['value'], [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        leaving: [fam['field_occupation']['value'], [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
      },
        { validator: FormCustomValidators.FamilyanyOneSelected }
      );
    } else {
      return this.fb.group({
        names: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        dateFrom: [null],
        dateTo: [null],
        dateYear: [null],
        dateMonth: [null],
        position: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        supervisor: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        gross: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        nature: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        leaving: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
      },
        { validator: FormCustomValidators.WorkanyOneSelected }
      );
    }
  }


  removefamilyForm() {
    // this.familyArr.removeAt(i);
    this.familyArr.removeAt(this.familyArr.controls.length - 1);
    if (this.familyArr.length < 5) {
      this.notShow = false;
    } else {
      this.notShow = true;
    }
  }

  addfamilyForm(data?: any) {
    if (this.familyForm.valid) {
      console.log(this.familyForm.value);

      if (this.familyArr.length < 5) {
        this.familyArr.push(this.createItem1(data));
        if (this.familyArr.length < 5) {
          this.notShow = false;
        } else {
          this.notShow = true;
        }
      }
    } else {
      this.validateAllFormArrays(this.familyForm.get('familyArr') as FormArray);
    }

  }
  // convenience getters for easy access to form fields
  get familyArr(): any { return this.familyForm.get('familyArr') as FormArray; }

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
        value: [data && data['value'] ? data['value'] : '', [RemoveWhitespace.whitespace(), Validators.maxLength(255)]],
      });
    } else {
      return this.fb.group({
        value: [null, [RemoveWhitespace.whitespace(), Validators.maxLength(255)]],
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
  detectDateCalc(form, i) {
    console.log(form, i);
    if (this.familyArr) {
     let yearCount = 0;
     let monthCount = 0;
      this.familyArr.value.forEach((element, index) => {
        if (index == i && element['dateFrom'] && element['dateTo']) {
          console.log(element['dateFrom']);
          console.log(element['dateTo']);

          let today = new Date(`${element['dateTo']}`)
          let past = new Date(`${element['dateFrom']}`) // remember this is equivalent to 06 01 2010
          console.log(today, past);
          //dates in js are counted from 0, so 05 is june

          // function calcDate(date1,date2) {
          let diff = Math.floor(today.getTime() - past.getTime());
          let day = 1000 * 60 * 60 * 24;

          let days = Math.floor(diff / day);
          let months = Math.floor(days / 31);
          let years = Math.floor(months / 12);

          if (months > 12) {
            let a = Number(months) / 12;
            if (Number.isInteger(a)) {
              form[i].patchValue({
                dateMonth: '0',
                dateYear: a.toString()
              });
            } else {
              let b = Math.floor(a);
              let m = Number(b) * 12;
              let diff = Number(months) - m;
              form[i].patchValue({
                dateMonth: diff.toString(),
                dateYear: b.toString()
              });
            }
          } else {
            form[i].patchValue({
              dateMonth: months.toString(),
              dateYear: '0'
            });
          }
        }

        if (element['dateFrom']) {
          monthCount += Number(element['dateMonth']);
          yearCount += Number(element['dateYear']);
        }

        console.log(yearCount, monthCount);
        
      });
    };
    this.appConfig.setLocalData('generalFormTouched', 'true');
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
