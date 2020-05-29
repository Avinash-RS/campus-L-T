import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '',
        name: 'PERSONAL DETAILS',
        router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_PERSONAL_DETAILS
      },
      {
        icon: '',
        name: 'EDUCATIONAL DETAILS',
        router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_EDUCATIONAL_DETAILS
      },
      {
        icon: '',
        name: 'FAMILY DETAILS',
        router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_FAMILY_DETAILS
      },
      {
        icon: '',
        name: 'GENERAL DETAILS',
        router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_GENERAL_DETAILS
      },
      {
        icon: '',
        name: 'VIEW DETAILS',
        router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS
      },
      {
        icon: '',
        name: 'CONFIRM',
        router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_CONFIRM
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);

  }


  ngOnInit() {
  }

}
