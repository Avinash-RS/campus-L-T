import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-offered-candidates-list',
  templateUrl: './offered-candidates-list.component.html',
  styleUrls: ['./offered-candidates-list.component.scss']
})
export class OfferedCandidatesListComponent implements OnInit {

  appConstant = CONSTANT.ENDPOINTS;
  TabIndex: any = this.appConfig.getLocalData('tabIndex') ? this.appConfig.getLocalData('tabIndex') : '0';
  tab1Data: any;
  tab2Data: any;
  tab3Data: any;

  constructor(
    private sharedService: SharedServiceService,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '',
        name: 'Business Users List/Add',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.IC_ADDorLIST
      },
      {
        icon: '',
        name: 'Selected Candidates Upload/Assign',
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
