import { Component, OnInit } from '@angular/core';
import { CONSTANT } from '../constants/app-constants.service';
import { AppConfigService } from '../config/app-config.service';
import { SharedServiceService } from '../services/shared-service.service';

@Component({
  selector: 'app-master-dashboard',
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.scss']
})
export class MasterDashboardComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  sidebarOpen;
  subMenus: any;
  activeSubmenu;
  showProfileOnly = false;
  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    if (this.appConfig.getLocalData('reDirectView') && this.appConfig.getLocalData('reDirectView') === 'false') {
      this.showProfileOnly = true;
    }

    // Assigning sub menus for the current router
    this.sharedService.subMenuSubject.subscribe((data: any) => {
      this.subMenus = data;
    });
  }

  ngOnInit() {
    this.sidebarOpen = true;
  }
  sidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
