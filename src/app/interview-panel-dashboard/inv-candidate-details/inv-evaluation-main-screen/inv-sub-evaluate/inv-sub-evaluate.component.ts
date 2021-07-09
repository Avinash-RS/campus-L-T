import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import SampleJson from '../../../../../assets/files/evaluationData.json';
import * as myGlobals from '../../../../custom-form-validators/validation';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service.js';
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
export class InvSubEvaluateComponent implements OnInit {
  candidateId: any;
  nameOfAssessment: any;
  uid: any;
  BIS = this.appConfig.getLocalData('BIS');
  constructor(
    private formBuilder: FormBuilder,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Assigned Candidates',
        router: CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST,
        data: `${this.activatedRoute.queryParams['_value']['data']}`,
        active: true
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.candidateId = params['uid'];
      this.uid = params['uid'];
    });
  }

}
