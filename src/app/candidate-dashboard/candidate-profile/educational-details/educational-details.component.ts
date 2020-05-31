import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { CONSTANT } from 'src/app/constants/app-constants.service';
// import { NzSelectSizeType } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.scss']
})
export class EducationalDetailsComponent implements OnInit {

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
  }

  onSubmit() {
    if (this.educationForm.valid) {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_FAMILY_DETAILS);
      console.log(this.educationForm.value);
    } else {
      this.validateAllFormArrays(this.educationForm.get('educationArr') as FormArray);
    }

  }

  FormInitialization() {
    this.educationForm = this.fb.group({
      educationArr: this.fb.array([this.createItem()])
    });
  }
  createItem(): FormGroup {
    // /^[1-9][0-9]{9}$/;
    const onlyNumbers: RegExp = /^[1-9]\d*(\.\d+)?$/;
    const numberDecimals: RegExp = /^\d*(\.\d{0,2})?$/;
    return this.fb.group({
      leveling: [null, [Validators.required]],
      board: [null, [Validators.required]],
      institute: [null, [Validators.required]],
      discipline: [null, [Validators.required]],
      specification: [null, [Validators.required]],
      passedYear: [null, [Validators.required]],
      percentage: [null, [Validators.required, Validators.maxLength(5), Validators.pattern(numberDecimals)]],
    });
  }

  removeEducationForm(i) {
    this.eduArr.removeAt(i);
  }

  addEducationForm() {
    if (this.educationForm.valid) {
      this.eduArr.push(this.createItem());
    } else {
      this.validateAllFormArrays(this.educationForm.get('educationArr') as FormArray);
    }
  }
  // convenience getters for easy access to form fields
  get eduArr() { return this.educationForm.get('educationArr') as FormArray; }


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

}
