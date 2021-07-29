import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from '../app/constants/app-constants.service';
import { AuthGuard } from './guards/auth.guard';
import { CanloadGuard } from './guards/canload/canload.guard';
import { AdmincanloadGuard } from './guards/canload/admincanload.guard';
import { IsLoggedinGuard } from './guards/canload/is-loggedin.guard';
import { HrcanloadGuard } from './guards/canload/hrcanload.guard';
import { TpocanloadGuard } from './guards/canload/tpocanload.guard';
import { InvpanelGuard } from './guards/canload/invpanel.guard';

const routes: Routes = [
  {
    path: '', loadChildren: './login/login.module#LoginModule', canActivate: [IsLoggedinGuard]
  },
  {
    path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.HOME}`, loadChildren: './admin-dashboard/master-dashboard.module#MasterDashboardModule', canLoad: [ AdmincanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.HOME}`, loadChildren: './candidate-dashboard/candidate-dashboard.module#CandidateDashboardModule', canLoad: [ CanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.HR_DASHBOARD.HOME}`, loadChildren: './hr-dashboard/hr-dashboard.module#HrDashboardModule', canLoad: [ HrcanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.TPO_DASHBOARD.HOME}`, loadChildren: './tpo-dashboard/tpo-dashboard.module#TpoDashboardModule', canLoad: [ TpocanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.INTERVIEW_PANEL_DASHBOARD.HOME}`, loadChildren: './interview-panel-dashboard/interview-panel-dashboard.module#InterviewPanelDashboardModule', canLoad: [ InvpanelGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, scrollOffset: [0, 0], scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
