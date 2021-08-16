import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-tpo-candidates-status',
  templateUrl: './tpo-candidates-status.component.html',
  styleUrls: ['./tpo-candidates-status.component.scss']
})
export class TpoCandidatesStatusComponent implements OnInit, AfterViewInit {

  appConstant = CONSTANT.ENDPOINTS;

  constructor(
    private appConfig: AppConfigService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      // {
      //   icon: '002-files-and-folders.svg',
      //   name: 'Pre-assessment',
      //   router: CONSTANT.ENDPOINTS.TPO_DASHBOARD.STATUS_PREASSESSMENT
      // },
      {
        icon: 'recruitment.svg',
        name: 'Recruitment',
        router: CONSTANT.ENDPOINTS.TPO_DASHBOARD.STATUS_RECRUITMENT
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
 }

}
