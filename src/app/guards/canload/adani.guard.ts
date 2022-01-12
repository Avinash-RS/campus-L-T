import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AppConfigService } from '../../config/app-config.service';
import { CONSTANT } from '../../constants/app-constants.service';

@Injectable()
export class AdaniGuard implements CanActivate {
  // For KYC submission page
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService
  ) {

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') == 'candidate') {
      if (this.appConfig.getSelectedCustomerCode() == '#Adani') {
        return true;
      }else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CUSTOMERS.CANDIDATE_DASHBOARD);
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
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('roles') == 'candidate') {
      if (this.appConfig.getSelectedCustomerCode() == '#Adani') {
        return true;
      }else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CUSTOMERS.CANDIDATE_DASHBOARD);
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
