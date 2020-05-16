import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterDashboardComponent } from './master-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CONSTANT } from '../constants/app-constants.service';


const routes: Routes = [
  {
    path: '', component: MasterDashboardComponent,
    children: [
      {
        path: `${CONSTANT.ROUTES.DASHBOARD.HOME}`, component: DashboardComponent
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.DASHBOARD.HOME}`,
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
