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
import { KycAccessGuard } from '../guards/access-to-kyc-forms/kyc-access.guard';
import { KycSubmissionPageComponent } from './kyc-submission-page/kyc-submission-page.component';
import { CanloadGuard } from '../guards/canload/canload.guard';


const routes: Routes = [
  {
    path: '', component: MasterDashboardComponent,
    children: [
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE}`, component: CandidateProfileComponent, canActivate: [CanloadGuard], children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_PERSONAL_DETAILS}`, component: PersonalDetailsComponent, canActivate: [KycAccessGuard]
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_EDUCATIONAL_DETAILS}`, component: EducationalDetailsComponent, canActivate: [KycAccessGuard]
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_FAMILY_DETAILS}`, component: FamilyDetailsComponent, canActivate: [KycAccessGuard]
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_GENERAL_DETAILS}`, component: GeneralDetailsComponent, canActivate: [KycAccessGuard]
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS}`, component: ViewDetailsComponent, canActivate: [KycAccessGuard]
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_CONFIRM}`, component: ConfirmComponent, canActivate: [KycAccessGuard]
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
  },
  {
    path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.KYC_THANKS}`, component: KycSubmissionPageComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateDashboardRoutingModule { }