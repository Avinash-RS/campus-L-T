import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-tpo-user-management',
  templateUrl: './tpo-user-management.component.html',
  styleUrls: ['./tpo-user-management.component.scss']
})
export class TpoUserManagementComponent implements OnInit, AfterViewInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '002-group-1.svg',
        name: 'User Details',
        router: CONSTANT.ENDPOINTS.TPO_DASHBOARD.USER_MANAGEMENT_USERS_LIST
      },
      {
        icon: '001-group.svg',
        name: 'Bulk Uploads',
        router: CONSTANT.ENDPOINTS.TPO_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
 }

}
