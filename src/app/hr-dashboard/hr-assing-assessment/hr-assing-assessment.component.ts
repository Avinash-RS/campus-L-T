import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-hr-assing-assessment',
  templateUrl: './hr-assing-assessment.component.html',
  styleUrls: ['./hr-assing-assessment.component.scss']
})
export class HrAssingAssessmentComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor(private appConfig: AppConfigService,
    private sharedService: SharedServiceService) {

      // Sub-Navigation menus. This will be retrieved in Admin master component
      const subWrapperMenus = [
        {
          icon: '002-files-and-folders.svg',
          name: 'Scheduling-assessment',
          router: CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_SCHEDULING_ASSESSMENT
        }
      ];
      this.sharedService.subMenuSubject.next(subWrapperMenus);
    }

  ngOnInit() {
  }

}
