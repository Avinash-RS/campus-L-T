import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ActivatedRoute } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  redirectedFrom: any;
  supportEmail = this.appConfig.supportEmailBasedOnCustomer();
  isValidUser = this.appConfig.getLocalData('userEmail');

  constructor(
    private appConfig: AppConfigService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedServiceService
  ) { }

  ngOnInit() {
  }

  routeToHome() {
    this.appConfig.routeNavigation('/');
  }

  logout() {
    this.appConfig.routeNavigation('/');
  }
}
