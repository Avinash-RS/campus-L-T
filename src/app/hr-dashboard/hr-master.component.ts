import { Component, OnInit } from '@angular/core';
import { CONSTANT } from '../constants/app-constants.service';
import { AppConfigService } from '../config/app-config.service';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-hr-master',
  templateUrl: './hr-master.component.html',
  styleUrls: ['./hr-master.component.scss']
})
export class HrMasterComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  role = this.appConfig.getLocalData('roles');
  hrSideMenu: any;
  constructor(
    private appConfig: AppConfigService,
    ) {
    this.sendMenus();
  }

  sendMenus() {
    if (this.role == 'hr') {
    this.hrSideMenu = [
      {
        url: this.appConstant.HR_DASHBOARD.DASHBOARD,
        name: 'Dashboard',
        icon: 'icon-dashboard',
        hide: false
      },
      {
        url: this.appConstant.HR_DASHBOARD.USER_MANAGEMENT,
        name: 'User Management',
        icon: 'icon-manage_accounts',
        hide: false
      },
      {
        url: this.appConstant.HR_DASHBOARD.SHORTLISTING,
        name: 'Shortlists',
        icon: 'icon-person_search',
        hide: false
      },
      {
        url: this.appConstant.HR_DASHBOARD.EVALUATION,
        name: 'Panel Assignment',
        icon: 'icon-reg',
        hide: false
      },
      {
        url: this.appConstant.HR_DASHBOARD.BUSINESSROUTE,
        name: `IC's/Business`,
        icon: 'icon-portrait',
        hide: false
      },
      {
        url: this.appConstant.HR_DASHBOARD.REPORTS,
        name: `Reports`,
        icon: 'icon-Statistics',
        hide: false
      },
      {
        url: this.appConstant.HR_DASHBOARD.HR_STATUS,
        name: `Status`,
        icon: 'icon-track_changes',
        hide: false
      },
      {
        url: this.appConstant.HR_DASHBOARD.HR_MISCELLANEOUS,
        name: `Miscellaneous`,
        icon: 'icon-track_changes',
        hide: false
      }
  ];
  this.appConfig.getSelectedCustomerCode() == '#LTTS' ? this.hrSideMenu.shift() : this.hrSideMenu.shift();
}
if (this.role == 'ic') {
  this.hrSideMenu = [
    {
      url: this.appConstant.HR_DASHBOARD.OfferedCandidatesLIST,
      name: 'Business Panel',
      icon: 'icon-portrait',
      hide: false
    }
  ]
}
if (this.role == 'ssc_hr') {
  this.hrSideMenu = [
    {
      url: this.appConstant.HR_DASHBOARD.OfferedCandidatesLIST,
      name: 'SSC Panel',
      icon: 'icon-portrait',
      hide: false
    }
  ]
}
}
  ngOnInit() {
  }

}
