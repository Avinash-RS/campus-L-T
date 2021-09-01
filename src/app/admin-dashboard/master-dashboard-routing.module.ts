import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterDashboardComponent } from './master-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CONSTANT } from '../constants/app-constants.service';
import { UserManagementComponent } from './user-management/user-management.component';
import { UsersListComponent } from './user-management/users-list/users-list.component';
import { AdmincanloadGuard } from '../guards/canload/admincanload.guard';
import { ApprovalsComponent } from './approvals/approvals.component';
import { InstituteApprovalsComponent } from './approvals/institute-approvals/institute-approvals.component';
import { AdminReportComponent } from './admin-report/admin-report.component';
import { AdminBulkUploadReportComponent } from './admin-report/admin-bulk-upload-report/admin-bulk-upload-report.component';
import { AdminInstitudeBulkUploadComponent } from './admin-report/admin-institude-bulk-upload/admin-institude-bulk-upload.component';
import { BulkUploadsComponent } from './user-management/bulk-uploads/bulk-uploads.component';


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
              breadcrumb: 'User Groups'
            }
          },
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD}`,
            component: BulkUploadsComponent,
            data: {
              breadcrumb: 'Bulk Uploads'
            }
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
              breadcrumb: 'Institute'
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
          breadcrumb: 'Reports'
        },
        children: [
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.ADMIN_BULK_CANDIDATE_UPLOAD_REPORTS_LIST}`,
            component: AdminBulkUploadReportComponent,
            data: {
              breadcrumb: 'Candidate Bulk Upload Reports'
            }
          },
          {
            path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.ADMIN_BULK_INSTITUTE_UPLOAD_REPORTS_LIST}`,
            component: AdminInstitudeBulkUploadComponent,
            data: {
              breadcrumb: 'Institute Bulk Upload Reports'
            }
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.ADMIN_BULK_CANDIDATE_UPLOAD_REPORTS_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT}`,
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
