import { Component, OnInit, Input } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shared-evaluation-sub-header',
  templateUrl: './shared-evaluation-sub-header.component.html',
  styleUrls: ['./shared-evaluation-sub-header.component.scss']
})
export class SharedEvaluationSubHeaderComponent implements OnInit {

  @Input() details: any;
  @Input() selectedCandidates: any;
  bindDetails: any;
  nameOfAssessment: any;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.assessmentDetails();
  }



  assessmentDetails() {
        this.bindDetails = {
      assement_name: this.details && this.details[0] && this.details[0]['assement_name'] ? this.details[0]['assement_name'] : '-',
      date: this.details && this.details[0] && this.details[0]['date'] ? this.details[0]['date'] : '-',
      time: this.details && this.details[0] && this.details[0]['time'] ? this.details[0]['time'] : '-',
      group_name: this.details && this.details[0] && this.details[0]['group_name'] ? this.details[0]['group_name'] : '-',
      no_of_candidate: this.details && this.details[0] && this.details[0]['no_of_candidate'] ? this.details[0]['no_of_candidate'] : '-',
      shortlist_name: this.details && this.details[0] && this.details[0]['shortlist_name'] ? this.details[0]['shortlist_name'] : '-',
      tag_name: this.details && this.details[0] && this.details[0]['tag_name'] ? this.details[0]['tag_name'] : '-',
      status: this.details && this.details[0] && this.details[0]['evaluation_status'] != '2' ? 'waiting' : 'completed',
    };
  }

}
