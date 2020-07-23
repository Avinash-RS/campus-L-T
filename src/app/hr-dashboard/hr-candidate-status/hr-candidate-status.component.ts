import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-hr-candidate-status',
  templateUrl: './hr-candidate-status.component.html',
  styleUrls: ['./hr-candidate-status.component.scss']
})
export class HrCandidateStatusComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService) { 
    
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '002-files-and-folders.svg',
        name: 'Pre-assessment',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_STATUS_PREASSESSMENT
      },
      {
        icon: 'recruitment.svg',
        name: 'Recruitment',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_STATUS_RECRUITMENT
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
