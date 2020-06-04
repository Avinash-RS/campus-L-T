import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import moment from 'moment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
// import { NzSelectSizeType } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.scss']
})
export class EducationalDetailsComponent implements OnInit, OnDestroy {

  level = [
    {
      name: 'SSLC',
      value: 'sslc'
    },
    {
      name: 'HSC',
      value: 'hsc'
    },
    {
      name: 'Diplamo',
      value: 'diplamo'
    },
    {
      name: 'Under Graduation',
      value: 'ug'
    },
    {
      name: 'Post Graduation',
      value: 'pg'
    },
    {
      name: 'Other',
      value: 'other'
    }
  ];
  educationForm: FormGroup;

  today = new Date();
  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'yyyy/MM';

  apiForm: any;

  disabledYears = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  }
  educationValuearray: any;


  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
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

  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
    this.educationValuearray = [{
      leveling: this.apiForm && this.apiForm['field_level'] ? this.apiForm['field_level'].value : null,
      board: this.apiForm && this.apiForm['field_board_university'] ? this.apiForm['field_board_university'].value : null,
      institute: this.apiForm && this.apiForm['field_institute'] ? this.apiForm['field_institute'].value : null,
      discipline: this.apiForm && this.apiForm['field_discipline'] ? this.apiForm['field_discipline'].value : null,
      specification: this.apiForm && this.apiForm['field_specification'] ? this.apiForm['field_specification'].value : null,
      passedYear: this.apiForm && this.apiForm['field_year_of_passing'] ? this.apiForm['field_year_of_passing'].value : null,
      percentage: this.apiForm && this.apiForm['field_percentage'] ? this.apiForm['field_percentage'].value : null,
    }];

    this.FormInitialization();
  }

  onSubmit(OptA) {
    if (this.educationForm.valid) {

      console.log(this.educationForm.value);

      this.apiForm.field_level = { value: this.educationForm.value.educationArr[0]['leveling'] },
        this.apiForm.field_board_university = { value: this.educationForm.value.educationArr[0]['board'] },
        this.apiForm.field_institute = { value: this.educationForm.value.educationArr[0]['institute'] },
        this.apiForm.field_discipline = { value: this.educationForm.value.educationArr[0]['discipline'] },
        this.apiForm.field_specification = { value: this.educationForm.value.educationArr[0]['specification'] },
        this.apiForm.field_year_of_passing = { value: moment(this.educationForm.value.educationArr[0]['passedYear']).format() },
        this.apiForm.field_percentage = { value: this.educationForm.value.educationArr[0]['percentage'] },


        this.appConfig.setLocalData('educationalFormSubmitted', 'true');
      this.appConfig.clearLocalDataOne('educationalFormTouched');
      this.appConfig.setLocalData('kycForm', JSON.stringify(this.apiForm));
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
    const percentageDecimals = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?%?$)/;
    if (edu) {
      return this.fb.group({
        leveling: [edu.leveling, [Validators.required]],
        board: [edu.board, [Validators.required]],
        institute: [edu.institute, [Validators.required]],
        discipline: [edu.discipline, [Validators.required]],
        specification: [edu.specification, [Validators.required]],
        passedYear: [edu.passedYear, [Validators.required]],
        percentage: [edu.percentage, [Validators.required, Validators.pattern(percentageDecimals)]],
      });
    } else {
      return this.fb.group({
        leveling: [null, [Validators.required]],
        board: [null, [Validators.required]],
        institute: [null, [Validators.required]],
        discipline: [null, [Validators.required]],
        specification: [null, [Validators.required]],
        passedYear: [null, [Validators.required]],
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
          if (control['status'] === 'INVALID') {
            console.log(control);
            this.appConfig.setLocalData('educationalFormSubmitted', 'false');
          }
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
