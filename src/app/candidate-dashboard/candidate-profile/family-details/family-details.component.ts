import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

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
      names: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      relationship: [null, [Validators.required]],
      occupation: [null, [Validators.required]],
    });
  }

  removefamilyForm(i) {
    this.familyArr.removeAt(i);
  }

  addfamilyForm() {
    this.familyArr.push(this.createItem());
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
