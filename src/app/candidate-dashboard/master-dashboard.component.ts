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
  }

}
