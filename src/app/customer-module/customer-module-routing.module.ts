import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from '../constants/app-constants.service';
import { MultiCustomerLandingComponent } from './pages/multi-customer-landing/multi-customer-landing.component';
import { CandidateLandingPageComponent } from './pages/candidate-landing-page/candidate-landing-page.component';

const routes: Routes = [
  {
    path: `${CONSTANT.ROUTES.CUSTOMERS.LANDING}`,
    component: MultiCustomerLandingComponent,
    data: {
      breadcrumb: 'Customers'
    }
  },
  {
    path: `${CONSTANT.ROUTES.CUSTOMERS.CANDIDATE_DASHBOARD}`, component: CandidateLandingPageComponent,
    data: {
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: '',
    redirectTo: `${CONSTANT.ROUTES.CUSTOMERS.LANDING}`,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerModuleRoutingModule { }
