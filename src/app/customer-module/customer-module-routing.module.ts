import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANT } from '../constants/app-constants.service';
import { MultiCustomerLandingComponent } from './pages/multi-customer-landing/multi-customer-landing.component';
import { CandidateLandingPageComponent } from './pages/candidate-landing-page/candidate-landing-page.component';
import { CandidateBookSlotComponent } from './pages/candidate-book-slot/candidate-book-slot.component';
import { ModuleMasterComponent } from './pages/module-master/module-master.component';

const routes: Routes = [
  {
    path: ``,
    component: ModuleMasterComponent,
    children: [
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
        path: `${CONSTANT.ROUTES.CUSTOMERS.CANDIDATE_DASHBOARD_BOOK_SLOT}`, component: CandidateBookSlotComponent,
        data: {
          breadcrumb: 'Slot Booking'
        }
      },
      {
        path: '',
        redirectTo: `${CONSTANT.ROUTES.CUSTOMERS.LANDING}`,
        pathMatch: 'full',
      }    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerModuleRoutingModule { }
