import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterDashboardComponent } from './master-dashboard.component';
import { CONSTANT } from '../constants/app-constants.service';
import { AdaniGuard } from '../guards/canload/candidate_components_authguards/adani.guard';
import { LarsenGuard } from '../guards/canload/candidate_components_authguards/larsen.guard';
import { GeneralProfileGuard } from '../guards/canload/candidate_components_authguards/general-profile.guard';

const routes: Routes = [
  {
    path: '', component: MasterDashboardComponent,
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.CANDIDATE_LARSEN}`, loadChildren: () => import('./larsen-module/larsen-module.module').then(m => m.LarsenModuleModule), canLoad: [ LarsenGuard ], canActivate: [ LarsenGuard ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.CANDIDATE_ADANI}`, loadChildren: () => import('./adani-module/adani-module.module').then(m => m.AdaniModuleModule), canLoad: [ AdaniGuard ], canActivate: [ AdaniGuard ]
      },
      {
        path: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.GENERAL_CANDIDATE}`, loadChildren: () => import('./general-module/general-module.module').then(m => m.GeneralModuleModule), canLoad: [ GeneralProfileGuard ], canActivate: [ GeneralProfileGuard ]
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.CANDIDATE_DASHBOARD.CANDIDATE_ADANI}`,
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
