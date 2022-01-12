import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateDashboardRoutingModule } from './candidate-dashboard-routing.module';
import { MasterDashboardComponent } from './master-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [MasterDashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    CandidateDashboardRoutingModule
  ]
})
export class CandidateDashboardModule { }
