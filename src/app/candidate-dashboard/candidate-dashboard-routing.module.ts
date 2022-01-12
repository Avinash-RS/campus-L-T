import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterDashboardComponent } from './master-dashboard.component';
import { CONSTANT } from '../constants/app-constants.service';
import { AdaniGuard } from '../guards/canload/candidate_components_authguards/adani.guard';
import { LarsenGuard } from '../guards/canload/candidate_components_authguards/larsen.guard';
import { LarsenComponentsAuthGuard } from '../guards/canload/candidate_components_authguards/larsen_components_auth.guard';

const routes: Routes = [
  {
    path: '', component: MasterDashboardComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.CANDIDATE_LARSEN}`, loadChildren: './larsen-module/larsen-module.module#LarsenModuleModule', canLoad: [ LarsenGuard ], canActivate: [ LarsenGuard ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.CANDIDATE_ADANI}`, loadChildren: './adani-module/adani-module.module#AdaniModuleModule', canLoad: [ AdaniGuard ], canActivate: [ AdaniGuard ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.CUSTOMERS.CANDIDATE_DASHBOARD}`,
        pathMatch: 'full',
      }
    ],    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateDashboardRoutingModule { }
