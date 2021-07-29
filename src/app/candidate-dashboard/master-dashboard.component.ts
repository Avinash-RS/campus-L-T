import { Component, OnInit } from '@angular/core';
import { CONSTANT } from '../constants/app-constants.service';
import { AppConfigService } from '../config/app-config.service';

@Component({
  selector: 'app-master-dashboard',
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.scss']
})
export class MasterDashboardComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  showProfileOnly = false;
  showDocuments = false;
  showJoiningForm: boolean;
  candidateSideMenu: any;
  constructor(
    private appConfig: AppConfigService,
  ) {
    if (this.appConfig.getLocalData('reDirectView') && this.appConfig.getLocalData('reDirectView') === 'false') {
      this.showProfileOnly = true;
    }
    if (this.appConfig.getLocalData('secondShortlist') && this.appConfig.getLocalData('secondShortlist') === 'true') {
      this.showDocuments = true;
    }
    if (this.appConfig.getLocalData('joiningFormAccess') && this.appConfig.getLocalData('joiningFormAccess') === 'true') {
      this.showJoiningForm = true;
    }

    this.sendMenus();
  }

  sendMenus() {
    if (!this.showJoiningForm) {
      this.candidateSideMenu = [
        {
          url: this.appConstant.CANDIDATE_DASHBOARD.PROFILE,
          name: 'Profile',
          icon: 'icon-Job',
          hide: false
        }
      ]
      if (this.showDocuments) {
        let add = {
          url: this.appConstant.CANDIDATE_DASHBOARD.DOCUMENT,
          name: 'Documents',
          icon: 'icon-Role',
          hide: false
        }
        this.candidateSideMenu.push(add);
      }
  }
  if (this.showJoiningForm) {
    this.candidateSideMenu = [
      {
        url: this.appConstant.CANDIDATE_DASHBOARD.JOINING,
        name: 'Joining Form',
        icon: 'icon-Assessment',
        hide: false,
        click: true
      },
      // {
      //   url: this.appConstant.CANDIDATE_DASHBOARD.JOINING_FAQ,
      //   name: 'FAQ',
      //   icon: 'assets/images/Page-1.svg',
      //   hide: false
      // }
    ]
}
  }

  ngOnInit() {
  }

}
