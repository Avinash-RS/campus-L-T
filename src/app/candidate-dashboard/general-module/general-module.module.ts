import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralMasterComponent } from './general-master/general-master.component';
import { GeneralJoiningFormComponent } from './general-candidate-joining-form/general-joining-form/joining-form.component';
import { GeneralJoiningPersonalComponent } from './general-candidate-joining-form/general-joining-personal/joining-personal.component';
import { GeneralJoiningContactComponent } from './general-candidate-joining-form/general-joining-contact/joining-contact.component';
import { GeneralJoiningDependentComponent } from './general-candidate-joining-form/general-joining-dependent/joining-dependent.component';
import { GeneralJoiningEducationComponent } from './general-candidate-joining-form/general-joining-education/joining-education.component';
import { GeneralJoiningWorkDetailsComponent } from './general-candidate-joining-form/general-joining-work-details/joining-work-details.component';
import { GeneralJoiningUploadComponent } from './general-candidate-joining-form/general-joining-upload/joining-upload.component';
import { GeneralJoiningPreviewComponent } from './general-candidate-joining-form/general-joining-preview/joining-preview.component';
import { GeneralJoiningSubmitComponent } from './general-candidate-joining-form/general-joining-submit/joining-submit.component';
import { GeneralCandidateDocumentComponent } from './general-candidate-document/candidate-document.component';
import { GeneralCandidateUploadDocumentComponent } from './general-candidate-document/general-candidate-upload-document/candidate-upload-document.component';
import { GeneralCandidateFaqComponent } from './general-candidate-faq/candidate-faq.component';
import { GeneralProfileGuard } from 'src/app/guards/canload/candidate_components_authguards/general-profile.guard';
import { GeneralProfileComponentGuard } from 'src/app/guards/canload/candidate_components_authguards/general-profile-component.guard';
import { HelperModule } from '../helper/helper/helper.module';


const routes: Routes = [
  {
    path: '',
    component: GeneralMasterComponent, canActivate: [GeneralProfileGuard],
    children: [
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING}`,
        component: GeneralJoiningFormComponent, canActivate: [GeneralProfileGuard],
        data: {
          breadcrumb: 'Joining Form'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL}`,
            component: GeneralJoiningPersonalComponent, canActivate: [GeneralProfileComponentGuard],
            data: {
              breadcrumb: 'Personal Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_CONTACT}`,
            component: GeneralJoiningContactComponent, canActivate: [GeneralProfileComponentGuard],
            data: {
              breadcrumb: 'Contact Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_DEPENDENT}`,
            component: GeneralJoiningDependentComponent, canActivate: [GeneralProfileComponentGuard],
            data: {
              breadcrumb: 'Dependent Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_EDUCATION}`,
            component: GeneralJoiningEducationComponent, canActivate: [GeneralProfileComponentGuard],
            data: {
              breadcrumb: 'Education Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_WORK}`,
            component: GeneralJoiningWorkDetailsComponent, canActivate: [GeneralProfileComponentGuard],
            data: {
              breadcrumb: 'Work Experience Details'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_UPLOAD}`,
            component: GeneralJoiningUploadComponent, canActivate: [GeneralProfileComponentGuard],
            data: {
              breadcrumb: 'Upload Documents'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_PREVIEW}`,
            component: GeneralJoiningPreviewComponent,
            data: {
              breadcrumb: 'Preview'
            }
          },
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_SUBMIT}`,
            component: GeneralJoiningSubmitComponent,
            data: {
              breadcrumb: 'Submit'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_PERSONAL}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_DOCUMENT}`,
        component: GeneralCandidateDocumentComponent, canActivate: [GeneralProfileGuard],
        data: {
          breadcrumb: 'Upload Documents'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_DOCUMENT_LIST}`,
            component: GeneralCandidateUploadDocumentComponent,
            data: {
              breadcrumb: ''
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_DOCUMENT_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING_FAQ}`,
        component: GeneralCandidateFaqComponent, canActivate: [GeneralProfileGuard],
        data: {
          breadcrumb: 'FAQ'
        },
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_JOINING}`,
        pathMatch: 'full',
      }
    ]
  }
]

@NgModule({
  declarations: [GeneralCandidateDocumentComponent, GeneralCandidateUploadDocumentComponent, GeneralJoiningFormComponent, GeneralJoiningPersonalComponent, GeneralJoiningContactComponent, GeneralJoiningDependentComponent, GeneralJoiningEducationComponent, GeneralJoiningUploadComponent, GeneralJoiningPreviewComponent, GeneralJoiningSubmitComponent, GeneralJoiningWorkDetailsComponent, GeneralCandidateFaqComponent, GeneralMasterComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    SharedModule,
    HelperModule
  ]
})
export class GeneralModuleModule { }
