
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import SampleJson from '../../../../../../assets/files/adani_evaluation_form.json';
import { FormControl, FormGroup, FormBuilder, NgModel, Validators, FormArray } from '@angular/forms';
import * as myGlobals from '../../../../../custom-form-validators/validation';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace.js';
import { ApiServiceService } from 'src/app/services/api-service.service.js';
import { SharedServiceService } from 'src/app/services/shared-service.service.js';
import { ActivatedRoute } from '@angular/router';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';



@Component({
  selector: 'app-hr-sub-interview-results',
  templateUrl: './hr-sub-interview-results.component.html',
  styleUrls: ['./hr-sub-interview-results.component.scss'],
  providers: [
    // {
    //   provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    //   useValue: { useUtc: true }
    // },
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: myGlobals.MY_FORMATS },
  ]
})

export class HrSubInterviewResultsComponent implements OnInit {
  @Input() candidateId;
  @Input() nameOfAssessment;
  @Input() uid;
  @Input() status;
  @Input() shortlist_name;
  customerCode = this.appConfig.getSelectedCustomerCode();
  constructor(
    private appConfig: AppConfigService
    ) {
    
  }

  ngOnInit() {
  }
  }
