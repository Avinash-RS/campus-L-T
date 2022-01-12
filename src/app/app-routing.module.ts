import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from '../app/constants/app-constants.service';
import { AdmincanloadGuard } from './guards/canload/admincanload.guard';
import { IsLoggedinGuard } from './guards/canload/is-loggedin.guard';
import { HrcanloadGuard } from './guards/canload/hrcanload.guard';
import { TpocanloadGuard } from './guards/canload/tpocanload.guard';
import { InvpanelGuard } from './guards/canload/invpanel.guard';
import { PageNotFoundComponent } from './unauthenticated-routes/page-not-found/page-not-found.component';
import { MultiCustomerGuard } from './guards/canload/multi-customer.guard';
import { CandidateCanloadGuard } from './guards/canload/candidate_canload.guard';

const routes: Routes = [
  {
    path: '', loadChildren: './login/login.module#LoginModule', canActivate: [IsLoggedinGuard]
  },
  {
    path: `${CONSTANT.ROUTES.CUSTOMERS.HOME}`, loadChildren: './customer-module/customer-module.module#CustomerModuleModule', canLoad: [ MultiCustomerGuard ], canActivate: [ MultiCustomerGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.HOME}`, loadChildren: './admin-dashboard/master-dashboard.module#MasterDashboardModule', canLoad: [ AdmincanloadGuard ], canActivate: [ AdmincanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.HOME}`, loadChildren: './candidate-dashboard/candidate-dashboard.module#CandidateDashboardModule', canLoad: [ CandidateCanloadGuard ], canActivate: [ CandidateCanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.HR_DASHBOARD.HOME}`, loadChildren: './hr-dashboard/hr-dashboard.module#HrDashboardModule', canLoad: [ HrcanloadGuard ], canActivate: [ HrcanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.TPO_DASHBOARD.HOME}`, loadChildren: './tpo-dashboard/tpo-dashboard.module#TpoDashboardModule', canLoad: [ TpocanloadGuard ], canActivate: [ TpocanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.HOME}`, loadChildren: './interview-panel-dashboard/interview-panel-dashboard.module#InterviewPanelDashboardModule', canLoad: [ InvpanelGuard ], canActivate: [ InvpanelGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.UNAUTHENTICATED.HOME}`, loadChildren: './unauthenticated-routes/unauthenticated.module#UnauthenticatedModule'
  },
  // {
  //   path: `**`,
  //   pathMatch: 'full',
  //   component: PageNotFoundComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
