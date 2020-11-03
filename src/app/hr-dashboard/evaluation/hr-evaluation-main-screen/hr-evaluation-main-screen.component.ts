import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hr-evaluation-main-screen',
  templateUrl: './hr-evaluation-main-screen.component.html',
  styleUrls: ['./hr-evaluation-main-screen.component.scss']
})
export class HrEvaluationMainScreenComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  nameOfAssessment: any;
  assessmentName: any;
  candidateId: any;
  candidateName: any;
  candidateStatus: any;
  tagName: any;
  uid: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Candidate details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_PANEL_EVALUATION
      },
      {
        icon: '002-cv.svg',
        name: 'Interview panel',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.candidateId = params['id'];
      this.candidateName = params['name'];
      this.candidateStatus = params['status'];
      this.tagName = params['tag'];
      this.uid = params['uid'];
      this.appConfig.setLocalData('cname', this.candidateName);
      this.appConfig.setLocalData('cid', this.candidateId);
      this.appConfig.setLocalData('cstatus', this.candidateStatus);
      this.appConfig.setLocalData('ctag', this.tagName);
      this.assessmentDetails(params['data']);
    });
  }

  assessmentDetails(name) {
    const apidata = {
      shortlist_name: name
    };
    this.adminService.hrEvaluationParticularAssessmentDetailsHeader(apidata).subscribe((data: any) => {
      // this.appConfig.hideLoader();
      this.assessmentName = data;

    }, (err) => {

    });
  }


}
