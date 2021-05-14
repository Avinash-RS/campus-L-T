import { JoiningContactComponent } from './candidate-joining-form/joining-contact/joining-contact.component';
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
import { KycthanksGuard } from '../guards/canload/kycthanks.guard';
import { CandidateHallticketComponent } from './candidate-hallticket/candidate-hallticket.component';
import { CandidateAssignedAssessmentListComponent } from './candidate-hallticket/candidate-assigned-assessment-list/candidate-assigned-assessment-list.component';
import { CandidateDocumentComponent } from './candidate-document/candidate-document.component';
import { from } from 'rxjs';
import { CandidateUploadDocumentComponent } from './candidate-document/candidate-upload-document/candidate-upload-document.component';
import {  RegistrationCloseComponent } from './registration-close/registration-close.component';
import { JoiningFormComponent } from './candidate-joining-form/joining-form/joining-form.component';
import { JoiningPersonalComponent } from './candidate-joining-form/joining-personal/joining-personal.component';


const routes: Routes = [
  {
    path: '', component: MasterDashboardComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      // {
      //   path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.DASHBOARD}`, component: CandidateHallticketComponent, canActivate: [CanloadGuard]
      // },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE}`, 
        component: CandidateProfileComponent, canActivate: [CanloadGuard],
        data: {
          breadcrumb: 'Profile'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_PERSONAL_DETAILS}`, 
            component: PersonalDetailsComponent, canActivate: [KycAccessGuard],
            data: {
              breadcrumb: 'Personal Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_EDUCATIONAL_DETAILS}`, 
            component: EducationalDetailsComponent, canActivate: [KycAccessGuard],
            data: {
              breadcrumb: 'Education Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_FAMILY_DETAILS}`, 
            component: FamilyDetailsComponent, canActivate: [KycAccessGuard],
            data: {
              breadcrumb: 'Family Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_GENERAL_DETAILS}`, 
            component: GeneralDetailsComponent, canActivate: [KycAccessGuard],
            data: {
              breadcrumb: 'General Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS}`, 
            component: ViewDetailsComponent, canActivate: [KycAccessGuard],
            data: {
              breadcrumb: 'View Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_CONFIRM}`, 
            component: ConfirmComponent, canActivate: [KycAccessGuard],
            data: {
              breadcrumb: 'Confirm'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.PROFILE_PERSONAL_DETAILS}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING}`, 
        component: JoiningFormComponent, canActivate: [CanloadGuard], 
        data: {
          breadcrumb: 'Joining Form'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_PERSONAL}`, 
            component: JoiningPersonalComponent,
            data: {
              breadcrumb: 'Personal Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_CONTACT}`, 
            component: JoiningContactComponent,
            data: {
              breadcrumb: 'Contact Details'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_PERSONAL}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.HALLTICKET}`, 
        component: CandidateHallticketComponent, canActivate: [CanloadGuard], 
        data: {
          breadcrumb: 'Hallticket'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.HALLTICKET_LIST}`, 
            component: CandidateAssignedAssessmentListComponent,
            data: {
              breadcrumb: 'List'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.HALLTICKET_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.DOCUMENT}`, 
        component: CandidateDocumentComponent, canActivate: [CanloadGuard], 
        data: {
          breadcrumb: 'Document'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.DOCUMENT_LIST}`, 
            component: CandidateUploadDocumentComponent,
            data: {
              breadcrumb: 'Document List'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.DOCUMENT_LIST}`,
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
    path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.KYC_THANKS}`, 
    component: KycSubmissionPageComponent, canActivate: [KycthanksGuard],
    data: {
      breadcrumb: 'Kyc Submitted'
    }
  },
  {
    path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.REGISTRATION_CLOSE}`, 
    component: RegistrationCloseComponent, canActivate: [KycthanksGuard],
    data: {
      breadcrumb: 'Registration close'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateDashboardRoutingModule { }
