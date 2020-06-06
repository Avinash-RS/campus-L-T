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
    this.apiForm['field_profile_image'][0]['url'] = this.apiForm['field_profile_image'][0]['url'].replace('http://104.211.226.77', '');

    console.log(this.apiForm);
  }

  onSubmit() {
    this.apiForm.field_isformsubmitted = [{ value: true }];
    if (this.appConfig.getLocalData('profileData')) {
      // tslint:disable-next-line: quotemark
      if (this.appConfig.getLocalData('profileData') !== "undefined") {
        let pro = JSON.parse(this.appConfig.getLocalData('profileData'));
        this.apiForm.field_profile_image = [
          {
            target_id: pro && pro['fid'] ? pro['fid'] : 12,
            alt: 'Image',
            title: '',
            width: 210,
            height: 230,
            // target_uuid: pro && pro['uuid'] ? pro['uuid'] : 'abc',
            url: pro && pro['apiUrl'] ? pro['apiUrl'] : '/d8cintana2/sites/default/files/2020-06/filename1_1.jpg',
            status: 'true'
          }
        ];
      }
    }

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

  cancel() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
  }
}
