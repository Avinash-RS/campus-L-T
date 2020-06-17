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

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '',
        name: 'Candidate Upload',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
