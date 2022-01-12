import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdaniJoiningContactComponent } from './adani-profile/joining-contact/joining-contact.component';
import { AdaniJoiningDependentComponent } from './adani-profile/joining-dependent/joining-dependent.component';
import { AdaniJoiningEducationComponent } from './adani-profile/joining-education/joining-education.component';
import { AdaniJoiningFormComponent } from './adani-profile/joining-form/joining-form.component';
import { AdaniJoiningPersonalComponent } from './adani-profile/joining-personal/joining-personal.component';
import { AdaniJoiningPreviewComponent } from './adani-profile/joining-preview/joining-preview.component';
import { AdaniJoiningSubmitComponent } from './adani-profile/joining-submit/joining-submit.component';
import { AdaniJoiningUploadComponent } from './adani-profile/joining-upload/joining-upload.component';
import { AdaniJoiningWorkDetailsComponent } from './adani-profile/joining-work-details/joining-work-details.component';
import { AdaniCandidateUploadDocumentComponent } from './candidate-document/candidate-upload-document/candidate-upload-document.component';
import { AdaniCandidateDocumentComponent } from './candidate-document/candidate-document.component';
import { AdaniCandidateFaqComponent } from './candidate-faq/candidate-faq.component';
import { AdaniJoinInterviewComponent } from './join-interview/join-interview.component';
import { CanloadGuard } from 'src/app/guards/canload/canload.guard';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';


const routes: Routes = [
  { 
    path: '', 
    children: [
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING}`,
        component: AdaniJoiningFormComponent, canActivate: [CanloadGuard],
        data: {
          breadcrumb: 'Joining Form'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_PERSONAL}`,
            component: AdaniJoiningPersonalComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Personal Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_CONTACT}`,
            component: AdaniJoiningContactComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Contact Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_DEPENDENT}`,
            component: AdaniJoiningDependentComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Dependent Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_EDUCATION}`,
            component: AdaniJoiningEducationComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Education Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_WORK}`,
            component: AdaniJoiningWorkDetailsComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Work Experience Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_UPLOAD}`,
            component: AdaniJoiningUploadComponent, canActivate: [AuthGuard],
            data: {
              breadcrumb: 'Upload Documents'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_PREVIEW}`,
            component: AdaniJoiningPreviewComponent,
            data: {
              breadcrumb: 'Preview'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_SUBMIT}`,
            component: AdaniJoiningSubmitComponent,
            data: {
              breadcrumb: 'Submit'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_PERSONAL}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_DOCUMENT}`,
        component: AdaniCandidateDocumentComponent, canActivate: [CanloadGuard],
        data: {
          breadcrumb: 'Upload Documents'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_DOCUMENT_LIST}`,
            component: AdaniCandidateUploadDocumentComponent,
            data: {
              breadcrumb: ''
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_DOCUMENT_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING_FAQ}`,
        component: AdaniCandidateFaqComponent, canActivate: [CanloadGuard],
        data: {
          breadcrumb: 'FAQ'
        },
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.ADANI_JOINING}`,
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  declarations: [AdaniCandidateDocumentComponent, AdaniCandidateUploadDocumentComponent,AdaniJoinInterviewComponent, AdaniCandidateFaqComponent,AdaniJoiningContactComponent,AdaniJoiningDependentComponent,AdaniJoiningEducationComponent,AdaniJoiningFormComponent,AdaniJoiningPersonalComponent,AdaniJoiningPreviewComponent,AdaniJoiningSubmitComponent,AdaniJoiningUploadComponent,AdaniJoiningWorkDetailsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ]
})
export class AdaniModuleModule { }
