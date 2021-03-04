import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-businesspanel-route',
  templateUrl: './businesspanel-route.component.html',
  styleUrls: ['./businesspanel-route.component.scss']
})
export class BusinesspanelRouteComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  role = this.appConfig.getLocalData('roles');

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '',
        name: 'Selected Candidates Upload/Assign',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.OfferedCandidatesLIST
      },
      {
        icon: '',
        name: 'Business Users List/Add',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.IC_ADDorLIST
      },
      // {
      //   icon: '002-group-1.svg',
      //   name: 'Bulk assign',
      //   router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_RESULTS_UPLOAD
      // }
    ];
    if (this.role == 'ic') {
      subWrapperMenus.shift();
    }
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
