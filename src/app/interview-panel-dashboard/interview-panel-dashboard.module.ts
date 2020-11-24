import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewPanelDashboardRoutingModule } from './interview-panel-dashboard-routing.module';
import { InterviewPanelMasterComponent } from './interview-panel-master.component';
import { InvCandidateDetailsComponent } from './inv-candidate-details/inv-candidate-details.component';
import { InvAssessmentShortlistedCandidatesComponent } from './inv-candidate-details/inv-assessment-shortlisted-candidates/inv-assessment-shortlisted-candidates.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { InvParticularAssessmentCandidatesComponent } from './inv-candidate-details/inv-particular-assessment-candidates/inv-particular-assessment-candidates.component';
import { InvEvaluationMainScreenComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-evaluation-main-screen.component';
import { InvSubAssessmentsComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-assessments/inv-sub-assessments.component';
import { InvSubEducationComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-education/inv-sub-education.component';
import { InvSubEmploymentComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-employment/inv-sub-employment.component';
import { InvSubEvaluateComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-evaluate/inv-sub-evaluate.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { SharedInvPanelHeaderComponent } from './inv-candidate-details/shared-inv-panel-header/shared-inv-panel-header.component';
import { SubSharedInvPanelHeaderComponent } from './inv-candidate-details/sub-shared-inv-panel-header/sub-shared-inv-panel-header.component';
import { InvShortlistedCandidatesViewScreenComponent } from './inv-candidate-details/inv-shortlisted-candidates-view-screen/inv-shortlisted-candidates-view-screen.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [InterviewPanelMasterComponent, InvCandidateDetailsComponent, InvAssessmentShortlistedCandidatesComponent, InvParticularAssessmentCandidatesComponent, InvEvaluationMainScreenComponent, InvSubAssessmentsComponent, InvSubEducationComponent, InvSubEmploymentComponent, InvSubEvaluateComponent, EvaluationFormComponent, SharedInvPanelHeaderComponent, SubSharedInvPanelHeaderComponent, InvShortlistedCandidatesViewScreenComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    InterviewPanelDashboardRoutingModule,
    AgGridModule.withComponents([])
  ]
})
export class InterviewPanelDashboardModule { }
