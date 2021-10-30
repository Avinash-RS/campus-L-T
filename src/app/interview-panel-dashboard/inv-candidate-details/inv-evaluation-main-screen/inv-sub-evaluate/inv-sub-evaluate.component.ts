import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

export interface PeriodicElement {
  id: number;
  name: string;
  level: number;
  veryGood: string;
  good: string;
  average: string;
  notSuitable: string;
}

@Component({
  selector: 'app-inv-sub-evaluate',
  templateUrl: './inv-sub-evaluate.component.html',
  styleUrls: ['./inv-sub-evaluate.component.scss'],
  providers: [
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: { useUtc: true }
    },
  ],
})
export class InvSubEvaluateComponent implements OnInit, OnChanges {
  @Input() passT0Tabevaluate;
  candidateId: any;
  nameOfAssessment: any;
  uid: any;
  status: any;
  shortlist_name: any;
  formDetails: any;
  formId: any;
  queryParams: any;
  constructor(
    private formBuilder: FormBuilder,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.passT0Tabevaluate) {
      this.editRouteParamGetter();
    }
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.candidateId = params['uid'];
      this.uid = params['uid'];
      this.status = params['status'];
      this.shortlist_name = params['shortlist_name'];
      this.formDetails = this.appConfig.getSelectedDriveFormDetails();
      this.formId = this.formDetails.id ? this.formDetails.id : ''
      this.queryParams = params;
    });
  }

  isAccessGranted() {
    if(this.queryParams && this.queryParams.evaluationShow && this.queryParams.evaluationShow == 'true' && this.appConfig.getSelectedDrivePermissions().normal_assessment) {
      return true;
    } else {
      return false;
    }
  }

}
