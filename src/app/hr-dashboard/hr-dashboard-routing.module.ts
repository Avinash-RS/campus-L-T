import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrMasterComponent } from './hr-master.component';
import { CONSTANT } from '../constants/app-constants.service';
import { DashboardComponent } from '../admin-dashboard/dashboard/dashboard.component';
import { AdmincanloadGuard } from '../guards/canload/admincanload.guard';
import { UserManagementComponent } from '../admin-dashboard/user-management/user-management.component';
import { UsersListComponent } from '../admin-dashboard/user-management/users-list/users-list.component';
import { AddUserComponent } from '../admin-dashboard/user-management/add-user/add-user.component';
import { HrMainDashboardComponent } from './hr-main-dashboard/hr-main-dashboard.component';
import { HrShortlistingComponent } from './hr-shortlisting/hr-shortlisting.component';
import { FirstLevelShortlistComponent } from './hr-shortlisting/first-level-shortlist/first-level-shortlist.component';
import { HrcanloadGuard } from '../guards/canload/hrcanload.guard';
import { HrUserManagementComponent } from './hr-user-management/hr-user-management.component';
import { BulkUploadComponent } from './hr-user-management/bulk-upload/bulk-upload.component';
import { ApplyCriteriaComponent } from './hr-shortlisting/first-level-shortlist/apply-criteria/apply-criteria.component';
import { ShortlistedCandidateListComponent } from './hr-shortlisting/first-level-shortlist/shortlisted-candidate-list/shortlisted-candidate-list.component';
import { UploadedListComponent } from './hr-user-management/uploaded-list/uploaded-list.component';


const routes: Routes = [
  {
    path: '', component: HrMasterComponent,
    children: [
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.DASHBOARD}`, component: HrMainDashboardComponent, canActivate: [HrcanloadGuard]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.SHORTLISTING}`, component: HrShortlistingComponent, canActivate: [HrcanloadGuard], children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING}`, component: FirstLevelShortlistComponent, children: [
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_LIST}`, component: ShortlistedCandidateListComponent
              },
              {
                path: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_CRITERIA}`, component: ApplyCriteriaComponent
              },
              {
                path: '',
                redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING_LIST}`,
                pathMatch: 'full',
              }
            ]
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.SECONDSHORTLISTING}`, component: ApplyCriteriaComponent
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.FIRSTSHORTLISTING}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT}`, component: HrUserManagementComponent, children: [
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`, component: UploadedListComponent
          },
          {
            path: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_BULK_UPLOAD}`, component: BulkUploadComponent
          },
          {
            path: '',
            redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST}`,
            pathMatch: 'full',
          }
        ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.HR_DASHBOARD.DASHBOARD}`,
        pathMatch: 'full',

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrDashboardRoutingModule { }
