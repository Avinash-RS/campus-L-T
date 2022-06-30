import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-off-campus-submitted-confirmation',
  templateUrl: './off-campus-submitted-confirmation.component.html',
  styleUrls: ['./off-campus-submitted-confirmation.component.scss']
})
export class OffCampusSubmittedConfirmationComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService
  ) { 
    if (this.appConfig.getLocalData('submitted') == 'true') {

    } else {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.UNAUTHENTICATED.OFF_CAMPUS_PROFILE);
    }
  }

  ngOnInit() {
  }

}
