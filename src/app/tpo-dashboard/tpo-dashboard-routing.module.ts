import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TpoMasterComponent } from './tpo-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { TpoUserManagementComponent } from './tpo-user-management/tpo-user-management.component';
import { CandidateUploadsComponent } from './tpo-user-management/candidate-uploads/candidate-uploads.component';
import { UploadedListComponent } from './tpo-user-management/candidate-uploads/uploaded-list/uploaded-list.component';
import { BulkUploadComponent } from './tpo-user-management/candidate-uploads/bulk-upload/bulk-upload.component';
import { TpoAddCandidateComponent } from './tpo-user-management/tpo-add-candidate/tpo-add-candidate.component';
import { TpoCandidatesStatusComponent } from './tpo-candidates-status/tpo-candidates-status.component';
import { TpoPreAssessmentComponent } from './tpo-candidates-status/tpo-pre-assessment/tpo-pre-assessment.component';
import { TpoRecruitmentComponent } from './tpo-candidates-status/tpo-recruitment/tpo-recruitment.component';
import { TpocanloadGuard } from '../guards/canload/tpocanload.guard';


const routes: Routes = [
  {
    path: '', 
    component: TpoMasterComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT}`, 
        component: TpoUserManagementComponent, 
        data: {
          breadcrumb: 'User Management'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS}`, 
            component: CandidateUploadsComponent,
            data: {
              breadcrumb: 'Candidate'
            }, 
            children: [
              {
                path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`, 
                component: UploadedListComponent,
                data: {
                  breadcrumb: 'Uploaded List'
                }, 
              },
              {
                path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD}`, 
                component: BulkUploadComponent,
                data: {
                  breadcrumb: 'Bulk Upload'
                },
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_ADD_CANDIDATE}`, 
            component: TpoAddCandidateComponent,
            data: {
              breadcrumb: 'AddCandidate'
            },
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.TPO_DASHBOARD.STATUS}`, 
        component: TpoCandidatesStatusComponent, 
        data: {
          breadcrumb: 'Status'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.TPO_DASHBOARD.STATUS_PREASSESSMENT}`, 
            component: TpoPreAssessmentComponent,
            data: {
              breadcrumb: 'PreAssessment'
            },
          },
          {
            path: `${CONSTANT.ROUTES.TPO_DASHBOARD.STATUS_RECRUITMENT}`, 
            component: TpoRecruitmentComponent,
            data: {
              breadcrumb: 'Recruitment'
            },
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.STATUS_PREASSESSMENT}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT}`,
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TpoDashboardRoutingModule { }
