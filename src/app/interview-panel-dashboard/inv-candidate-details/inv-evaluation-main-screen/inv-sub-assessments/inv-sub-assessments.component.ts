import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-inv-sub-assessments',
  templateUrl: './inv-sub-assessments.component.html',
  styleUrls: ['./inv-sub-assessments.component.scss']
})
export class InvSubAssessmentsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() passT0TabVideoScheduling;
  candidateId: any;
  nameOfAssessment: any;
  uid: any;
  status: any;
  shortlist_name: any;
  formDetails: any;
  formId: any;
  videoAssessment: any;
  activatedRouteSubscription: Subscription;
  queryParams: any;
  VideoAssessShow: boolean;
  showSubmitButton = false;
  videoScheduleDetailsSubscription: any;
  queryParamsData: any;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminServiceService,
  ) {
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.appConfig.clearLocalDataOne('Proctor_token');
  }

  ngOnChanges() {
    if (this.passT0TabVideoScheduling) {
      this.editRouteParamGetter();
      }
  }


  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
   this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.queryParamsData = params['videoSchedule'] ? JSON.parse(params['videoSchedule']) : '';
      if (this.queryParamsData) {
        this.queryParamsData.uid = params['uid'];
        this.queryParamsData.shortlist_name = params['shortlist_name'];
        this.queryParamsData.showSubmitButton = this.showSubmitButton;
        if (this.queryParams && this.queryParamsData.uid, this.queryParamsData.shortlist_name, this.queryParamsData.schedule_id && this.passT0TabVideoScheduling) {
          let data = {
            shortlist_name: this.queryParamsData.shortlist_name,
            candidate_user_id: this.queryParamsData.uid,
            schedule_id: this.queryParamsData.schedule_id
          }
          this.getScheduleDetailsPHP(data);
        } else {
          this.videoAssessment = {};
        }
      }
      this.uid = params['uid'];
      this.shortlist_name = params['shortlist_name'];
      this.VideoAssessShow = params['videoAssessSubmitted'] && params['videoAssessSubmitted'] == '1' ? false : true;
      // if ((this.videoAssessment && this.videoAssessment.scheduled_status)) {
      // this.getScheduleDetails(this.videoAssessment && this.videoAssessment.schedule_id ? this.videoAssessment.schedule_id : '');
      // this.getProctorToken();
      // }
    });
  }

  getScheduleDetailsPHP(apiDatas) {
    const apiData = {
      shortlist_name: apiDatas.shortlist_name, candidate_user_id: Number(apiDatas.candidate_user_id), schedule_id: apiDatas.schedule_id, is_va_evaluation: 0
    }
   this.videoScheduleDetailsSubscription = this.adminService.videoAssessmentEvaluationDetails(apiData).subscribe(
      (datas: any) => {
        let data = datas ? datas : null;
        this.videoAssessment = {
          schedule_id: data && data.schedule_id ? data.schedule_id : '',
          scheduled_status: data && data.schedule_id ? 1 : 0,
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
          showSubmitButton: false,
          profile_image_url: data && data.profile_image_url ? '' : 'assets/images/img_avatar2.jpg',
          redirectedFrom: 'inv-first-tab',
          showTopBar: false,
      };
       },
      (err) => {
        let data = null;
        this.videoAssessment = {
          schedule_id: data && data.schedule_id ? data.schedule_id : '',
          scheduled_status: data && data.schedule_id ? 1 : 0,
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
          showSubmitButton: false,
          profile_image_url: data && data.profile_image_url ? '' : 'assets/images/img_avatar2.jpg',
          redirectedFrom: 'inv-first-tab',
          showTopBar: false,
      }
     }
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
  ngOnDestroy() {
    this.activatedRouteSubscription ? this.activatedRouteSubscription.unsubscribe() : '';
    this.videoScheduleDetailsSubscription ? this.videoScheduleDetailsSubscription.unsubscribe() : '';
  }
}

