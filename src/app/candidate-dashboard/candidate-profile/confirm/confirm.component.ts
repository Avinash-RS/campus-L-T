import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  apiForm: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getLocalForm();
  }

  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
    // this.apiForm.field_year_of_passing = {value: ''};
    // // this.apiForm.field_dob = {value: ''};
    console.log(this.apiForm);
  }

  onSubmit() {

    this.candidateService.editUser(this.apiForm).subscribe((data: any) => {
      console.log('success', data);
      this.appConfig.hideLoader();
      this.appConfig.clearLocalDataOne('KYCAPI');
      this.appConfig.clearLocalDataOne('kycForm');
      this.appConfig.nzNotification('success', 'Submitted', 'Your KYC form has been successfully submitted');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
    }, (err) => {

    });
  }
}
