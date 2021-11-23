import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewPanelDashboardRoutingModule } from './interview-panel-dashboard-routing.module';
import { InterviewPanelMasterComponent } from './interview-panel-master.component';
import { InvCandidateDetailsComponent } from './inv-candidate-details/inv-candidate-details.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { InvParticularAssessmentCandidatesComponent } from './inv-candidate-details/inv-particular-assessment-candidates/inv-particular-assessment-candidates.component';
import { InvEvaluationMainScreenComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-evaluation-main-screen.component';
import { InvSubAssessmentsComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-assessments/inv-sub-assessments.component';
import { InvSubEducationComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-education/inv-sub-education.component';
import { InvSubEmploymentComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-employment/inv-sub-employment.component';
import { InvSubEvaluateComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-evaluate/inv-sub-evaluate.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { SubSharedInvPanelHeaderComponent } from './inv-candidate-details/sub-shared-inv-panel-header/sub-shared-inv-panel-header.component';

import { AgGridModule } from 'ag-grid-angular';
import { BisEvaluationFormComponent } from './bis-evaluation-form/bis-evaluation-form.component';
import { InvUnifiedreportsComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-unifiedreports/inv-unifiedreports.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InvJoinInterviewComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-join-interview/inv-join-interview.component';
import { CaEvaluationFormComponent } from './evaluation-form/ca-evaluation-form/ca-evaluation-form.component';
import { VideoAssessMainRouteComponent } from './pages/video-assess-main-route/video-assess-main-route.component';
import { VideoAssessAssignedCandidatesComponent } from './pages/video-assess-assigned-candidates/video-assess-assigned-candidates.component';
import { VideoAssessEvaluationScreenComponent } from './pages/video-assess-evaluation-screen/video-assess-evaluation-screen.component';


@NgModule({
  declarations: [InterviewPanelMasterComponent, InvCandidateDetailsComponent, InvParticularAssessmentCandidatesComponent, InvEvaluationMainScreenComponent, InvSubAssessmentsComponent, InvSubEducationComponent, InvSubEmploymentComponent, InvSubEvaluateComponent, EvaluationFormComponent, SubSharedInvPanelHeaderComponent, BisEvaluationFormComponent, InvUnifiedreportsComponent, InvJoinInterviewComponent, CaEvaluationFormComponent, VideoAssessMainRouteComponent, VideoAssessAssignedCandidatesComponent, VideoAssessEvaluationScreenComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    InterviewPanelDashboardRoutingModule,
    PdfViewerModule,
    AgGridModule.withComponents([])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class InterviewPanelDashboardModule { }
