import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-candidate-main-dashboard',
  templateUrl: './candidate-main-dashboard.component.html',
  styleUrls: ['./candidate-main-dashboard.component.scss']
})
export class CandidateMainDashboardComponent implements OnInit {

  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService
  ) {
    const subWrapperMenus = [
      // {
      //   icon: '',
      //   name: 'VIEW DETAILS',
      //   router: CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS
      // },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

}
