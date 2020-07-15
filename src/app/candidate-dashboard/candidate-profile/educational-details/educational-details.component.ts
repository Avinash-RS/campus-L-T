import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, NgForm } from '@angular/forms';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import moment from 'moment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { FormCanDeactivate } from 'src/app/guards/form-canDeactivate/form-can-deactivate';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
// import { NzSelectSizeType } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.scss']
})
export class EducationalDetailsComponent extends FormCanDeactivate implements OnInit, OnDestroy {
  @ViewChild('form', { static: false })
  form: NgForm;
  form1: NgForm;
  form2: NgForm;
  form3: NgForm;
  form4: NgForm;
  form5: NgForm;

  level = DropdownListForKYC['level'];

  institutes = DropdownListForKYC['institutes'];
  discipline = DropdownListForKYC['discipline'];
  specialization = DropdownListForKYC['specialization'];

  educationForm: FormGroup;

  startingYear = new Date("2005-01-01");
  endYear = new Date();
  dummystartDate = new Date("2005-01-01");
  dummyendDate = new Date("2020-07-07");
  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'MMM yyyy';

  apiForm: any;
  educationValuearray: any;

  disabledYears = (current: Date): boolean => {

    // Can not select days before today and today
    return differenceInCalendarDays(current, this.startingYear) < 0;
  }
  disabledprevious = (current: Date): any => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.startingYear) < 0;
    // return differenceInCalendarDays(this.dummyendDate, this.dummystartDate) > 0;
  }


  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
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

    if (this.appConfig.getLocalData('educationalFormTouched')) {
      this.appConfig.clearLocalDataOne('educationalFormTouched');
    }
    // tslint:disable-next-line: triple-equals
    if (this.appConfig.getLocalData('field_isformsubmitted') == 'true') {
      this.appConfig.setLocalData('educationalFormSubmitted', 'true');
    }

  }



  cancel() {
    this.ngOnInit();
    this.appConfig.nzNotification('success', 'Resetted', 'Educational details form has been resetted');
  }

  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
    if (this.apiForm['eduArr'] && this.apiForm['eduArr'].length > 0) {
      this.educationValuearray = this.apiForm['eduArr'];
    } else {
      this.educationValuearray = [];
    }

    this.FormInitialization();
  }

  onSubmit(OptA) {

    if (this.educationForm.valid) {

      console.log(this.educationForm.value);

      const edArrays = [];
      this.educationForm.value.educationArr.forEach((element, i) => {
        edArrays.push({ field_level: { value: element.leveling }, field_board_university: { value: element.board }, field_institute: { value: element.institute }, field_discipline: { value: element.discipline }, field_specification: { value: element.specification }, field_year_of_passing: { value: moment(element['passedYear']).format() }, field_backlogs: { value: element.backlogs }, field_percentage: { value: element.percentage } });
      });
      this.apiForm['eduArr'] = edArrays;
      // this.apiForm.field_level = { value: this.educationForm.value.educationArr[0]['leveling'] },
      //   this.apiForm.field_board_university = { value: this.educationForm.value.educationArr[0]['board'] },
      //   this.apiForm.field_institute = { value: this.educationForm.value.educationArr[0]['institute'] },
      //   this.apiForm.field_discipline = { value: this.educationForm.value.educationArr[0]['discipline'] },
      //   this.apiForm.field_specification = { value: this.educationForm.value.educationArr[0]['specification'] },
      //   this.apiForm.field_year_of_passing = { value: moment(this.educationForm.value.educationArr[0]['passedYear']).format() },
      //   this.apiForm.field_percentage = { value: this.educationForm.value.educationArr[0]['percentage'] },
      //   this.apiForm.field_backlogs = { value: this.educationForm.value.educationArr[0]['backlogs'] ? this.educationForm.value.educationArr[0]['backlogs'] : '' },

      this.appConfig.setLocalData('educationalFormSubmitted', 'true');
      this.appConfig.clearLocalDataOne('educationalFormTouched');
      this.appConfig.setLocalData('kycForm', JSON.stringify(this.apiForm));
      this.appConfig.setLocalData('confirmClick', 'true');
      this.appConfig.nzNotification('success', 'Submitted', 'Educational details has been updated');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_FAMILY_DETAILS);

    } else {
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      this.validateAllFormArrays(this.educationForm.get('educationArr') as FormArray);
    }

  }



  educationPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(edu => {
        this.addEducationForm(edu);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addEducationForm(null);
      }
    }
  }
  FormInitialization() {
    this.educationForm = this.fb.group({
      educationArr: this.fb.array([])
    }), this.educationPatch(this.educationValuearray);
  }


  createItem(edu): any {
    const onlyNumbers: RegExp = /^[1-9]\d*(\.\d+)?$/;
    const numberDecimals: RegExp = /^\d*(\.\d{0,2})?$/;
    const numberOnly: RegExp = /^[0-9][0-9]{0,1}$/;
    const percentageDecimals = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
    const alphaNumericMaxLength: RegExp = /^([a-zA-Z0-9_ ]){0,255}$/;
    if (edu) {

      return this.fb.group({
        leveling: [edu.field_level['value'], [RemoveWhitespace.whitespace(), Validators.required]],
        board: [edu.field_board_university['value'], [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace(), Validators.required]],
        institute: [edu.field_institute['value'], [Validators.required]],
        discipline: [edu.field_discipline['value'], [Validators.required]],
        specification: [edu.field_specification['value'], [RemoveWhitespace.whitespace(), Validators.required]],
        passedYear: [edu.field_year_of_passing['value'], [Validators.required]],
        backlogs: [edu.field_backlogs['value'], [Validators.pattern(numberOnly)]],
        percentage: [edu.field_percentage['value'], [Validators.required, Validators.pattern(percentageDecimals)]],
      });
    } else {
      return this.fb.group({
        leveling: [null, [RemoveWhitespace.whitespace(), Validators.required]],
        board: [null, [Validators.pattern(alphaNumericMaxLength), RemoveWhitespace.whitespace(), Validators.required]],
        institute: [null, [Validators.required]],
        discipline: [null, [Validators.required]],
        specification: [null, [RemoveWhitespace.whitespace(), Validators.required]],
        passedYear: [null, [Validators.required]],
        backlogs: [null, [Validators.pattern(numberOnly)]],
        percentage: [null, [Validators.required, Validators.pattern(percentageDecimals)]],
      });
    }
  }

  // convenience getters for easy access to form fields
  get eduArr() { return this.educationForm.get('educationArr') as FormArray; }

  removeEducationForm(i) {
    this.eduArr.removeAt(i);
  }


  addEducationForm(data?: any) {
    if (this.educationForm['status'] !== 'INVALID') {
      this.eduArr.push(this.createItem(data));
    } else {
      this.validateAllFormArrays(this.educationForm.get('educationArr') as FormArray);
    }
  }

  detectSelectChange() {
    this.appConfig.setLocalData('educationalFormTouched', 'true');
  }

  detectInput(form) {
    if (form.touched === true) {
      this.appConfig.setLocalData('educationalFormTouched', 'true');
    }
  }

  // To validate all fields after submit
  validateAllFormArrays(formArray: FormArray) {
    formArray.controls.forEach(formGroup => {
      Object.keys(formGroup['controls']).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          // if (control['status'] === 'INVALID') {
          //   console.log(control);
          //   this.appConfig.setLocalData('educationalFormSubmitted', 'false');
          // }
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
    this.appConfig.clearLocalDataOne('educationalFormTouched');
  }
}
