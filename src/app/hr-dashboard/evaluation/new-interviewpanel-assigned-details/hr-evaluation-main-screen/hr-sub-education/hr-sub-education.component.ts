import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-hr-sub-education',
  templateUrl: './hr-sub-education.component.html',
  styleUrls: ['./hr-sub-education.component.scss']
})
export class HrSubEducationComponent implements OnInit, OnDestroy {

  queryParams: any;
  getAllReportsData: any;
  driveName: any;
  getCandidateAssessmentsAPISubscription: Subscription;
  assessmentMarks: any;
  assessmentMarksArray: any;
  emailId: any;

  constructor(
    public appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
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
      this.getCandidateAssessments(params['shortlist_name'], params['uid']);
      this.emailId = params['email'] ? params['email'] : ''
    });
  }

  eTest() {
    let details = {
      type: 'campus',
      email: this.emailId ? this.emailId : null,
      //assessmentId: null
    };
    let unified_encrypt_key = CONSTANT.SECRET_KEY.UNIFIED_REPORT;
    var emailEncrypt = this.apiService.encryptForUnifiedReports(JSON.stringify(details.email), unified_encrypt_key);
    var encryptDetail = this.apiService.encryptForUnifiedReports(JSON.stringify(details), unified_encrypt_key);
    let redirectionLink = environment.UNIFIEDREPORTS+"auth/reports/viewreport/"+  encodeURIComponent(emailEncrypt) + "?details="+ encodeURIComponent(encryptDetail);
    window.open(redirectionLink, 'redirection');
  }

  getCandidateAssessments(shortlist_name, uid) {
    const req = {
      "shortlist_name": shortlist_name,
      "user_id": uid
    };
    this.getCandidateAssessmentsAPISubscription = this.adminService.getCandidateAssessmentResults(req).subscribe((res: any)=> {
    this.assessmentMarksArray = res && res.assessment_marks ? res.assessment_marks : null;
    this.assessmentMarks = res ? res : null;
    }, (err)=> {

    });
  }

  ngOnDestroy() {
    this.getCandidateAssessmentsAPISubscription ? this.getCandidateAssessmentsAPISubscription.unsubscribe() : '';
  }

}
