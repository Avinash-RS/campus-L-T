import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';
import { CONSTANT } from '../constants/app-constants.service';
import { CandidateMappersService } from '../services/candidate-mappers.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // For KYC submission page
  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isEditAllowed = this.appConfig.getLocalData('isEditAllowed');
      let isJoiningForm = this.appConfig.getLocalData('joiningFormAccess');

      if (isJoiningForm == 'true' && this.candidateService.getLocalsection_flags() && this.candidateService.getLocalsection_flags().submitted != '1') {
        return true;
      }
      if (isEditAllowed == 'true' && isJoiningForm != 'true') {
        return true;
      }
      return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_PREVIEW);
  }


}
