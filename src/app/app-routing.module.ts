import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from '../app/constants/app-constants.service';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '', loadChildren: './login/login.module#LoginModule'
  },
  {
    path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.HOME}`, loadChildren: './admin-dashboard/master-dashboard.module#MasterDashboardModule', canActivate: [AuthGuard]
  },
  {
    path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.HOME}`, loadChildren: './candidate-dashboard/candidate-dashboard.module#CandidateDashboardModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
