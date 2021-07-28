import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inv-sub-education',
  templateUrl: './inv-sub-education.component.html',
  styleUrls: ['./inv-sub-education.component.scss']
})
export class InvSubEducationComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  nameOfAssessment: any;
  candidateId: any;
  certificateArr: any;
  uid:any;
  queryParams: { data: any; id: any; name: any; status: any; tag: any; uid: any; email: any; form: any; };

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
    this.editRouteParamGetter();
  }

  ngOnInit() {
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
        form: params['form']
      };
      this.nameOfAssessment = params['data'];
      this.candidateId = params['id'];
      this.uid = params['uid'];
      this.userlist(params['uid']);
    });
  }

  userlist(cid) {
    const apiData = {
      id: cid
    };
    this.adminService.getCertificates(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.certificateArr = data && data[0] && data[0].length > 0 ? data[0][0] : [];

    }, (err) => {

    });
  }

  viewCerificates(path) {
    // const excel = element && element.download ? element.download : '';
    window.open(path, '_blank');
  }


  next() {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.UNIFIEDREPORTS, this.queryParams);
  }

}
