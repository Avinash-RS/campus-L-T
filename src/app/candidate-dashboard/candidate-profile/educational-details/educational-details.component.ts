import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  today = new Date();
  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'yyyy/MM';
  disabledYears = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };


  educationForm: FormGroup;
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

  FormInitialization() {
    this.educationForm = this.fb.group({
      leveling: [null, [Validators.required]],
      board: [null, [Validators.required]],
      institute: [null, [Validators.required]],
      discipline: [null, [Validators.required]],
      specification: [null, [Validators.required]],
      passedYear: [null, [Validators.required]],
      percentage: [null, [Validators.required]],
    });
  }

  // Form Getters
  get leveling() {
    return this.educationForm.get('leveling');
  }
  get board() {
    return this.educationForm.get('board');
  }
  get institute() {
    return this.educationForm.get('institute');
  }
  get discipline() {
    return this.educationForm.get('discipline');
  }
  get specification() {
    return this.educationForm.get('specification');
  }
  get passedYear() {
    return this.educationForm.get('passedYear');
  }
  get percentage() {
    return this.educationForm.get('percentage');
  }

}
