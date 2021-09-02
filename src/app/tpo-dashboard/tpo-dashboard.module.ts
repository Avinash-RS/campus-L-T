import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TpoDashboardRoutingModule } from './tpo-dashboard-routing.module';
import { TpoMasterComponent } from './tpo-master.component';
import { TpoUserManagementComponent } from './tpo-user-management/tpo-user-management.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { TpoCandidatesStatusComponent } from './tpo-candidates-status/tpo-candidates-status.component';
import { TpoPreAssessmentComponent } from './tpo-candidates-status/tpo-pre-assessment/tpo-pre-assessment.component';
import { TpoRecruitmentComponent } from './tpo-candidates-status/tpo-recruitment/tpo-recruitment.component';
import { AgGridModule } from 'ag-grid-angular';
import { UserListComponent } from './tpo-user-management/user-list/user-list.component';
import { BulkUploadsComponent } from './tpo-user-management/bulk-uploads/bulk-uploads.component';


@NgModule({
  declarations: [TpoMasterComponent, TpoUserManagementComponent, TpoCandidatesStatusComponent, TpoPreAssessmentComponent, TpoRecruitmentComponent, UserListComponent, BulkUploadsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    TpoDashboardRoutingModule,
    AgGridModule.withComponents([])
  ]
})
export class TpoDashboardModule { }
