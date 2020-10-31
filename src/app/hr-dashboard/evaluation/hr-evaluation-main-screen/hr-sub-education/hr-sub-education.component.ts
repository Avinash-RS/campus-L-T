import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hr-sub-education',
  templateUrl: './hr-sub-education.component.html',
  styleUrls: ['./hr-sub-education.component.scss']
})
export class HrSubEducationComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  nameOfAssessment: any;
  candidateId: any;
  certificateArr: any;
  other;
  uid:any;
  BASE_URL = environment.API_BASE_URL;

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
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.SUB_EDUCATION
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

  viewCerificates(id) {
    // const excel = element && element.download ? element.download : '';
    let path = this.BASE_URL +`/profile/get_certificate_name_test?certificate_id=${id}`
    window.open(path, '_blank');
  }


  next() {
    const name = this.appConfig.getLocalData('cname') ? this.appConfig.getLocalData('cname') : '';
    const status = this.appConfig.getLocalData('cstatus') ? this.appConfig.getLocalData('cstatus') : '';
    const tag = this.appConfig.getLocalData('ctag') ? this.appConfig.getLocalData('ctag') : '';
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SUB_EMPLOYMENT, { data: this.nameOfAssessment, id: this.candidateId, name, status, tag, uid: this.uid });
  }


  reSubmit(details, docTypes) {

    const data = {
      reSubmit: 'documents'
    };
    this.openDialog(ShortlistBoxComponent, data, details['id'], docTypes);
  }

  apiResubmit(reason, dId, docTypes) {
    const apiData = {
      types: docTypes,
      id: dId,
      current_user_id: this.uid,
      comments: reason['comments'],
      hr_id: this.appConfig.getLocalData('userId')
    };
    this.adminService.reSubmitRequest(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.appConfig.success('Document Resubmit request has been done', '');
      this.editRouteParamGetter();
    }, (err) => {

    });
  }

  // Open dailog
  openDialog(component, data, dId, docTypes) {
    let dialogDetails: any;

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiResubmit(result, dId, docTypes);
      }
    });
  }

}
