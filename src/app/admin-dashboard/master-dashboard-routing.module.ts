import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterDashboardComponent } from './master-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CONSTANT } from '../constants/app-constants.service';
import { UserManagementComponent } from './user-management/user-management.component';
import { UsersListComponent } from './user-management/users-list/users-list.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { CanloadGuard } from '../guards/canload/canload.guard';
import { AdmincanloadGuard } from '../guards/canload/admincanload.guard';
import { AdminBulkUploadInstitutesComponent } from './user-management/admin-bulk-upload-institutes/admin-bulk-upload-institutes.component';
import { AdminUploadedInstituteListComponent } from './user-management/admin-bulk-upload-institutes/admin-uploaded-institute-list/admin-uploaded-institute-list.component';
import { AdminBulkUploadInstituteComponent } from './user-management/admin-bulk-upload-institutes/admin-bulk-upload-institute/admin-bulk-upload-institute.component';
import { AdminBulkUploadCandidatesComponent } from './user-management/admin-bulk-upload-candidates/admin-bulk-upload-candidates.component';
import { AdminUploadedCandidateListComponent } from './user-management/admin-bulk-upload-candidates/admin-uploaded-candidate-list/admin-uploaded-candidate-list.component';
import { AdminBulkUploadCandidateCompComponent } from './user-management/admin-bulk-upload-candidates/admin-bulk-upload-candidate-comp/admin-bulk-upload-candidate-comp.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { InstituteApprovalsComponent } from './approvals/institute-approvals/institute-approvals.component';
import { AdminReportComponent } from './admin-report/admin-report.component';
import { AdminReportListComponent } from './admin-report/admin-report-list/admin-report-list.component';
import { AdminBulkUploadReportComponent } from './admin-report/admin-bulk-upload-report/admin-bulk-upload-report.component';
import { AdminInstitudeBulkUploadComponent } from './admin-report/admin-institude-bulk-upload/admin-institude-bulk-upload.component';


const routes: Routes = [
  {
    path: '',
    component: MasterDashboardComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.DASHBOARD}`,
        component: DashboardComponent, canActivate: [AdmincanloadGuard],
        data: {
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT}`,
        component: UserManagementComponent,
        data: {
          breadcrumb: 'User Management'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST}`,
            component: UsersListComponent,
            data: {
              breadcrumb: 'UserList'
            }
          },
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_ADD_USER}`,
            component: AddUserComponent,
            data: {
              breadcrumb: 'AddUser'
            }
          },
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_EDIT_USER}/:eid`,
            component: AddUserComponent
          },
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADS}`, component: AdminBulkUploadCandidatesComponent, data: {
              breadcrumb: 'Candidate'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADED_LIST}`, component: AdminUploadedCandidateListComponent, data: {
                  breadcrumb: 'uploaded-list'
                }
              },
              {
                path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_CANDIDATE_BULK_UPLOAD}`, component: AdminBulkUploadCandidateCompComponent,
                data: {
                  breadcrumb: 'bulk-upload'
                }
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_CANDIDATE_UPLOADED_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_INSTITUTE_UPLOADS}`, component: AdminBulkUploadInstitutesComponent,
            data: {
              breadcrumb: 'Institutes'
            },
            children: [
              {
                path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_INSTITUTE_UPLOADED_LIST}`, component: AdminUploadedInstituteListComponent,
                data: {
                  breadcrumb: 'uploaded-list'
                }
              },
              {
                path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_INSTITUTE_BULK_UPLOAD}`, component: AdminBulkUploadInstituteComponent,
                data: {
                  breadcrumb: 'bulk-upload'
                }
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_INSTITUTE_UPLOADED_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.APPROVALS}`,
        component: ApprovalsComponent,
        data: {
          breadcrumb: 'Approvals'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.APPROVALS_INSTITUTE}`,
            component: InstituteApprovalsComponent,
            data: {
              breadcrumb: 'Institute Approval'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.APPROVALS_INSTITUTE}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.ADMIN_REPORTS}`,
        component: AdminReportComponent,
        data: {
          breadcrumb: 'reports'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.ADMIN_REPORTS_LIST}`,
            component: AdminReportListComponent,
            data: {
              breadcrumb: 'reports-list'
            }
          },
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.ADMIN_BULK_CANDIDATE_UPLOAD_REPORTS_LIST}`,
            component: AdminBulkUploadReportComponent,
            data: {
              breadcrumb: 'Candidate Reports List'
            }
          },
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.ADMIN_BULK_INSTITUTE_UPLOAD_REPORTS_LIST}`,
            component: AdminInstitudeBulkUploadComponent,
            data: {
              breadcrumb: 'Institute Reports List'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.ADMIN_REPORTS_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.DASHBOARD}`,
        pathMatch: 'full',

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDashboardRoutingModule { }
