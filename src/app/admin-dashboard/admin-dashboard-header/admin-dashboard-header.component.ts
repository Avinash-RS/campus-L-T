import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-admin-dashboard-header',
  templateUrl: './admin-dashboard-header.component.html',
  styleUrls: ['./admin-dashboard-header.component.scss']
})
export class AdminDashboardHeaderComponent implements OnInit {

  username: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService
  ) { }

  ngOnInit() {
    this.username = this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : 'NA';
  }

  logOut() {
    const token = this.appConfig.getLocalData('logout-token');
    this.apiService.logout(token).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.appConfig.clearLocalData();
      this.appConfig.routeNavigation('/' + `${CONSTANT.ROUTES.HOME}`);
    }, (err) => {
    });
  }

}
