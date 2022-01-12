import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateDocumentComponent } from './candidate-document/candidate-document.component';
import { CandidateUploadDocumentComponent } from './candidate-document/candidate-upload-document/candidate-upload-document.component';
import { CandidateFaqComponent } from './candidate-faq/candidate-faq.component';
import { JoiningContactComponent } from './candidate-joining-form/joining-contact/joining-contact.component';
import { JoiningDependentComponent } from './candidate-joining-form/joining-dependent/joining-dependent.component';
import { JoiningEducationComponent } from './candidate-joining-form/joining-education/joining-education.component';
import { JoiningFormComponent } from './candidate-joining-form/joining-form/joining-form.component';
import { JoiningPersonalComponent } from './candidate-joining-form/joining-personal/joining-personal.component';
import { JoiningPreviewComponent } from './candidate-joining-form/joining-preview/joining-preview.component';
import { JoiningSubmitComponent } from './candidate-joining-form/joining-submit/joining-submit.component';
import { JoiningUploadComponent } from './candidate-joining-form/joining-upload/joining-upload.component';
import { JoiningWorkDetailsComponent } from './candidate-joining-form/joining-work-details/joining-work-details.component';
import { Routes } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CanloadGuard } from 'src/app/guards/canload/canload.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  {
    path: '',
    children: [
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
    ]
  }
]

@NgModule({
  declarations: [CandidateDocumentComponent, CandidateUploadDocumentComponent, JoiningFormComponent, JoiningPersonalComponent, JoiningContactComponent, JoiningDependentComponent, JoiningEducationComponent, JoiningUploadComponent, JoiningPreviewComponent, JoiningSubmitComponent, JoiningWorkDetailsComponent, CandidateFaqComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ]
})
export class LarsenModuleModule { }
