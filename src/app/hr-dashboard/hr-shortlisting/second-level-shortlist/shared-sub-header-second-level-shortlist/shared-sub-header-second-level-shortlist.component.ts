import { Component, OnInit, Input } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-shared-sub-header-second-level-shortlist',
  templateUrl: './shared-sub-header-second-level-shortlist.component.html',
  styleUrls: ['./shared-sub-header-second-level-shortlist.component.scss']
})
export class SharedSubHeaderSecondLevelShortlistComponent implements OnInit {

  @Input() details: any;
  @Input() selectedCandidates: any;
  bindDetails: any;
  constructor(
    private appConfig: AppConfigService,
  ) { }

  ngOnInit() {
    this.assessmentDetails();
  }

  assessmentDetails() {
    console.log('de', this.details);
    this.bindDetails = {
      assement_name: this.details && this.details[0] && this.details[0]['assement_name'] ? this.details[0]['assement_name'] : '-',
      date: this.details && this.details[0] && this.details[0]['date'] ? this.details[0]['date'] : '-',
      time: this.details && this.details[0] && this.details[0]['time'] ? this.details[0]['time'] : '-',
      group_name: this.details && this.details[0] && this.details[0]['group_name'] ? this.details[0]['group_name'] : '-',
      status: this.details && this.details[0] && this.details[0]['status'] ? this.details[0]['status'] : 'waiting',
      total: this.details && this.details[0] && this.details[0]['no_of_candidate'] ? this.details[0]['no_of_candidate'] : '-',
      selected: this.details && this.details[0] && this.details[0]['no_of_candidate'] ? this.details[0]['no_of_candidate'] : '-',
    };
  }

  viewReports() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_REPORTS);
  }
}
