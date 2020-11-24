import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TpoDashboardRoutingModule } from './tpo-dashboard-routing.module';
import { TpoMasterComponent } from './tpo-master.component';
import { TpoUserManagementComponent } from './tpo-user-management/tpo-user-management.component';
import { CandidateUploadsComponent } from './tpo-user-management/candidate-uploads/candidate-uploads.component';
import { UploadedListComponent } from './tpo-user-management/candidate-uploads/uploaded-list/uploaded-list.component';
import { BulkUploadComponent } from './tpo-user-management/candidate-uploads/bulk-upload/bulk-upload.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { TpoCandidatesStatusComponent } from './tpo-candidates-status/tpo-candidates-status.component';
import { TpoPreAssessmentComponent } from './tpo-candidates-status/tpo-pre-assessment/tpo-pre-assessment.component';
import { TpoRecruitmentComponent } from './tpo-candidates-status/tpo-recruitment/tpo-recruitment.component';
import { TpoAddCandidateComponent } from './tpo-user-management/tpo-add-candidate/tpo-add-candidate.component';
import { TpoReportsComponent } from './tpo-reports/tpo-reports.component';
import { TpoBulkUploadReportsComponent } from './tpo-reports/tpo-bulk-upload-reports/tpo-bulk-upload-reports.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [TpoMasterComponent, TpoUserManagementComponent, CandidateUploadsComponent, UploadedListComponent, BulkUploadComponent, TpoCandidatesStatusComponent, TpoPreAssessmentComponent, TpoRecruitmentComponent, TpoAddCandidateComponent, TpoReportsComponent, TpoBulkUploadReportsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    TpoDashboardRoutingModule,
    AgGridModule.withComponents([])
  ]
})
export class TpoDashboardModule { }
