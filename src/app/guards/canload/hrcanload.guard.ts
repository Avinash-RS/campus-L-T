import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Injectable()
export class HrcanloadGuard implements CanLoad {
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService
  ) {

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('multiCustomer') == 'true' && !this.appConfig.getLocalData('selected_customer')) {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CUSTOMERS.LANDING);
      return false;
    }
    if ((this.appConfig.getLocalData('csrf-login') && (this.appConfig.getLocalData('roles') == 'hr' || this.appConfig.getLocalData('roles') == 'ic' || this.appConfig.getLocalData('roles') == 'ssc_hr'))) {
    return true;
    }
    else {
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
    if (this.appConfig.getLocalData('csrf-login') && this.appConfig.getLocalData('multiCustomer') == 'true' && !this.appConfig.getLocalData('selected_customer')) {
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CUSTOMERS.LANDING);
      return false;
    }
    if ((this.appConfig.getLocalData('csrf-login') && (this.appConfig.getLocalData('roles') == 'hr' || this.appConfig.getLocalData('roles') == 'ic' || this.appConfig.getLocalData('roles') == 'ssc_hr'))) {
      return true;
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
