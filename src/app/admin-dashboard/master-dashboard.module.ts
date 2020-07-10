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


@NgModule({
  declarations: [MasterDashboardComponent, DashboardComponent, AdminDashboardHeaderComponent, UserManagementComponent, UsersListComponent, AddUserComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MasterDashboardRoutingModule,
  ]
})
export class MasterDashboardModule { }
