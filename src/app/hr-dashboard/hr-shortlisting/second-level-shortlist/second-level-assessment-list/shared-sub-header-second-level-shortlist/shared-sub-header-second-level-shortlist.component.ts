import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-shared-sub-header-second-level-shortlist',
  templateUrl: './shared-sub-header-second-level-shortlist.component.html',
  styleUrls: ['./shared-sub-header-second-level-shortlist.component.scss']
})
export class SharedSubHeaderSecondLevelShortlistComponent implements OnInit {

  @Input() statusHeaderData: any;
  @Input() showSendEvaluationButton;
  @Input() showSendEmailButton;
  @Output() redirectToVideoAssessAssign: EventEmitter<any> = new EventEmitter<any>();
  bindDetails: any;
  constructor(
    private appConfig: AppConfigService,
  ) { }

  ngOnInit() {
    this.assessmentDetails();
  }

  checkPermission() {
    if (this.appConfig.getSelectedDrivePermissions() && this.appConfig.getSelectedDrivePermissions().video_assessment) {
      return true;
    } else {
      return false;
    }
  }

  assessmentDetails() {
    this.bindDetails = {
      shortlist_name: this.statusHeaderData.shortlist_name,
      status: this.statusHeaderData.shortlist_status,
      total: this.statusHeaderData.total_no_of_candidates,
      available: this.statusHeaderData.available,
      shortlisted: this.statusHeaderData.shortlisted,
      notTaken: this.statusHeaderData.notTaken,
      header: this.statusHeaderData.header ? true : false,
    };
  }

  sendToEvaluate() {
    this.redirectToVideoAssessAssign.emit();
  }

}
