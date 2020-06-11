import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from '../app/constants/app-constants.service';
import { AuthGuard } from './guards/auth.guard';
import { CanloadGuard } from './guards/canload/canload.guard';
import { AdmincanloadGuard } from './guards/canload/admincanload.guard';
import { IsLoggedinGuard } from './guards/canload/is-loggedin.guard';

const routes: Routes = [
  {
    path: '', loadChildren: './login/login.module#LoginModule', canActivate: [IsLoggedinGuard]
  },
  {
    path: `${CONSTANT.ROUTES.ADMIN_DASHBOARD.HOME}`, loadChildren: './admin-dashboard/master-dashboard.module#MasterDashboardModule', canLoad: [ AdmincanloadGuard ]
  },
  {
    path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.HOME}`, loadChildren: './candidate-dashboard/candidate-dashboard.module#CandidateDashboardModule', canLoad: [ CanloadGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
