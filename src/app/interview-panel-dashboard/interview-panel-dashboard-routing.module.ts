import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewPanelMasterComponent } from './interview-panel-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { InvCandidateDetailsComponent } from './inv-candidate-details/inv-candidate-details.component';
import { InvAssessmentShortlistedCandidatesComponent } from './inv-candidate-details/inv-assessment-shortlisted-candidates/inv-assessment-shortlisted-candidates.component';


const routes: Routes = [
  {
    path: '', component: InterviewPanelMasterComponent,
    children: [
      {
        path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS}`, component: InvCandidateDetailsComponent,
        children: [
          {
            path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_ASSESSMENT_LIST}`, component: InvAssessmentShortlistedCandidatesComponent
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
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewPanelDashboardRoutingModule { }
