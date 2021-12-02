import { Component, OnInit, OnDestroy } from '@angular/core';
import { CONSTANT } from '../constants/app-constants.service';
import { AppConfigService } from '../config/app-config.service';
import { SharedServiceService } from '../services/shared-service.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-interview-panel-master',
  templateUrl: './interview-panel-master.component.html',
  styleUrls: ['./interview-panel-master.component.scss']
})
export class InterviewPanelMasterComponent implements OnInit, OnDestroy {

  SideMenu: any;
  appConstant = CONSTANT.ENDPOINTS;
  refreshSubscription: Subscription;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    this.sendMenus();
  }

  sendMenus() {
    if (this.appConfig.getSelectedDrivePermissions() && this.appConfig.getSelectedDrivePermissions().video_assessment) {
      this.SideMenu = [
        {
          url: this.appConstant.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS,
          name: 'Dashboard',
          icon: 'icon-dashboard',
          hide: false
        },
        {
          url: this.appConstant.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_TAB_HOME,
          name: 'Video Assessments',
          icon: 'icon-video_camera',
          hide: false
        }
     ]
    } else {
      this.SideMenu = [
        {
          url: this.appConstant.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS,
          name: 'Dashboard',
          icon: 'icon-dashboard',
          hide: false
        },
        // {
        //   url: this.appConstant.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_TAB_HOME,
        //   name: 'Video Assessments',
        //   icon: 'icon-video_camera',
        //   hide: false
        // }
     ]
  }
}

  ngOnInit() {
    this.refreshOndriveChangeRXJS();
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
        if (this.appConfig.getLocalData('roles') == 'interview_panel') {
          this.sendMenus();
        }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
  }
}
