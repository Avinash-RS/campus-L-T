import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-miscellaneous-master',
  templateUrl: './miscellaneous-master.component.html',
  styleUrls: ['./miscellaneous-master.component.scss']
})
export class MiscellaneousMasterComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  role = this.appConfig.getLocalData('roles');

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    let subWrapperMenus = [
      {
        icon: '002-group-1.svg',
        name: 'Colleges',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_MISCELLANEOUS_COLLEGES
      },
      {
        icon: '001-group.svg',
        name: 'Name Change',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_MISCELLANEOUS_CANDIDATE_NAME_CHANGE
      },
    ];

    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
