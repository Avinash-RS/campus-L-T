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
    console.log('adadad')
    if (this.appConfig.getLocalData('showDocumentsTab') && this.appConfig.getLocalData('showDocumentsTab') === 'true' && this.appConfig.getLocalData('joiningFormAccess') !== 'true') {
      this.showDocuments = true;
    }
    if (this.appConfig.getLocalData('joiningFormAccess') && this.appConfig.getLocalData('joiningFormAccess') === 'true') {
      this.showJoiningForm = true;
    }

    this.sendMenus();
  }

  sendMenus() {
      this.candidateSideMenu = [
        {
          url: this.appConstant.CANDIDATE_DASHBOARD.JOINING,
          name: this.showJoiningForm ? 'Joining Form' : 'Profile Form',
          icon: 'icon-Assessment',
          hide: false,
          click: true
        },
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

  ngOnInit() {
  }

}
