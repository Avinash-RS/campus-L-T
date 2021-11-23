import { Component, OnInit } from '@angular/core';
import { CONSTANT } from '../constants/app-constants.service';

@Component({
  selector: 'app-interview-panel-master',
  templateUrl: './interview-panel-master.component.html',
  styleUrls: ['./interview-panel-master.component.scss']
})
export class InterviewPanelMasterComponent implements OnInit {

  SideMenu: any;
  appConstant = CONSTANT.ENDPOINTS;

  constructor() {
    this.sendMenus();
  }

  sendMenus() {
    this.SideMenu = [
      {
        url: this.appConstant.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS,
        name: 'Dashboard',
        icon: 'icon-dashboard',
        hide: false
      },
      {
        url: this.appConstant.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_ASSIGNED_DETAILS,
        name: 'Video Assessments',
        icon: 'icon-video_camera',
        hide: false
      }
  ]
}

  ngOnInit() {
  }

}
