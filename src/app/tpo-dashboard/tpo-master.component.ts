import { Component, OnInit } from '@angular/core';
import { CONSTANT } from '../constants/app-constants.service';


@Component({
  selector: 'app-tpo-master',
  templateUrl: './tpo-master.component.html',
  styleUrls: ['./tpo-master.component.scss']
})
export class TpoMasterComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  SideMenu: any;
  constructor(
  ) {
    this.sendMenus();
  }

  sendMenus() {
      this.SideMenu = [
        {
          url: this.appConstant.TPO_DASHBOARD.USER_MANAGEMENT,
          name: 'User Management',
          icon: 'icon-manage_accounts',
          hide: false
        },
        {
          url: this.appConstant.TPO_DASHBOARD.STATUS,
          name: 'Status',
          icon: 'icon-track_changes',
          hide: false
        }
      ]
  }

  ngOnInit() {
  }

}
