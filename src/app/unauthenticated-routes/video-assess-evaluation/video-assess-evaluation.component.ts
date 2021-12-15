import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-assess-evaluation',
  templateUrl: './video-assess-evaluation.component.html',
  styleUrls: ['./video-assess-evaluation.component.scss']
})
export class VideoAssessEvaluationComponent implements OnInit, OnDestroy {

  paramaterData: any;
  activatedRouteSubscription: Subscription;
  videoAssessment: any;
  constructor(
    private appConfig: AppConfigService,
    private globalValidators: GlobalValidatorService,
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

  ngOnDestroy() {

  }

  editRouteParamGetter() {
    // Get url Param to view Edit user page
   this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['payload']) {
        this.paramaterData = this.apiService.base64Decryption(params['payload']);
        if (this.paramaterData && this.paramaterData.candidate_user_id) {
          let data = this.paramaterData;
          this.videoAssessment = {
            schedule_id: data && data.schedule_id ? data.schedule_id : '',
            scheduled_status: 1,
            room_id: data && data.va_room_id ? data.va_room_id : '',
            test_status: data && data.va_test_status ? data.va_test_status : '',
            remarks: data && data.va_remarks ? data.va_remarks : '',
            evaluation_status: data && data.va_evaluation_status ? data.va_evaluation_status : '',
            scheduled_by: data && data.scheduled_by ? data.scheduled_by : '',
            evaluated_by: data && data.evaluated_by ? data.evaluated_by : '',
            submitted_by: data && data.shortlisted_by ? data.shortlisted_by : '',
            start_datetime: data && data.start_datetime ? data.start_datetime : '',
            end_datetime: data && data.end_datetime ? data.end_datetime : '',
            uid: data && data.candidate_user_id ? data.candidate_user_id : '',
            shortlist_name: data && data.shortlist_name ? data.shortlist_name : '',
            showSubmitButton: data && data.shortlist_status == '1' ? false : true,
            redirectedFrom: 'external evaluator',
            candidate_name: data && data.candidate_name ? data.candidate_name : '',
            interviewer_name: data && data.interviewer_name ? data.interviewer_name : '',
            interviewer_uid: data && data.interviewer_id ? data.interviewer_id : '',
            profile_image_url: data && data.profile_image_url ? data.profile_image_url: '',
            drive_id: data && data.drive_id ? data.drive_id: ''
          };
          this.appConfig.setLocalData('driveId', data && data.drive_id ? data.drive_id : null);
          this.appConfig.setLocalData('username', data && data.interviewer_name ? data.interviewer_name : 'Guest');
          this.appConfig.setLocalData('userId', data && data.interviewer_uid ? data.interviewer_uid : '');
        } else {
          this.appConfig.routeNavigation('error');
        }
      } else {
        this.appConfig.routeNavigation('error');
      }
    });
  }

}
