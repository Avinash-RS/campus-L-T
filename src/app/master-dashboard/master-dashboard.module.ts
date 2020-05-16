import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDashboardRoutingModule } from './master-dashboard-routing.module';
import { MasterDashboardComponent } from './master-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [MasterDashboardComponent, DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MasterDashboardRoutingModule
  ]
})
export class MasterDashboardModule { }
