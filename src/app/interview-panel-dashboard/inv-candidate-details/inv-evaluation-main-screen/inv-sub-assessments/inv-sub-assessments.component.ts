import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';

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

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute
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
      this.videoAssessment = params['videoSchedule'] ? JSON.parse(params['videoSchedule']) : '';
      this.uid = params['uid'];
      this.shortlist_name = params['shortlist_name'];
      this.VideoAssessShow = params['videoAssessSubmitted'] && params['videoAssessSubmitted'] == '1' ? false : true;
      // if ((this.videoAssessment && this.videoAssessment.scheduled_status)) {
      // this.getScheduleDetails(this.videoAssessment && this.videoAssessment.schedule_id ? this.videoAssessment.schedule_id : '');
      // this.getProctorToken();
      // }
    });
  }

  ngOnDestroy() {
    this.activatedRouteSubscription ? this.activatedRouteSubscription.unsubscribe() : '';
  }
}

