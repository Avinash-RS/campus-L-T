import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerModuleRoutingModule } from './customer-module-routing.module';
import { MultiCustomerLandingComponent } from './pages/multi-customer-landing/multi-customer-landing.component';
import { CustomerLandingHeaderComponent } from './pages/customer-landing-header/customer-landing-header.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [MultiCustomerLandingComponent, CustomerLandingHeaderComponent],
  imports: [
    CommonModule,
    CustomerModuleRoutingModule,
    MaterialModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CustomerModuleModule { }
