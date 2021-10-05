import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-hr-shortlisting',
  templateUrl: './hr-shortlisting.component.html',
  styleUrls: ['./hr-shortlisting.component.scss']
})
export class HrShortlistingComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: '',
        name: 'Applicants',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRSTSHORTLISTING
      },
      {
        icon: '',
        name: 'Shortlists',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING
      }
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);

  }

  ngOnInit() {
  }

}
