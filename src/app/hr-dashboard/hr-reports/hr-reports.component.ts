import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-hr-reports',
  templateUrl: './hr-reports.component.html',
  styleUrls: ['./hr-reports.component.scss']
})
export class HrReportsComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '',
        name: 'All Reports',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.REPORTS_LIST
      },
      {
        icon: '',
        name: '1st Level Shortlist',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRST_LEVEL_REPORTS_LIST
      },
      {
        icon: '',
        name: 'Candidate Bulk Upload Reports',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.BULK_CANDIDATE_UPLOAD_REPORTS_LIST
      },
      {
        icon: '',
        name: 'Interview panel Bulk Upload Reports',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.BULK_INV_UPLOAD_REPORTS_LIST
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }



}
