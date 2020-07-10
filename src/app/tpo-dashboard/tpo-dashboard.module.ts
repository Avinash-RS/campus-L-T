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


@NgModule({
  declarations: [TpoMasterComponent, TpoUserManagementComponent, CandidateUploadsComponent, UploadedListComponent, BulkUploadComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    TpoDashboardRoutingModule
  ]
})
export class TpoDashboardModule { }
