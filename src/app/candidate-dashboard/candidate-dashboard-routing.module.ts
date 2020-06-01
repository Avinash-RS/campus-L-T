import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterDashboardComponent } from './master-dashboard.component';
import { CONSTANT } from '../constants/app-constants.service';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { PersonalDetailsComponent } from './candidate-profile/personal-details/personal-details.component';
import { EducationalDetailsComponent } from './candidate-profile/educational-details/educational-details.component';
import { FamilyDetailsComponent } from './candidate-profile/family-details/family-details.component';
import { GeneralDetailsComponent } from './candidate-profile/general-details/general-details.component';
import { ConfirmComponent } from './candidate-profile/confirm/confirm.component';
import { ViewDetailsComponent } from './candidate-profile/view-details/view-details.component';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';


const routes: Routes = [
  {
    path: '', component: MasterDashboardComponent,
    children: [
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE}`, component: CandidateProfileComponent, children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_PERSONAL_DETAILS}`, component: PersonalDetailsComponent
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_EDUCATIONAL_DETAILS}`, component: EducationalDetailsComponent
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_FAMILY_DETAILS}`, component: FamilyDetailsComponent
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_GENERAL_DETAILS}`, component: GeneralDetailsComponent
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS}`, component: ViewDetailsComponent
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_CONFIRM}`, component: ConfirmComponent
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_PERSONAL_DETAILS}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE}`,
        pathMatch: 'full',

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateDashboardRoutingModule { }
