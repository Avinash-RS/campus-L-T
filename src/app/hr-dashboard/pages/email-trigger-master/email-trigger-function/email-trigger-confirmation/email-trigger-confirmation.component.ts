import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-email-trigger-confirmation',
  templateUrl: './email-trigger-confirmation.component.html',
  styleUrls: ['./email-trigger-confirmation.component.scss']
})
export class EmailTriggerConfirmationComponent implements OnInit, OnChanges {
  @Input() templateComponent: any;
  @Input() stageWiseDetails: any;
  @Input() stepperIndex: any;
  @Input() joblist_id: any;
  @Output() nextClickEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService
  ) { 
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.stepperIndex == 3 && this.stageWiseDetails && this.stageWiseDetails.selectedValue) {
      let stageDetail = {
        selectedCandidates: this.stageWiseDetails.gridApi.getSelectedNodes() ? this.stageWiseDetails.gridApi.getSelectedNodes() : [],
        selectedStageValue: this.stageWiseDetails.selectedValue,
        stagesList: this.stageWiseDetails.stagesList
      };
    }
  }

  backtoHome() {
    this.nextClickEmitter.emit(0);
  }

  jobstatus(joblist_id) {
    this.appConfig.routeNavigationWithQueryParamAndParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_EMAIL_JOBS_EMAIL_BATCH, joblist_id, {name: this.templateComponent?.activeTemplate?.template_name});
  }

}
