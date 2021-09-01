import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDashboardRoutingModule } from './master-dashboard-routing.module';
import { MasterDashboardComponent } from './master-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { UsersListComponent } from './user-management/users-list/users-list.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { InstituteApprovalsComponent } from './approvals/institute-approvals/institute-approvals.component';
import { AdminReportComponent } from './admin-report/admin-report.component';
import { AdminBulkUploadReportComponent } from './admin-report/admin-bulk-upload-report/admin-bulk-upload-report.component';
import { AdminInstitudeBulkUploadComponent } from './admin-report/admin-institude-bulk-upload/admin-institude-bulk-upload.component';
import { AgGridModule } from 'ag-grid-angular';
import { BulkUploadsComponent } from './user-management/bulk-uploads/bulk-uploads.component';


@NgModule({
  declarations: [MasterDashboardComponent, DashboardComponent, UserManagementComponent, UsersListComponent, ApprovalsComponent, InstituteApprovalsComponent, AdminReportComponent, AdminBulkUploadReportComponent, AdminInstitudeBulkUploadComponent, BulkUploadsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MasterDashboardRoutingModule,
    AgGridModule.withComponents([])
  ]
})
export class MasterDashboardModule { }
