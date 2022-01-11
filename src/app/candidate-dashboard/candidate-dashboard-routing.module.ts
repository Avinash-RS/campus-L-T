import { CandidateFaqComponent } from './candidate-faq/candidate-faq.component';
import { JoiningWorkDetailsComponent } from './candidate-joining-form/joining-work-details/joining-work-details.component';
import { JoiningSubmitComponent } from './candidate-joining-form/joining-submit/joining-submit.component';
import { JoiningPreviewComponent } from './candidate-joining-form/joining-preview/joining-preview.component';
import { JoiningUploadComponent } from './candidate-joining-form/joining-upload/joining-upload.component';
import { JoiningEducationComponent } from './candidate-joining-form/joining-education/joining-education.component';
import { JoiningDependentComponent } from './candidate-joining-form/joining-dependent/joining-dependent.component';
import { JoiningContactComponent } from './candidate-joining-form/joining-contact/joining-contact.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterDashboardComponent } from './master-dashboard.component';
import { CONSTANT } from '../constants/app-constants.service';
import { CanloadGuard } from '../guards/canload/canload.guard';
import { CandidateDocumentComponent } from './candidate-document/candidate-document.component';
import { CandidateUploadDocumentComponent } from './candidate-document/candidate-upload-document/candidate-upload-document.component';
import { JoiningFormComponent } from './candidate-joining-form/joining-form/joining-form.component';
import { JoiningPersonalComponent } from './candidate-joining-form/joining-personal/joining-personal.component';
import { AuthGuard } from '../guards/auth.guard';
const routes: Routes = [
  {
    path: '', component: MasterDashboardComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING}`,
        component: JoiningFormComponent, canActivate: [CanloadGuard],
        data: {
          breadcrumb: JSON.parse(localStorage.getItem('selected_customer'))?.customer_name
        },

        
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
            component: JoiningPersonalComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Personal Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_CONTACT}`,
            component: JoiningContactComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Contact Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_DEPENDENT}`,
            component: JoiningDependentComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Dependent Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_EDUCATION}`,
            component: JoiningEducationComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Education Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_WORK}`,
            component: JoiningWorkDetailsComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Work Experience Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_UPLOAD}`,
            component: JoiningUploadComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Upload Documents'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_PREVIEW}`,
            component: JoiningPreviewComponent,
            data: {
              breadcrumb: 'Preview'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_SUBMIT}`,
            component: JoiningSubmitComponent,
            data: {
              breadcrumb: 'Submit'
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
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.DOCUMENT}`,
        component: CandidateDocumentComponent, canActivate: [CanloadGuard],
        data: {
          breadcrumb: 'Upload Documents'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.DOCUMENT_LIST}`,
            component: CandidateUploadDocumentComponent,
            data: {
              breadcrumb: ''
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
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING_FAQ}`,
        component: CandidateFaqComponent, canActivate: [CanloadGuard],
        data: {
          breadcrumb: 'FAQ'
        },
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.JOINING}`,
        pathMatch: 'full',

      }
    ],
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateDashboardRoutingModule { }
