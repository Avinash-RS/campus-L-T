import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';

@Component({
  selector: 'app-inv-sub-assessments',
  templateUrl: './inv-sub-assessments.component.html',
  styleUrls: ['./inv-sub-assessments.component.scss']
})
export class InvSubAssessmentsComponent implements OnInit, OnChanges {
  @Input() passT0TabVideoScheduling;
  candidateId: any;
  nameOfAssessment: any;
  uid: any;
  status: any;
  shortlist_name: any;
  formDetails: any;
  formId: any;
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
    if (this.passT0TabVideoScheduling) {
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
    });
  }

}

