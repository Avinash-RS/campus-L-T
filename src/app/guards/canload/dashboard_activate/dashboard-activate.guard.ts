import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardActivateGuard implements CanActivate {
  constructor(
    private appConfig: AppConfigService,
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.appConfig.getSelectedCustomerCode() == '#LTTS') {
        if (this.appConfig.getLocalData('roles') == 'hr') {
          return true;
        }
        return false;
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.USER_MANAGEMENT);
        return false;
      }
  }

}
