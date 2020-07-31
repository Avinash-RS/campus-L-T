import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-tpo-reports',
  templateUrl: './tpo-reports.component.html',
  styleUrls: ['./tpo-reports.component.scss']
})
export class TpoReportsComponent implements OnInit {

  constructor(private appConfig: AppConfigService,
    private sharedService: SharedServiceService) { 
      // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '',
        name: 'Candidate Bulk Upload Reports',
        router: CONSTANT.ENDPOINTS.TPO_DASHBOARD.TPO_BULK_CANDIDATE_UPLOAD_REPORTS_LIST
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    }

  ngOnInit() {
  }

}
