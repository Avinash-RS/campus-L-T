import { Component, OnInit } from '@angular/core';
import { CONSTANT } from '../constants/app-constants.service';
import { AppConfigService } from '../config/app-config.service';
import { SharedServiceService } from '../services/shared-service.service';

@Component({
  selector: 'app-hr-master',
  templateUrl: './hr-master.component.html',
  styleUrls: ['./hr-master.component.scss']
})
export class HrMasterComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  sidebarOpen;
  subMenus: any;
  activeSubmenu;
  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
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
