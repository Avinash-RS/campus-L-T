import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '002-group-1.svg',
        name: 'Users',
        router: CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST
      },
      {
        icon: '001-group.svg',
        name: 'Add User',
        router: CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_ADD_USER
      },
      {
        icon: 'hr.svg',
        name: 'Candidates',
        router: CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS
      },
      {
        icon: 'education.svg',
        name: 'Institutes',
        router: CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_INSTITUTE_UPLOADS
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
