import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inv-unifiedreports',
  templateUrl: './inv-unifiedreports.component.html',
  styleUrls: ['./inv-unifiedreports.component.scss']
})
export class InvUnifiedreportsComponent implements OnInit {

  isLocal = environment.local;
  queryParams: any;
  getAllReportsData: any;
  driveName: any;
  constructor(
    public appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
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
     if (this.appConfig.isWebrtc()) {
        this.getReports(params['email']);
      }
    });
  }

  getReports(data) {
    const apiData = {
      email: this.isLocal ? 'sr-venkadesh@lntecc.com' : data
      // email: data
    };
    this.adminService.getReportsDataAPI(apiData).subscribe((response: any)=> {

      if (response && response.success) {
        if (response.data[0] && response.data[0].firstname) {
          this.getAllReportsData = response.data && response.data[0] ? response.data[0] : null;
        } else {
          this.getAllReportsData = null;
        }
      } else {
        this.appConfig.warning('No Reports Available');
        this.getAllReportsData = null;
      }
    });
  }

  getSelectedDriveName(e) {
    if (this.getAllReportsData) {
      this.getAllReportsData.selectedDriveName = e;
      this.driveName = e;
    }
  }
  next() {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.JOIN_INTERVIEW, this.queryParams);
  }

}
