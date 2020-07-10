import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-tpo-user-management',
  templateUrl: './tpo-user-management.component.html',
  styleUrls: ['./tpo-user-management.component.scss']
})
export class TpoUserManagementComponent implements OnInit {

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
        router: CONSTANT.ENDPOINTS.TPO_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS
      },
      // {
      //   icon: '002-cv.svg',
      //   name: 'Candidate details',
      //   router: CONSTANT.ENDPOINTS.HR_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST
      // },
      // {
      //   icon: '001-approved.svg',
      //   name: 'Upload candidate details',
      //   router: CONSTANT.ENDPOINTS.HR_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD
      // }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
