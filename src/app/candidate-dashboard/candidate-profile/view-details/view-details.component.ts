import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {

  radioIsChecked = 'checked';

  languages = [
    {
      name: 'English',
      proficiency: {
        read: true,
        write: true,
        speak: false
      }
    },
    {
      name: 'Tamil',
      proficiency: {
        read: false,
        write: true,
        speak: true
      }
    },
    {
      name: 'English',
      proficiency: {
        read: false,
        write: true,
        speak: false
      }
    },
  ]
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.candidateService.getUserProfile().subscribe((data: any) => {
      console.log(data);
      this.appConfig.hideLoader();
    }, (error) => {

    });
  }

  onSubmit() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_CONFIRM);
  }
}
