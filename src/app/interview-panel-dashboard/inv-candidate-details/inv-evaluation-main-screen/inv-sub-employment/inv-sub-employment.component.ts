import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inv-sub-employment',
  templateUrl: './inv-sub-employment.component.html',
  styleUrls: ['./inv-sub-employment.component.scss']
})
export class InvSubEmploymentComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  nameOfAssessment: any;
  candidateId: any;
  certificateArr: any;
  candidateName: any;
  uid:any;
  queryParams: any;
  profileViewData: any;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
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
      this.queryParams = {
        data: params['data'],
        id: params['id'],
        name: params['name'] ? params['name'] : '',
        status: params['status'],
        tag: params['tag'],
        uid: params['uid'],
        email: params['email'],
        form: params['form']
      };
      this.profileViewData = {
        candidateId: params['uid'],
        candidateName: params['name'],
        isSelected: false,
        documents: true
      }
      this.candidateId = params['id'];
      this.candidateName = params['name'];
      this.uid = params['uid']
    });
  }


  next() {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.SUB_EDUCATION, this.queryParams);
  }

}
