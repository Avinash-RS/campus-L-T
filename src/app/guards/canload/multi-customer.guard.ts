import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Injectable({
  providedIn: 'root'
})
export class MultiCustomerGuard implements CanLoad {
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService
  ) {

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') && !this.appConfig.getLocalData('selected_customer')) {
      return true;
    }
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') == 'candidate') {
      return true;
    }
    else {
     if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles')) {
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') == 'institute') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.TPO_DASHBOARD.HOME);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'administrator') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.HOME);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'hr') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HOME);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'ic') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.BUSINESSROUTE);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'ssc_hr') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.BUSINESSROUTE);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'interview_panel') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.HOME);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'candidate') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING);
        return false;
      }
     } else {
      if (this.appConfig.getLocalData('logout-token')) {
        this.apiService.logout(this.appConfig.getLocalData('logout-token')).subscribe((data: any) => {
          this.appConfig.clearLocalData();

          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
          return false;
        }, (err) => {
          this.appConfig.clearLocalData();

          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
          return false;
        });
      } else {
        this.appConfig.clearLocalData();
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
        return false;
      }
     }

    }
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') && !this.appConfig.getLocalData('selected_customer')) {
      return true;
    }
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') == 'candidate') {
      return true;
    }
    else {
     if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles')) {
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') == 'institute') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.TPO_DASHBOARD.HOME);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'administrator') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.HOME);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'hr') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HOME);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'ic') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.BUSINESSROUTE);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'ssc_hr') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.BUSINESSROUTE);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'interview_panel') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.HOME);
        return false;
      }
      if (this.appConfig.getLocalData('roles') && this.appConfig.getLocalData('roles') === 'candidate') {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING);
        return false;
      }
     } else {
      if (this.appConfig.getLocalData('logout-token')) {
        this.apiService.logout(this.appConfig.getLocalData('logout-token')).subscribe((data: any) => {
          this.appConfig.clearLocalData();

          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
          return false;
        }, (err) => {
          this.appConfig.clearLocalData();

          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
          return false;
        });
      } else {
        this.appConfig.clearLocalData();
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
        return false;
      }
     }

    }
  }
}
