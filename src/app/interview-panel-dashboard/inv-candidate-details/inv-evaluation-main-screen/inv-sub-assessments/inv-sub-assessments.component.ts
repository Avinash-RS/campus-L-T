import { Component, OnInit, Input, OnChanges, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { environment } from 'src/environments/environment';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inv-sub-assessments',
  templateUrl: './inv-sub-assessments.component.html',
  styleUrls: ['./inv-sub-assessments.component.scss']
})
export class InvSubAssessmentsComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('sourceVideo',{static: false}) video: TemplateRef<any>;
  @Input() passT0TabVideoScheduling;
  candidateId: any;
  nameOfAssessment: any;
  uid: any;
  status: any;
  shortlist_name: any;
  formDetails: any;
  formId: any;
  showFeedback: boolean;
  playVideoList = [];
  proctor_url = environment.PROCTOR_VIDEO_URL;
  currentIndex = 0;
  currentItem:any = [];
  playlist:any = [];
  inboundClick = false;
  showErrormsg = false;
  videoEndedFalse = true;
  questionDetailsArray: any = [];
  testDetailsArray: any;
  active: any = 0;
  videoAssessment: any;
  selectedStatus = '';
  feedbackformControl = new FormControl(null, [Validators.required, this.globalValidators.address255()])
  feedbackApiLoading: boolean;
  ViewSchedulingDetailsSubscription: Subscription;
  getproctorTokenSubscription: Subscription;
  getProctorVideoSubscription: Subscription;
  saveVideoSchedulingFeedBackSubscription: Subscription;
  activatedRouteSubscription: Subscription;
  queryParams: any;
  VideoAssessShow: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private appConfig: AppConfigService,
    private globalValidators: GlobalValidatorService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
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

  getScheduleDetails(data) {
    let apiData = {
      "scheduleId": data ? data.toString() : ''
      }
      if (!this.testDetailsArray && this.passT0TabVideoScheduling) {
   this.ViewSchedulingDetailsSubscription = this.adminService.ViewSchedulingDetails(apiData).subscribe((response: any)=> {
      if (response && response.success) {
      this.questionDetailsArray = response && response.data && response.data[0] && response.data[0].questionDetailsArray ? response.data[0].questionDetailsArray : [];
      this.testDetailsArray = response && response.data && response.data[0] && response.data[0].testDetailsArray && response.data[0].testDetailsArray[0] ? response.data[0].testDetailsArray[0] : null;
      } else {
      this.questionDetailsArray = [];
      this.testDetailsArray = null;
      }
    }, (err)=> {

    });
  }
}

  getProctorToken(){
      if ((!this.testDetailsArray || this.playVideoList.length < 1) && this.passT0TabVideoScheduling) {
        let data = {
        password: "aep7feuY",
        provider: "login",
        username: "admin",
      }
     this.getproctorTokenSubscription = this.adminService.getproctorToken(data).subscribe((response: any)=> {
          if(response.token){
            this.appConfig.setLocalData('Proctor_token',response.token);
            this.getVideoFiles();
          } else {
            this.appConfig.warning('Please try again later..')
          }
      })
    }
  }
  // Long Video - a194c315-0988-4a60-93de-949bee002897
  // No video - cc5f9508-e6e2-4357-aec9-1a3155d2e2f4
  // One video - 1662d5ec-ed7a-4f3e-91c9-cb66361f05e2
  getVideoFiles(){
    let data = {
      limit: 20,
      count: 1,
      filterType:"event",
      roomId: this.videoAssessment && this.videoAssessment.room_id ? this.videoAssessment.room_id : '',
  //     roomId: '1662d5ec-ed7a-4f3e-91c9-cb66361f05e2'
      };
      let filter = [];
     this.getProctorVideoSubscription = this.adminService.getProctorVideo(data.roomId, data.filterType).subscribe((response: any)=> {
        if(response.data){
          this.showErrormsg = false;
          response.data.forEach((data) => {
            var i = 0
            filter = [];
            data.attach.forEach((iterator, loopIndex) => {
              if(iterator.filename.includes('webcam.webm')){
                this.playVideoList.push({
                  id:iterator.id,
                  filename:iterator.filename,
                  poster:iterator.id,
                  src: this.proctor_url+iterator.id+'?token='+this.appConfig.getLocalData('Proctor_token'),
                });
              i++;
            }
          });
        });
       this.currentItem =  this.playVideoList[this.currentIndex];
        }else {
          this.showErrormsg = true;
        }

      })
  }

  nextVideo() {
    this.currentIndex++;
    if (this.currentIndex === this.playVideoList.length) {
      this.currentIndex = 0;
      this.currentItem = this.playVideoList[this.currentIndex];
      this.videoEndedFalse = false;
      return this.playEnd();
    }
    this.playVideo();
  }

  playVideo() {
    this.videoEndedFalse = true;
    var vid = <HTMLVideoElement> document.getElementById("myVideo");
    var playPromise = vid.play();
  if (playPromise !== undefined) {
      playPromise.then(_ => {
      vid.load();
      vid.play();
    })
    .catch(error => {
    });
  }
}

