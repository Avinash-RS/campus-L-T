import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewPanelDashboardRoutingModule } from './interview-panel-dashboard-routing.module';
import { InterviewPanelMasterComponent } from './interview-panel-master.component';
import { InvCandidateDetailsComponent } from './inv-candidate-details/inv-candidate-details.component';
import { InvAssessmentShortlistedCandidatesComponent } from './inv-candidate-details/inv-assessment-shortlisted-candidates/inv-assessment-shortlisted-candidates.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [InterviewPanelMasterComponent, InvCandidateDetailsComponent, InvAssessmentShortlistedCandidatesComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    InterviewPanelDashboardRoutingModule
  ]
})
export class InterviewPanelDashboardModule { }
