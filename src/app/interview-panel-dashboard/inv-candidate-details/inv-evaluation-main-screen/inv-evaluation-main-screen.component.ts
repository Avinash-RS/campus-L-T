import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inv-evaluation-main-screen',
  templateUrl: './inv-evaluation-main-screen.component.html',
  styleUrls: ['./inv-evaluation-main-screen.component.scss']
})
export class InvEvaluationMainScreenComponent implements OnInit, OnDestroy {

  appConstant = CONSTANT.ENDPOINTS;
  nameOfAssessment: any;
  assessmentName: any;
  candidateId: any;
  candidateName: any;
  candidateStatus: any;
  tagName: any;
  uid: any;
  email: any;
  form: any;
  queryParams: any;
  TabIndex = 0;
  passT0TabProfile: any;
  passT0TabVideoInterview: any;
  passT0Tabevaluate: any;
  passT0TabVideoScheduling: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    if (this.appConfig.getLocalData('tabIndex')) {
      this.TabIndex = Number(this.appConfig.getLocalData('tabIndex'));
    }
    this.editRouteParamGetter();
  }

  ngOnInit() {
    if (this.TabIndex == 0) {
      this.passT0TabProfile = Math.random();
    }
    if (this.TabIndex == 2) {
      this.passT0TabVideoScheduling = Math.random();
    }
    if (this.TabIndex == 3) {
      this.passT0TabVideoInterview = Math.random();
    }
    if (this.TabIndex == 4) {
      this.passT0Tabevaluate = Math.random();
    }
  }

  ngOnDestroy() {
    this.appConfig.clearLocalDataOne('tabIndex');
    this.appConfig.clearLocalDataOne('Proctor_token');
  }
  tabChanged(e) {
    this.TabIndex = e.index;
    this.appConfig.setLocalData('tabIndex', this.TabIndex);
    if (this.TabIndex == 0) {
      this.passT0TabProfile = Math.random();
    }
    if (this.TabIndex == 2) {
      this.passT0TabVideoScheduling = Math.random();
    }
    if (this.TabIndex == 3) {
      this.passT0TabVideoInterview = Math.random();
    }
    if (this.TabIndex == 4) {
      this.passT0Tabevaluate = Math.random();
    }
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParams = {
        data: params['data'],
        id: params['id'],
        name: params['name'] ? params['name'] : '',
        status: params['status'],
        tag: params['tag'],
        uid: params['uid'],
        email: params['email'],
        form: params['form'],
        shortlist_name: params['shortlist_name']
      };
      this.nameOfAssessment = params['data'];
      this.candidateId = params['id'];
      this.candidateName = params['name'];
      this.candidateStatus = params['status'];
      this.tagName = params['tag'];
      this.uid = params['uid'];
      this.email = params['email'];
      this.form = params['form'];
    });
  }


}
