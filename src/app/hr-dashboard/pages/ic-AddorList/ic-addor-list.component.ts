import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ic-addor-list',
  templateUrl: './ic-addor-list.component.html',
  styleUrls: ['./ic-addor-list.component.scss']
})
export class IcAddorListComponent implements OnInit, OnDestroy {

  appConstant = CONSTANT.ENDPOINTS;
  role = this.appConfig.getLocalData('roles');
  TabIndex: any = this.appConfig.getLocalData('tabIndex') ? this.appConfig.getLocalData('tabIndex') : '0';
  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
  }

  ngOnInit() {
  }

  gotoNextTab(event) {
    this.TabIndex = event;
    this.appConfig.setLocalData('tabIndex', this.TabIndex);
  }

  tabChanged(event) {
    this.TabIndex = event.index;
    this.appConfig.setLocalData('tabIndex', this.TabIndex);
  }

  activeTab($event) {

  }

  ngOnDestroy() {
    this.appConfig.clearLocalDataOne('tabIndex');
  }
}
