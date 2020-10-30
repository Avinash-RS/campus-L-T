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

  interviewed_by_us = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  oc = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  payslip = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  post = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  when_interview = new FormControl(null, [Validators.maxLength(254), RemoveWhitespace.whitespace()]);
  criminal_record = new FormControl('', [Validators.maxLength(254), RemoveWhitespace.whitespace()]);

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
      console.log('1', this.apiForm['full_employment']);
      
      this.familyValuesArr = this.apiForm['full_employment'];
    } else {
      console.log('2', this.apiForm['full_employment']);
      this.familyValuesArr = [];
    }

      this.criminal_record.setValue(this.apiForm.criminal_record ? this.apiForm.criminal_record : '');
      this.fullYearBinding = this.apiForm.total_exp_years ? this.apiForm.total_exp_years : '';
      this.monthYearBinding = this.apiForm.total_exp_months ? this.apiForm.total_exp_months : '';
      this.emp_yes = this.apiForm.employed_us ? true : false;
      this.emp_no = this.apiForm.employed_us ? false : true;
      this.oc.setValue(this.apiForm.oc ? this.apiForm.oc : '');
      this.payslip.setValue(this.apiForm.payslip ? this.apiForm.payslip : '');
      this.interviewed_by_us.setValue(this.apiForm.interviewed_by_us ? this.apiForm.interviewed_by_us : '');
      this.post.setValue(this.apiForm.post ? this.apiForm.post : '');
      this.when_interview.setValue(this.apiForm.when_interview ? this.apiForm.when_interview : null);


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


      if (this.familyForm.valid && this.interviewed_by_us.valid && this.oc.valid && this.payslip.valid && this.post.valid && this.when_interview.valid && this.criminal_record.valid) {
        this.apiForm.criminal_record = this.criminal_record.value ? this.criminal_record.value : '';
        this.apiForm.total_exp_years = this.fullYearBinding ? this.fullYearBinding : '';
        this.apiForm.total_exp_months = this.monthYearBinding ? this.monthYearBinding : '';
        this.apiForm.employed_us = this.emp_yes ? this.emp_yes : false;
          this.apiForm.oc = this.oc.value ? this.oc.value : '';
        this.apiForm.payslip = this.payslip.value ? this.payslip.value : '';
        this.apiForm.interviewed_by_us = this.interviewed_by_us.value ? this.interviewed_by_us.value : '';
        this.apiForm.post = this.post.value ? this.post.value : '';
        this.apiForm.when_interview = this.when_interview.value ? this.when_interview.value : null;
        this.apiForm.full_employment = this.familyForm['value']['familyArr'];



        this.appConfig.setLocalData('generalFormSubmitted', 'true');
        this.appConfig.setLocalData('confirmClick', 'true');
        this.appConfig.clearLocalDataOne('generalFormTouched');
        this.appConfig.setLocalData('kycForm', JSON.stringify(this.apiForm));

        this.appConfig.nzNotification('success', 'Submitted', 'General details has been updated');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
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
        console.log('123', fam);
        
        this.addfamilyForm(fam);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        console.log('not');
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
      console.log('adadadfsf', fam);
      
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
      console.log(this.familyForm.value);
      if (this.familyArr.length < 5) {
        console.log('add', this.familyArr.length, data);
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
        if (index == i && element['duration_from'] && element['duration_to']) {
          console.log(element['duration_from']);
          console.log(element['duration_to']);

          let today = new Date(`${element['duration_to']}`)
          let past = new Date(`${element['duration_from']}`) // remember this is equivalent to 06 01 2010
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
