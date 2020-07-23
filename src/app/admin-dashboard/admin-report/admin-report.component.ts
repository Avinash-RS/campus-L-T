import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss']
})
export class AdminReportComponent implements OnInit {

  constructor(private appConfig: AppConfigService,
    private sharedService: SharedServiceService) { 
      // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      // {
      //   icon: '002-group-1.svg',
      //   name: 'Users',
      //   router: CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.ADMIN_REPORTS_LIST
      // }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    }

  ngOnInit() {
  }

}
