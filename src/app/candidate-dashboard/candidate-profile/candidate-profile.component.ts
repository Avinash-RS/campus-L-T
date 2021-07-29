import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
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
    if (this.appConfig.getLocalData('reDirectView') && this.appConfig.getLocalData('reDirectView') === 'true') {
      // Sub-Navigation menus. This will be retrieved in Admin master component
      const subWrapperMenus = [
        {
          icon: '',
          name: 'VIEW DETAILS',
          router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS
        },
      ];
      this.sharedService.subMenuSubject.next(subWrapperMenus);
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
    }
    // else {
    //   this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_PERSONAL_DETAILS);
    // }
    // this.getUserKYC();
    this.appConfig.clearLocalDataOne('personalFormTouched');
    this.appConfig.clearLocalDataOne('educationalFormTouched');
    this.appConfig.clearLocalDataOne('familyFormTouched');
    this.appConfig.clearLocalDataOne('generalFormTouched');
  }

  getUserKYC() {
    this.candidateService.getUserProfile().subscribe((data: any) => {
      this.appConfig.setLocalData('ParentKYCAPI', JSON.stringify(data));

      if (data && data.length > 0) {
        if (data[0]['field_isformsubmitted'][0]['value'] === true) {
          this.appConfig.setLocalData('field_isformsubmitted', 'true');
        } else {
          this.appConfig.setLocalData('field_isformsubmitted', 'false');
        }
      } else {
        this.appConfig.setLocalData('field_isformsubmitted', 'false');
      }

    }, (err) => {

    });
  }

}
