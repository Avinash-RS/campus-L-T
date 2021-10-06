import { Component, OnInit, OnDestroy } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-hr-evaluation-main-screen',
  templateUrl: './hr-evaluation-main-screen.component.html',
  styleUrls: ['./hr-evaluation-main-screen.component.scss']
})
export class HrEvaluationMainScreenComponent implements OnInit, OnDestroy {

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

  refreshSubscription: Subscription;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    if (this.appConfig.getLocalData('tabIndex')) {
      this.TabIndex = Number(this.appConfig.getLocalData('tabIndex'));
    }
    this.editRouteParamGetter();
  }

ngOnInit() {
  this.refreshOndriveChangeRXJS();
}

refreshOndriveChangeRXJS() {
  this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
  .pipe(
  finalize(()=> {
    }))
    .subscribe((data: any)=> {
    if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_PANEL_EVALUATION)) {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.ASSIGNED_DETAILS);
    }
  });
}

  ngOnDestroy() {
    this.appConfig.clearLocalDataOne('tabIndex');
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
  }
  tabChanged(e) {
    this.TabIndex = e.index;
    this.appConfig.setLocalData('tabIndex', this.TabIndex);
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
