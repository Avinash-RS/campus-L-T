import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-assess-evaluation-screen',
  templateUrl: './video-assess-evaluation-screen.component.html',
  styleUrls: ['./video-assess-evaluation-screen.component.scss']
})
export class VideoAssessEvaluationScreenComponent implements OnInit, OnDestroy {

  refreshSubscription: Subscription;
  videoScheduleDetailsSubscription: Subscription;
  videoAssessmentDetails: any;
  videoAssessment: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.videoScheduleDetailsSubscription ? this.videoScheduleDetailsSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
        if (data.includes(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_EVALUATION_DETAILS)) {
        if (this.appConfig.getSelectedDrivePermissions() && this.appConfig.getSelectedDrivePermissions().video_assessment) {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_ASSIGNED_DETAILS);
        } else {
          this.appConfig.routeNavigation('/');
        }
      }
    });
  }

  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['shortlist_name'] && params['candidate_user_id'] && params['schedule_id']) {
        this.getScheduleDetailsPHP(params);
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_ASSIGNED_DETAILS);
      }
    });
  }

  getScheduleDetailsPHP(apiDatas) {
    const apiData = {
      shortlist_name: apiDatas.shortlist_name, candidate_user_id: Number(apiDatas.candidate_user_id), schedule_id: apiDatas.schedule_id, is_va_evaluation: 1
   }
   this.videoScheduleDetailsSubscription = this.adminService.videoAssessmentEvaluationDetails(apiData).subscribe(
      (datas: any) => {
        this.videoAssessmentDetails = datas ? datas : null;
        let data = this.videoAssessmentDetails;
        this.videoAssessment = {
          schedule_id: data && data.schedule_id ? data.schedule_id : '',
          scheduled_status: 1,
          room_id: data && data.room_id ? data.room_id : '',
          test_status: /* data && data.va_test_status ?*/ this.videoAssessTestStatus(data),
          remarks: data && data.remarks ? data.remarks : '',
          evaluation_status: /*data && data.evaluation_status ?*/ this.videoAssessEvaluationStatus(data),
          scheduled_by: data && data.scheduled_by ? data.scheduled_by : '',
          evaluated_by: data && data.evaluated_by ? data.evaluated_by : '',
          submitted_by: data && data.shortlisted_by ? data.shortlisted_by : '',
          start_datetime: data && data.start_datetime ? data.start_datetime : '',
          end_datetime: data && data.end_datetime ? data.end_datetime : '',
          uid: data && data.candidate_user_id ? data.candidate_user_id : '',
          candidate_id: data && data.candidate_id ? data.candidate_id : '',
          candidate_name: data && data.candidate_name ? data.candidate_name : '',
          shortlist_name: data && data.shortlist_name ? data.shortlist_name : '',
          showSubmitButton: data && data.shortlist_status == 1 ? false : true,
          profile_image_url: data && data.profile_image_url ? data.profile_image_url : 'assets/images/img_avatar2.jpg',
          redirectedFrom: 'evaluator',
          showTopBar: true,
          assigned_by: data && data.assigned_by ? data.assigned_by : ''
      };
       },
      (err) => {}
    );
  }

  videoAssessEvaluationStatus(data: any) {
    if (data && data.schedule_id) {
      if (data && data.va_test_status && data.va_test_status == 'Time Expired') {
        return 'Time Expired';
      }
       return (data && data.evaluation_status && data.evaluation_status == 'selected') ? 'Selected' : (data && data.evaluation_status && data.evaluation_status == 'rejected') ? 'Rejected' : data.evaluation_status ? data.evaluation_status : 'Yet to Evaluate';
    } else {
      return 'Not Scheduled';
    }
  }

  videoAssessTestStatus(data: any) {
    if (data && data.schedule_id) {
      if (data && data.va_test_status && data.va_test_status == 'YetToStart') {
        return 'Yet to Start';
      }
      if (data && data.va_test_status && data.va_test_status == 'InProgress') {
        return 'In Progress';
      }
      if (data && data.va_test_status && data.va_test_status) {
        return data.va_test_status;
      } else {
        return 'Not Scheduled';
      }
    } else {
      return 'Not Scheduled';
    }
  }
}
