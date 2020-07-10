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
          breadcrumb: 'Users'
        } ,
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
            path: '',
            redirectTo: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST}`,
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
