import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-multi-customer-landing',
  templateUrl: './multi-customer-landing.component.html',
  styleUrls: ['./multi-customer-landing.component.scss']
})
export class MultiCustomerLandingComponent implements OnInit {

  customersList: any;
  constructor(
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') == 'candidate') {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CUSTOMERS.CANDIDATE_DASHBOARD);
    }
    this.getCustomers();
  }

  getCustomers() {
    this.customersList = this.appConfig.getCustomerList();
  }

  async setCustomer(i: any) {
    let customersList = this.appConfig.getCustomerList();
    await this.appConfig.setLocalData('selected_customer', customersList && customersList[i] && customersList[i]['customer_code'] ? JSON.stringify(customersList[i]) : null);
    await this.appConfig.getLocalData('roles') === 'candidate' ? this.appConfig.setDriveIdForCandidate(customersList[i]) : this.appConfig.setDriveList();
  }

  redirectTo(i: any) {
    this.setCustomer(i).then((res)=> {
      this.routes();
    }).catch((err)=> {
      this.routes();
    });
  }

  routes() {
    if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') == 'institute') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.TPO_DASHBOARD.HOME);
    }
    if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'administrator') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.HOME);
    }
    if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'hr') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HOME);
    }
    if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'ic') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.BUSINESSROUTE);
    }
    if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'ssc_hr') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.BUSINESSROUTE);
    }
    if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'interview_panel') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.HOME);
    }
    if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'candidate') {
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING);
    } else {
    }
  }
}
