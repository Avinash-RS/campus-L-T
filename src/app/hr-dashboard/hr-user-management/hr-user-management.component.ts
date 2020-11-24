import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-hr-user-management',
  templateUrl: './hr-user-management.component.html',
  styleUrls: ['./hr-user-management.component.scss']
})
export class HrUserManagementComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '002-cv.svg',
        name: 'Candidate details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS
      },
      {
        icon: '002-group-1.svg',
        name: 'Panel details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST
      },
      {
        icon: '001-group.svg',
        name: 'Add User',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_USER_MANAGEMENT_ADD_USERS
      },
      {
        icon: '002-group-1.svg',
        name: 'Interview panel upload',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.USER_MANAGEMENT_INTERVIEW_PANEL_UPLOADS
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
