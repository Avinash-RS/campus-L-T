import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-joining-preview',
  templateUrl: './joining-preview.component.html',
  styleUrls: ['./joining-preview.component.scss']
})
export class JoiningPreviewComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private glovbal_validators: GlobalValidatorService
  ) { 
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.sharedService.joiningFormActiveSelector.next('preview');
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  routeNext() {
    // if (!this.personalForm.dirty) {
      // if(this.appConfig.getLocalData('preview') == '1') {
        return this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_UPLOAD);
      // }
      // } else {
      //   if(this.personalForm.valid) {
      //     return this.sharedService.openJoiningRoutePopUp.next(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.JOINING_CONTACT);
      //   }
      //   this.glovbal_validators.validateAllFields(this.personalForm);
      //   this.ngAfterViewInit();
      //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');    
      // }
    // } else {
    //   this.glovbal_validators.validateAllFields(this.personalForm);
    //   this.ngAfterViewInit();
    //   this.appConfig.nzNotification('error', 'Not Saved', 'Please fill all the red highlighted fields to proceed further');
    //   }
    }


  ngOnDestroy() {

  }
}
