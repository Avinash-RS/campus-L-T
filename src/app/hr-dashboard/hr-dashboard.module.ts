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
import { PersonalViewComponent } from './hr-reports/reports-list/personal-view/personal-view.component';


@NgModule({
  declarations: [HrMasterComponent, HrHeaderComponent, HrShortlistingComponent, FirstLevelShortlistComponent, HrMainDashboardComponent, HrUserManagementComponent, BulkUploadComponent, ApplyCriteriaComponent, ShortlistedCandidateListComponent, UploadedListComponent, HrReportsComponent, ReportsListComponent, PersonalViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    HrDashboardRoutingModule
  ]
})
export class HrDashboardModule { }
