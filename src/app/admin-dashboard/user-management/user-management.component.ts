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
        name: 'User Details',
        router: CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST
      },
      {
        icon: '001-group.svg',
        name: 'Bulk Uploads',
        router: CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
