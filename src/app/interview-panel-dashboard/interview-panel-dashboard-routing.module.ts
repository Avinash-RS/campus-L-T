import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewPanelMasterComponent } from './interview-panel-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { InvCandidateDetailsComponent } from './inv-candidate-details/inv-candidate-details.component';
import { InvAssessmentShortlistedCandidatesComponent } from './inv-candidate-details/inv-assessment-shortlisted-candidates/inv-assessment-shortlisted-candidates.component';
import { InvParticularAssessmentCandidatesComponent } from './inv-candidate-details/inv-particular-assessment-candidates/inv-particular-assessment-candidates.component';
import { InvEvaluationMainScreenComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-evaluation-main-screen.component';
import { InvSubAssessmentsComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-assessments/inv-sub-assessments.component';
import { InvSubEducationComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-education/inv-sub-education.component';
import { InvSubEmploymentComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-employment/inv-sub-employment.component';
import { InvSubEvaluateComponent } from './inv-candidate-details/inv-evaluation-main-screen/inv-sub-evaluate/inv-sub-evaluate.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { InvShortlistedCandidatesViewScreenComponent } from './inv-candidate-details/inv-shortlisted-candidates-view-screen/inv-shortlisted-candidates-view-screen.component';
import { InvpanelGuard } from '../guards/canload/invpanel.guard';


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
          breadcrumb: 'Candidates'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_ASSESSMENT_LIST}`, 
            component: InvAssessmentShortlistedCandidatesComponent,
            data: {
              breadcrumb: 'Assessment List'
            }
          },
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST}`, 
            component: InvParticularAssessmentCandidatesComponent,
            data: {
              breadcrumb: 'Assessment'
            }
          },
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_SUBMITTED}`, 
            component: InvShortlistedCandidatesViewScreenComponent,
            data: {
              breadcrumb: 'Submitted'
            }
          },
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION}`, 
            component: InvEvaluationMainScreenComponent,
            data: {
              breadcrumb: 'Evaluation'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.SUB_ASSESSMENTS}`, 
                component: InvSubAssessmentsComponent,
                data: {
                  breadcrumb: 'Assessment'
                }
              },
              {
                path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.SUB_EDUCATION}`, 
                component: InvSubEducationComponent,
                data: {
                  breadcrumb: 'Education'
                }
              },
              {
                path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.SUB_EMPLOYMENT}`, 
                component: InvSubEmploymentComponent,
                data: {
                  breadcrumb: 'Employment'
                }
              },
              {
                path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.SUB_EVALUATION}`, 
                component: InvSubEvaluateComponent,
                data: {
                  breadcrumb: 'Evaluate'
                }
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.SUB_ASSESSMENTS}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_ASSESSMENT_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS}`,
        pathMatch: 'full',
      },

      {
        path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.EVALUATION_FORM}`, 
        component: EvaluationFormComponent,
        data: {
          breadcrumb: 'Evaluation Form'
        }
        // redirectTo: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.EVALUATION_FORM}`,
        // pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewPanelDashboardRoutingModule { }
