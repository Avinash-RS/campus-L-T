import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';

@Component({
  selector: 'app-hr-sub-employment',
  templateUrl: './hr-sub-employment.component.html',
  styleUrls: ['./hr-sub-employment.component.scss']
})
export class HrSubEmploymentComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  nameOfAssessment: any;
  candidateId: any;
  certificateArr: any;
  candidateName: any;
  uid:any;

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
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.SUB_EMPLOYMENT
      },
      // {
      //   icon: '002-cv.svg',
      //   name: 'Interview panel',
      //   router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL
      // },
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

  profileView() {
    const data = {
      candidateId: this.uid ? this.uid : '',
      candidateName: this.candidateName ? this.candidateName : '',
    };
    this.openDialog1(CommonKycProfileViewComponent, data);
  }

  viewCerificates(path) {
    // const excel = element && element.download ? element.download : '';
    window.open(path, '_blank');
  }


  next() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL);
  }


  reSubmit(details, docType) {

    const data = {
      reSubmit: 'documents'
    };
    this.openDialog(ShortlistBoxComponent, data, details['id'], docType);
  }

  apiResubmit(reason, dId, docType) {
    const apiData = {
      types: docType,
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
  openDialog(component, data, dId, docType) {
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
        this.apiResubmit(result, dId, docType);
      }
    });
  }

    // Open dailog
  openDialog1(component, data) {
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
      }
    });
  }


}
