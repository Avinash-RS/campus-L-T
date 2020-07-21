import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrDashboardRoutingModule } from './hr-dashboard-routing.module';
import { HrMasterComponent } from './hr-master.component';
import { HrHeaderComponent } from './hr-header/hr-header.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { HrShortlistingComponent } from './hr-shortlisting/hr-shortlisting.component';
import { FirstLevelShortlistComponent } from './hr-shortlisting/first-level-shortlist/first-level-shortlist.component';
import { HrMainDashboardComponent } from './hr-main-dashboard/hr-main-dashboard.component';
import { HrUserManagementComponent } from './hr-user-management/hr-user-management.component';
import { BulkUploadComponent } from './hr-user-management/bulk-upload/bulk-upload.component';
import { ApplyCriteriaComponent } from './hr-shortlisting/first-level-shortlist/apply-criteria/apply-criteria.component';
import { ShortlistedCandidateListComponent } from './hr-shortlisting/first-level-shortlist/shortlisted-candidate-list/shortlisted-candidate-list.component';
import { UploadedListComponent } from './hr-user-management/uploaded-list/uploaded-list.component';
import { HrReportsComponent } from './hr-reports/hr-reports.component';
import { ReportsListComponent } from './hr-reports/reports-list/reports-list.component';
import { FirstLevelShorlistReportsComponent } from './hr-reports/first-level-shorlist-reports/first-level-shorlist-reports.component';
import { BulkUploadReportsComponent } from './hr-reports/bulk-upload-reports/bulk-upload-reports.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { EvaluationCandidateDetailsComponent } from './evaluation/evaluation-candidate-details/evaluation-candidate-details.component';
import { EvaluationInterviewPanelComponent } from './evaluation/evaluation-interview-panel/evaluation-interview-panel.component';


@NgModule({
  declarations: [HrMasterComponent, HrHeaderComponent, HrShortlistingComponent, FirstLevelShortlistComponent, HrMainDashboardComponent, HrUserManagementComponent, BulkUploadComponent, ApplyCriteriaComponent, ShortlistedCandidateListComponent, UploadedListComponent, HrReportsComponent, ReportsListComponent, FirstLevelShorlistReportsComponent, BulkUploadReportsComponent, EvaluationComponent, EvaluationCandidateDetailsComponent, EvaluationInterviewPanelComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    HrDashboardRoutingModule
  ]
})
export class HrDashboardModule { }
