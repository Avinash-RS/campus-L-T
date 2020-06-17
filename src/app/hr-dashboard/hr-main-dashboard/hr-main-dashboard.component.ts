import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-hr-main-dashboard',
  templateUrl: './hr-main-dashboard.component.html',
  styleUrls: ['./hr-main-dashboard.component.scss']
})
export class HrMainDashboardComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);

  }

  ngOnInit() {
  }

}
