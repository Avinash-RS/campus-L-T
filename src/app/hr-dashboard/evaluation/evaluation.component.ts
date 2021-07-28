import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  appConstant = CONSTANT.ENDPOINTS;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      // {
      //   icon: '002-cv.svg',
      //   name: 'Candidate details',
      //   router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS
      // },
      // {
      //   icon: '002-cv.svg',
      //   name: 'Interview panel',
      //   router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL
      // },
      {
        icon: '002-cv.svg',
        name: 'Panel Assignment',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT
      },
      {
        icon: '002-cv.svg',
        name: 'Assigned Details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED
      },
      {
        icon: '002-group-1.svg',
        name: 'Bulk Assign',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_RESULTS_UPLOAD
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
