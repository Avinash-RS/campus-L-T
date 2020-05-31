import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss']
})
export class FamilyDetailsComponent implements OnInit {
  familyForm: FormGroup;

  dateFormat = 'dd MMM yyyy';
  monthFormat = 'yyyy/MM';

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
    if (this.familyForm.valid) {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_GENERAL_DETAILS);
      console.log(this.familyForm.value);
    } else {
      this.validateAllFormArrays(this.familyForm.get('familyArr') as FormArray);
    }
  }

  FormInitialization() {
    this.familyForm = this.fb.group({
      familyArr: this.fb.array([this.createItem()])
    });
  }
  createItem(): FormGroup {
    // /^[1-9][0-9]{9}$/;
    const onlyNumbers: RegExp = /^[1-9]\d*(\.\d+)?$/;
    return this.fb.group({
      names: [null],
      dob: [null],
      relationship: [null],
      occupation: [null],
    });
  }

  removefamilyForm(i) {
    this.familyArr.removeAt(i);
  }

  addfamilyForm() {
    if (this.familyForm.valid) {
      this.familyArr.push(this.createItem());
    } else {
      this.validateAllFormArrays(this.familyForm.get('familyArr') as FormArray);
    }

  }
  // convenience getters for easy access to form fields
  get familyArr() { return this.familyForm.get('familyArr') as FormArray; }


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
