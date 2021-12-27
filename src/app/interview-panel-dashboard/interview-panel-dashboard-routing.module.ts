import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewPanelMasterComponent } from './interview-panel-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { InvCandidateDetailsComponent } from './inv-candidate-details/inv-candidate-details.component';
import { InvParticularAssessmentCandidatesComponent } from './inv-candidate-details/inv-particular-assessment-candidates/inv-particular-assessment-candidates.component';
import { InvEvaluationMainScreenComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-evaluation-main-screen.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { InvpanelGuard } from '../guards/canload/invpanel.guard';
import { VideoAssessMainRouteComponent } from './pages/video-assess-main-route/video-assess-main-route.component';
import { VideoAssessAssignedCandidatesComponent } from './pages/video-assess-assigned-candidates/video-assess-assigned-candidates.component';
import { VideoAssessEvaluationScreenComponent } from './pages/video-assess-evaluation-screen/video-assess-evaluation-screen.component';


const routes: Routes = [
  {
    path: '', component: InterviewPanelMasterComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS}`,
        component: InvCandidateDetailsComponent, canActivate: [InvpanelGuard],
        data: {
          breadcrumb: 'Final Interview Candidates List'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST}`,
            component: InvParticularAssessmentCandidatesComponent,
            data: {
              breadcrumb: ''
            }
          },
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION}`,
            component: InvEvaluationMainScreenComponent,
            data: {
              breadcrumb: 'Evaluation'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_TAB_HOME}`,
        component: VideoAssessMainRouteComponent, canActivate: [InvpanelGuard],
        data: {
          breadcrumb: 'Video Review'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_ASSIGNED_DETAILS}`,
            component: VideoAssessAssignedCandidatesComponent,
            data: {
            breadcrumb: ''
            }
          },
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_EVALUATION_DETAILS}`,
            component: VideoAssessEvaluationScreenComponent,
            data: {
            breadcrumb: 'Evaluation'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_ASSIGNED_DETAILS}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS}`,
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewPanelDashboardRoutingModule { }
