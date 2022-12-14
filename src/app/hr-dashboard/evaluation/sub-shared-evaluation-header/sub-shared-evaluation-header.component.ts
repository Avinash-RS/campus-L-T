import { Component, OnInit, Input } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sub-shared-evaluation-header',
  templateUrl: './sub-shared-evaluation-header.component.html',
  styleUrls: ['./sub-shared-evaluation-header.component.scss']
})
export class SubSharedEvaluationHeaderComponent implements OnInit {

  @Input() details: any;
  @Input() name: any;
  @Input() cid: any;
  @Input() status: any;
  @Input() tag: any;
  bindDetails: any;
  nameOfAssessment: any;
  profilePic: any;
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
    this.profilePic = this.appConfig.getLocalData('cProPic') ? this.appConfig.getLocalData('cProPic') : null;
    this.bindDetails = {
      assement_name: this.details && this.details[0] && this.details[0]['assement_name'] ? this.details[0]['assement_name'] : '-',
      date: this.details && this.details[0] && this.details[0]['date'] ? this.details[0]['date'] : '-',
      time: this.details && this.details[0] && this.details[0]['time'] ? this.details[0]['time'] : '-',
      group_name: this.details && this.details[0] && this.details[0]['group_name'] ? this.details[0]['group_name'] : '-',
      status: this.details && this.details[0] && this.details[0]['evaluation_status'] && this.details[0]['evaluation_status'] != '0' ? 'completed' : 'waiting',
      no_of_candidate: this.details && this.details[0] && this.details[0]['no_of_candidate'] ? this.details[0]['no_of_candidate'] : '-',
      shortlist_name: this.details && this.details[0] && this.details[0]['shortlist_name'] ? this.details[0]['shortlist_name'] : '-',
      tag_name: this.details && this.details[0] && this.details[0]['tag_name'] ? this.details[0]['tag_name'] : '-',
    };
  }

}
