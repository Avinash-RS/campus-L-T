import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

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
      console.log(params['data']);
      this.nameOfAssessment = params['data'];
      this.candidateId = params['id'];
      this.userlist(params['id']);
    });
  }

  userlist(cid) {
    const apiData = {
      id: cid
    };
    this.adminService.getCertificates(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      console.log('certificates', data);
      this.certificateArr = data && data[0] && data[0].length > 0 ? data[0][0] : [];
      console.log('certificatesArr', this.certificateArr);

    }, (err) => {

    });
  }

  viewCerificates(path) {
    // const excel = element && element.download ? element.download : '';
    window.open(path, '_blank');
  }


  next() {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SUB_EMPLOYMENT, { data: this.nameOfAssessment, id: this.candidateId });
  }


  reSubmit(details) {
    const data = {
      reSubmit: 'documents'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  apiResubmit(reason) {

  }

  // Open dailog
  openDialog(component, data) {
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
        this.apiResubmit(result);
      }
    });
  }

}
