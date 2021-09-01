import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TpoMasterComponent } from './tpo-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { TpoUserManagementComponent } from './tpo-user-management/tpo-user-management.component';
import { TpoCandidatesStatusComponent } from './tpo-candidates-status/tpo-candidates-status.component';
import { TpoPreAssessmentComponent } from './tpo-candidates-status/tpo-pre-assessment/tpo-pre-assessment.component';
import { TpoRecruitmentComponent } from './tpo-candidates-status/tpo-recruitment/tpo-recruitment.component';
import { TpocanloadGuard } from '../guards/canload/tpocanload.guard';
import { TpoReportsComponent } from './tpo-reports/tpo-reports.component';
import { TpoBulkUploadReportsComponent } from './tpo-reports/tpo-bulk-upload-reports/tpo-bulk-upload-reports.component';
import { UserListComponent } from './tpo-user-management/user-list/user-list.component';
import { BulkUploadsComponent } from './tpo-user-management/bulk-uploads/bulk-uploads.component';


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
        component: TpoUserManagementComponent, canActivate: [TpocanloadGuard],
        data: {
          breadcrumb: 'User Management'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_USERS_LIST}`,
            component: UserListComponent,
            data: {
              breadcrumb: 'User Groups'
            }
          },
          {
            path: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD}`,
            component: BulkUploadsComponent,
            data: {
              breadcrumb: 'Bulk Uploads'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.USER_MANAGEMENT_USERS_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.TPO_DASHBOARD.STATUS}`,
        component: TpoCandidatesStatusComponent, canActivate: [TpocanloadGuard],
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
            redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.STATUS_RECRUITMENT}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.TPO_DASHBOARD.TPO_REPORTS}`,
        component: TpoReportsComponent, canActivate: [TpocanloadGuard],
        data: {
          breadcrumb: 'Reports'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.TPO_DASHBOARD.TPO_BULK_CANDIDATE_UPLOAD_REPORTS_LIST}`,
            component: TpoBulkUploadReportsComponent,
            data: {
              breadcrumb: 'Candidate Bulk Upload Reports'
            },
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.TPO_DASHBOARD.TPO_BULK_CANDIDATE_UPLOAD_REPORTS_LIST}`,
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
