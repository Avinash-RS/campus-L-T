import { Component, OnInit, OnChanges, OnDestroy, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shared-video-assess-view',
  templateUrl: './shared-video-assess-view.component.html',
  styleUrls: ['./shared-video-assess-view.component.scss']
})

export class SharedVideoAssessViewComponent implements OnInit, OnChanges, OnDestroy {
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('sourceVideo',{static: false}) video: TemplateRef<any>;
  @Input() videoAssessment: any;
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
  selectedStatus = '';
  feedbackformControl = new FormControl(null, [Validators.required, this.globalValidators.address255()])
  feedbackApiLoading: boolean;
  ViewSchedulingDetailsSubscription: Subscription;
  getproctorTokenSubscription: Subscription;
  getProctorVideoSubscription: Subscription;
  saveVideoSchedulingFeedBackSubscription: Subscription;
  activatedRouteSubscription: Subscription;

  constructor(
    private appConfig: AppConfigService,
    private globalValidators: GlobalValidatorService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.appConfig.clearLocalDataOne('Proctor_token');
  }

  ngOnChanges() {
    this.appConfig.clearLocalDataOne('Proctor_token');
    if ((this.videoAssessment && this.videoAssessment.scheduled_status)) {
    this.getScheduleDetails(this.videoAssessment && this.videoAssessment.schedule_id ? this.videoAssessment.schedule_id : '');
    this.getProctorToken();
    }
  }

  getScheduleDetails(data) {
    let apiData = {
      "scheduleId": data ? data.toString() : ''
      }
      if (!this.testDetailsArray) {
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
      if ((!this.testDetailsArray || this.playVideoList.length < 1)) {
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
  //     roomId: '45647bb7-0d47-412c-a3f5-700f40f699b5'
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
      shortlist_name: this.videoAssessment && this.videoAssessment.shortlist_name ? this.videoAssessment.shortlist_name : '',
      evaluation_status: this.selectedStatus,
      remarks: this.feedbackformControl.value,
      schedule_id: this.videoAssessment.schedule_id,
      candidate_user_id: this.videoAssessment && this.videoAssessment.uid ? this.videoAssessment.uid : ''
  }
  this.feedbackApiLoading = true;
 this.saveVideoSchedulingFeedBackSubscription = this.adminService.saveVideoSchedulingFeedBack(apiData).subscribe((response: any)=> {
    this.feedbackApiLoading = false;
    this.showFeedback = false;
    this.appConfig.success('Feedback has been updated successfully...');
    this.videoAssessment.evaluated_by = this.appConfig.getLocalData('username');
    this.videoAssessment.evaluation_status = this.selectedStatus.includes('selected') ? 'Selected' : 'Rejected';
    this.videoAssessment.remarks = apiData.remarks;
    if (this.videoAssessment.redirectedFrom && this.videoAssessment.redirectedFrom == 'hr') {
      this.refreshGrid.emit();
    }
  }, (err)=> {
    this.feedbackApiLoading = false;
  });
  } else {
    this.feedbackformControl.markAsTouched();
  }
}

  isAccessGranted() {
    if (this.videoAssessment && this.videoAssessment.redirectedFrom && this.videoAssessment.redirectedFrom == 'external evaluator') {
      return true;
    } else {
      if(this.videoAssessment && this.videoAssessment.scheduled_status && this.appConfig.getSelectedDrivePermissions().video_assessment) {
        return true;
      } else {
        return false;
      }
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
