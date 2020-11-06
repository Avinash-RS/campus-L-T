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

  disable1 = false;
  disable2 = false;
  criminal_record = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  break_in_emp = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  interviewed_by_us = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  oc = new FormControl({value: '', disabled: this.disable1 }, [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  payslip = new FormControl({value: '', disabled: this.disable1 }, [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  post = new FormControl({value: '', disabled: this.disable2 }, [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  when_interview = new FormControl({value: '', disabled: this.disable2 }, [Validators.maxLength(254), RemoveWhitespace.whitespace()]);

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

  emp_yes = false;
  emp_no = false;
  inv_yes = false;
  inv_no = false;

  disabledYears = (current: Date): boolean => {

    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  }
  fullYearBinding: any;
  monthYearBinding: any;

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

  matchangeYes(e) {
    this.emp_yes = e.checked;
    this.emp_no = !this.emp_yes;
    if (this.emp_yes) {
      this.disable1 = false;
      this.oc.enable();
      this.payslip.enable();
      this.oc.setValidators([Validators.required]);
      this.payslip.setValidators([Validators.required]);
      this.oc.updateValueAndValidity();
      this.payslip.updateValueAndValidity();
    }
  }
  matchangeNo(e) {
    this.emp_no = e.checked;
    this.emp_yes = !this.emp_no;
    if (this.emp_no) {
      this.oc.setValue('');
      this.payslip.setValue('');
      this.oc.clearValidators();
      this.payslip.clearValidators();
      this.oc.updateValueAndValidity();
      this.payslip.updateValueAndValidity();
    }
  }

  matchangeinvYes(e) {
    this.inv_yes = e.checked;
    this.inv_no = !this.inv_yes;
    if (this.inv_yes) {
      this.disable2 = false;
      this.post.enable();
      this.when_interview.enable();
      this.post.setValidators([Validators.required]);
      this.when_interview.setValidators([Validators.required]);
      this.post.updateValueAndValidity();
      this.when_interview.updateValueAndValidity();
    }
  }
  matchangeinvNo(e) {
    this.inv_no = e.checked;
    this.inv_yes = !this.inv_no;
    if (this.inv_no) {
      this.post.setValue('');
      this.when_interview.setValue('');
      this.post.clearValidators();
      this.when_interview.clearValidators();
      this.post.updateValueAndValidity();
      this.when_interview.updateValueAndValidity();
    }
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

    if (this.apiForm['full_employment'] && this.apiForm['full_employment'].length > 0) {      
      this.familyValuesArr = this.apiForm['full_employment'];
    } else {
      this.familyValuesArr = [];
    }

      this.criminal_record.setValue(this.apiForm.criminal_record ? this.apiForm.criminal_record : '');
      this.fullYearBinding = this.apiForm.total_exp_years ? this.apiForm.total_exp_years : '';
      this.monthYearBinding = this.apiForm.total_exp_months ? this.apiForm.total_exp_months : '';
      this.emp_yes = this.apiForm.employed_us ? true : false;
      this.emp_no = this.apiForm.employed_us ? false : true;
      this.inv_yes = this.apiForm.interviewed_by_us ? true : false;
      this.inv_no = this.apiForm.interviewed_by_us ? false : true;
      this.oc.setValue(this.apiForm.oc ? this.apiForm.oc : '');
      this.payslip.setValue(this.apiForm.payslip ? this.apiForm.payslip : '');
      this.break_in_emp.setValue(this.apiForm.break_in_emp ? this.apiForm.break_in_emp : '');
      this.post.setValue(this.apiForm.post ? this.apiForm.post : '');
      this.when_interview.setValue(this.apiForm.when_interview ? this.apiForm.when_interview : null);
      if (this.emp_yes) {
        this.oc.setValidators([Validators.required]);
        this.payslip.setValidators([Validators.required]);
        this.oc.updateValueAndValidity();
        this.payslip.updateValueAndValidity();
          }
      if (this.inv_yes) {
        this.post.setValidators([Validators.required]);
        this.when_interview.setValidators([Validators.required]);  
        this.post.updateValueAndValidity();
        this.when_interview.updateValueAndValidity();
        }


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
        this.apiForm.field_faculty_reference1 = { value: this.facultyReference2Form ? this.facultyReference2Form.value : '' };
      
      if (this.familyForm.valid && this.break_in_emp.valid && this.oc.valid && this.payslip.valid && this.post.valid && this.when_interview.valid && this.criminal_record.valid) {
        this.apiForm.criminal_record = this.criminal_record.value ? this.criminal_record.value : '';
        this.apiForm.total_exp_years = this.fullYearBinding ? this.fullYearBinding : '';
        this.apiForm.total_exp_months = this.monthYearBinding ? this.monthYearBinding : '';
        this.apiForm.oc = this.oc.value ? this.oc.value : '';
        this.apiForm.payslip = this.payslip.value ? this.payslip.value : '';
        this.apiForm.break_in_emp = this.break_in_emp.value ? this.break_in_emp.value : '';
        this.apiForm.post = this.post.value ? this.post.value : '';
        this.apiForm.when_interview = this.when_interview.value ? this.when_interview.value : null;
        this.apiForm.employed_us = this.emp_yes ? this.emp_yes : false;
        this.apiForm.interviewed_by_us = this.inv_yes ? this.inv_yes : false;

        this.apiForm.full_employment = this.familyForm['value']['familyArr'];



        this.appConfig.setLocalData('generalFormSubmitted', 'true');
        this.appConfig.setLocalData('confirmClick', 'true');
        this.appConfig.clearLocalDataOne('generalFormTouched');
        this.appConfig.setLocalData('kycForm', JSON.stringify(this.apiForm));

        this.appConfig.nzNotification('success', 'Submitted', 'General details has been updated');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
      } else {
        this.break_in_emp.markAsTouched();
        this.oc.markAsTouched();
        this.payslip.markAsTouched();
        this.post.markAsTouched();
        this.when_interview.markAsTouched();
        this.criminal_record.markAsTouched();
        this.validateAllFormArrays(this.familyForm.get('familyArr') as FormArray);
        this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      }
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

    this.aquaintancesForm = this.fb.group({
      relativesArr: this.fb.array([])
    }), this.generalPatch(this.generalArray);

    this.skillForm = this.fb.group({
      skillsArr: this.fb.array([])
    }), this.generalSkillPatch(this.skillValueArray);

    this.familyForm = this.fb.group({
      familyArr: this.fb.array([])
    }), this.familyPatch(this.familyValuesArr);

  }

  createItem1(fam): FormGroup {
    // /^[1-9][0-9]{9}$/;
    const onlyNumbers: RegExp = /^[1-9]\d*(\.\d+)?$/;
    const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ \-,.;]){0,255}$/;
    if (fam) {
      
      return this.fb.group({
        employment_name_address: [fam['employment_name_address'] ? fam['employment_name_address'] : '', [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        duration_from: [(fam['duration_from'] && fam['duration_from'] != 'Invalid date') ? fam['duration_from'] : null],
        duration_to: [(fam['duration_to'] && fam['duration_to'] != 'Invalid date') ? fam['duration_to'] : null],
        duration_year: [(fam['duration_year'] && fam['duration_year'] != 'Invalid date') ? fam['duration_year'] : null],
        duration_month: [(fam['duration_month'] && fam['duration_month'] != 'Invalid date') ? fam['duration_month'] : null],
        postion_field: [fam['postion_field'] ? fam['postion_field'] : '', [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        name_designation_supervisor: [fam['name_designation_supervisor'] ? fam['name_designation_supervisor'] : '', [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        gross_emploment: [fam['gross_emploment'] ? fam['gross_emploment'] : '', [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        nature_work: [fam['nature_work'] ? fam['nature_work'] : '', [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        reason_leaving: [fam['reason_leaving'] ? fam['reason_leaving'] : '', [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
      },
        { validator: FormCustomValidators.WorkanyOneSelected }
      );
    } else {
      return this.fb.group({
        employment_name_address: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        duration_from: [null],
        duration_to: [null],
        duration_year: [null],
        duration_month: [null],
        postion_field: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        name_designation_supervisor: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        gross_emploment: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        nature_work: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
        reason_leaving: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace()]],
      },
        { validator: FormCustomValidators.WorkanyOneSelected }
      );
    }
  }


  removefamilyForm(form) {
    // this.familyArr.removeAt(i);
    this.familyArr.removeAt(this.familyArr.controls.length - 1);
    let monthCount = 0;
    let yearCount = 0;
    form.forEach(ele => {
      monthCount += Number(ele['controls']['duration_month']['value']);
      yearCount += Number(ele['controls']['duration_year']['value']);
      if (monthCount > 12) {
        let y; let m;
        y = Math.floor(monthCount / 12);
        m = monthCount % 12;
        this.fullYearBinding = yearCount + y;
        this.monthYearBinding = m;
      } else {
        this.fullYearBinding = yearCount;
        this.monthYearBinding = monthCount;
      }
    });

    if (this.familyArr.length < 5) {
      this.notShow = false;
    } else {
      this.notShow = true;
    }
  }

  addfamilyForm(data?: any) {
    if (this.familyForm.valid) {
      if (this.familyArr.length < 3) {
        if (this.familyArr.length >= 1) {
          let i = this.familyArr['controls'].length-1;
          if (this.familyArr && this.familyArr['controls'] && this.familyArr['controls'][i] && this.familyArr['controls'][i]['value'] && this.familyArr['controls'][i]['value']['employment_name_address']) {
            this.familyArr.push(this.createItem1(data));
          } else {
          }        
        } else {
          this.familyArr.push(this.createItem1(data));
        }
        if (this.familyArr.length < 3) {
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
    if (this.familyArr) {
      let yearCount = 0;
      let monthCount = 0;
      this.familyArr.value.forEach((element, index) => {
        if (index == i && element['duration_from'] && element['duration_to']) {

          let today = new Date(`${element['duration_to']}`)
          let past = new Date(`${element['duration_from']}`) // remember this is equivalent to 06 01 2010
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
                duration_month: '0',
                duration_year: a.toString()
              });
            } else {
              let b = Math.floor(a);
              let m = Number(b) * 12;
              let diff = Number(months) - m;
              form[i].patchValue({
                duration_month: diff.toString(),
                duration_year: b.toString()
              });
            }
          } else {
            form[i].patchValue({
              duration_month: months.toString(),
              duration_year: '0'
            });
          }

          if (element['duration_from']) {
            form.forEach(ele => {
              monthCount += Number(ele['controls']['duration_month']['value']);
              yearCount += Number(ele['controls']['duration_year']['value']);
              if (monthCount > 12) {
                let y; let m;
                y = Math.floor(monthCount / 12);
                m = monthCount % 12;
                this.fullYearBinding = yearCount + y;
                this.monthYearBinding = m;
              } else {
                this.fullYearBinding = yearCount;
                this.monthYearBinding = monthCount;
              }
            });
          }

        }


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
