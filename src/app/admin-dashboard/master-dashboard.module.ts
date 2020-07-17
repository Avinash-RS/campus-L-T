import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDashboardRoutingModule } from './master-dashboard-routing.module';
import { MasterDashboardComponent } from './master-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { AdminDashboardHeaderComponent } from './admin-dashboard-header/admin-dashboard-header.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UsersListComponent } from './user-management/users-list/users-list.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { AdminBulkUploadInstitutesComponent } from './user-management/admin-bulk-upload-institutes/admin-bulk-upload-institutes.component';
import { AdminUploadedInstituteListComponent } from './user-management/admin-bulk-upload-institutes/admin-uploaded-institute-list/admin-uploaded-institute-list.component';
import { AdminBulkUploadInstituteComponent } from './user-management/admin-bulk-upload-institutes/admin-bulk-upload-institute/admin-bulk-upload-institute.component';
import { AdminBulkUploadCandidatesComponent } from './user-management/admin-bulk-upload-candidates/admin-bulk-upload-candidates.component';
import { AdminUploadedCandidateListComponent } from './user-management/admin-bulk-upload-candidates/admin-uploaded-candidate-list/admin-uploaded-candidate-list.component';
import { AdminBulkUploadCandidateCompComponent } from './user-management/admin-bulk-upload-candidates/admin-bulk-upload-candidate-comp/admin-bulk-upload-candidate-comp.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { InstituteApprovalsComponent } from './approvals/institute-approvals/institute-approvals.component';


@NgModule({
  declarations: [MasterDashboardComponent, DashboardComponent, AdminDashboardHeaderComponent, UserManagementComponent, UsersListComponent, AddUserComponent, AdminBulkUploadInstitutesComponent, AdminUploadedInstituteListComponent, AdminBulkUploadInstituteComponent, AdminBulkUploadCandidatesComponent, AdminUploadedCandidateListComponent, AdminBulkUploadCandidateCompComponent, ApprovalsComponent, InstituteApprovalsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MasterDashboardRoutingModule,
  ]
})
export class MasterDashboardModule { }
