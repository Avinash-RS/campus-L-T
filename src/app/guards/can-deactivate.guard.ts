import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from './component-canDeactivate/component-canDeactivate';
import { AppConfigService } from '../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(
    private appConfig: AppConfigService
  ) {

  }
  canDeactivate(
    component: ComponentCanDeactivate,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (component['languagesForm'].status !== 'INVALID') {
      return true;
    } else {
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      if (confirm('If you leave without submitting, your changes will be lost.')) {
        return true;
      } else {
        return false;
      }
    }
  }
}
