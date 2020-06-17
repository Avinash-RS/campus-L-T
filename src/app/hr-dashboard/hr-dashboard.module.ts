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


@NgModule({
  declarations: [HrMasterComponent, HrHeaderComponent, HrShortlistingComponent, FirstLevelShortlistComponent, HrMainDashboardComponent, HrUserManagementComponent, BulkUploadComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    HrDashboardRoutingModule
  ]
})
export class HrDashboardModule { }
