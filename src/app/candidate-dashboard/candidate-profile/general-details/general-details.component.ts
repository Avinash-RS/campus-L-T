import { Component, OnInit } from '@angular/core';
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
export class GeneralDetailsComponent implements OnInit {

  aquaintancesForm: FormGroup;
  skillForm: FormGroup;

  facultyReference1;
  facultyReference2;
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
    if (this.aquaintancesForm.valid && this.skillForm.valid) {
      console.log(this.aquaintancesForm.value);
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
    } else {
      this.validateAllFormArrays(this.aquaintancesForm.get('relativesArr') as FormArray);
      this.validateAllFormArrays(this.skillForm.get('skillsArr') as FormArray);
    }
  }

  FormInitialization() {
    this.aquaintancesForm = this.fb.group({
      relativesArr: this.fb.array([this.createItem(), this.createItem()])
    });

    this.skillForm = this.fb.group({
      skillsArr: this.fb.array([this.createSkillForm()])
    });
  }
  createItem(): FormGroup {
    // /^[1-9][0-9]{9}$/;
    const onlyNumbers: RegExp = /^[1-9]\d*(\.\d+)?$/;
    return this.fb.group({
      names: [null],
      relationship: [null],
      position: [null],
      company: [null],
    });
  }

  createSkillForm(): FormGroup {
    return this.fb.group({
      skill: [null],
    });
  }

  removeSkillForm(i) {
    this.skillsArr.removeAt(i);
  }

  addSkillForm() {
    if (this.skillForm.valid) {
      this.skillsArr.push(this.createSkillForm());
    } else {
      this.validateAllFormArrays(this.skillForm.get('skillsArr') as FormArray);
    }
  }

  removeaquaintancesForm(i) {
    this.relativesArr.removeAt(i);
  }

  addaquaintancesForm() {
    this.relativesArr.push(this.createItem());
  }
  // convenience getters for easy access to form fields
  get relativesArr() { return this.aquaintancesForm.get('relativesArr') as FormArray; }
  get skillsArr() { return this.skillForm.get('skillsArr') as FormArray; }


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
