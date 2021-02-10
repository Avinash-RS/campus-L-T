import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-ic-addor-list',
  templateUrl: './ic-addor-list.component.html',
  styleUrls: ['./ic-addor-list.component.scss']
})
export class IcAddorListComponent implements OnInit, OnDestroy {

  appConstant = CONSTANT.ENDPOINTS;
  TabIndex: any = this.appConfig.getLocalData('tabIndex') ? this.appConfig.getLocalData('tabIndex') : '0';

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '',
        name: 'IC List/Add',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.IC_ADDorLIST
      },
      {
        icon: '',
        name: 'Offered Candidates/Assign Candidates',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.OfferedCandidatesLIST
      },
      // {
      //   icon: '002-group-1.svg',
      //   name: 'Bulk assign',
      //   router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_RESULTS_UPLOAD
      // }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
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
