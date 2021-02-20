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
  role = this.appConfig.getLocalData('roles');
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