playEnd() {
  var vid = <HTMLVideoElement> document.getElementById("myVideo");
  vid.pause();
}

sendFeedback() {
  if (this.feedbackformControl.valid) {
    const apiData = {
      shortlist_name: this.shortlist_name,
      evaluation_status: this.selectedStatus,
      remarks: this.feedbackformControl.value,
      candidate_user_id: this.uid
  }
  this.feedbackApiLoading = true;
 this.saveVideoSchedulingFeedBackSubscription = this.adminService.saveVideoSchedulingFeedBack(apiData).subscribe((response: any)=> {
    this.feedbackApiLoading = false;
    this.showFeedback = false;
    this.appConfig.success('Feedback has been updated successfully...');
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST);
  }, (err)=> {
    this.feedbackApiLoading = false;
  });
  } else {
    this.feedbackformControl.markAsTouched();
  }
}

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
   this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.videoAssessment = params['videoSchedule'] ? JSON.parse(params['videoSchedule']) : '';
      this.nameOfAssessment = params['data'];
      this.candidateId = params['uid'];
      this.uid = params['uid'];
      this.status = params['status'];
      this.shortlist_name = params['shortlist_name'];
      this.formDetails = this.appConfig.getSelectedDriveFormDetails();
      this.formId = this.formDetails.id ? this.formDetails.id : '',
      this.queryParams = params;
      this.VideoAssessShow = params['videoAssessSubmitted'] && params['videoAssessSubmitted'] == '1' ? false : true;
      if ((this.queryParams && this.queryParams.videoShow && this.queryParams.videoShow == 'true') && (this.videoAssessment && this.videoAssessment.scheduled_status && this.videoAssessment.scheduled_status == 1)) {
      this.getScheduleDetails(this.videoAssessment && this.videoAssessment.schedule_id ? this.videoAssessment.schedule_id : '');
      this.getProctorToken();
      }
    });
  }

  isAccessGranted() {
    if(this.queryParams && this.queryParams.videoShow && this.queryParams.videoShow == 'true' && this.appConfig.getSelectedDrivePermissions().video_assessment) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.ViewSchedulingDetailsSubscription ? this.ViewSchedulingDetailsSubscription.unsubscribe() : '';
    this.getproctorTokenSubscription ? this.getproctorTokenSubscription.unsubscribe() : '';
    this.getProctorVideoSubscription ? this.getProctorVideoSubscription.unsubscribe() : '';
    this.saveVideoSchedulingFeedBackSubscription ? this.saveVideoSchedulingFeedBackSubscription.unsubscribe() : '';
    this.activatedRouteSubscription ? this.activatedRouteSubscription.unsubscribe() : '';
  }
}

