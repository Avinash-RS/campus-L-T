import { Component, OnInit, OnChanges } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-master-dashboard',
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.scss']
})
export class MasterDashboardComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  SideMenu: any;

  constructor() {
    this.sendMenus();
  }

  sendMenus() {
    this.SideMenu = [
      {
        url: this.appConstant.ADMIN_DASHBOARD.USER_MANAGEMENT,
        name: 'User Management',
        icon: 'icon-manage_accounts',
        hide: false
      },
      {
        url: this.appConstant.ADMIN_DASHBOARD.APPROVALS,
        name: 'Approvals',
        icon: 'icon-track_changes',
        hide: false
      }
    ]
}

  ngOnInit() {
  }

}
