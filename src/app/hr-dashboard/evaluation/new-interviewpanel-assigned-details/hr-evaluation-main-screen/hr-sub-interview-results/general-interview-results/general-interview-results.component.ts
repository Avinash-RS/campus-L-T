import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import moment from 'moment';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import SampleJson from '../../../../../../../assets/files/adani_evaluation_form.json';
import * as myGlobals from '../../../../../../custom-form-validators/validation';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-general-interview-results',
  templateUrl: './general-interview-results.component.html',
  styleUrls: ['./general-interview-results.component.scss'],
  providers: [
    // {
    //   provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    //   useValue: { useUtc: true }
    // },
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: myGlobals.MY_FORMATS },
  ]

})

export class GeneralInterviewResultsComponent implements OnInit, OnDestroy {
  @Input() candidateId;
  @Input() nameOfAssessment;
  @Input() uid;
  @Input() status;
  @Input() shortlist_name;
  paginationPageSizeHR = 500;
  cacheBlockSizeHR: any = 500;
  gridApiHR: any;
  columnDefsHR = [];
  defaultColDefHR: any
  rowDataHR: any = [];
  searchBoxHR = false;
  filterValueHR: string;
  quickSearchValueHR = '';
  gridColumnApiHR: any;
  userListHR: any;
  public statusBarHR = {
    statusPanels: [
      // { statusPanel: 'agTotalRowCountComponent', align: 'left'},
      { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
      { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
      { statusPanel: 'agAggregationComponent', align: 'right' },
    ],
  };


  assessments: any;
  evaluationForm: FormGroup;
  getCandidateData: any;
  selectionValue = new FormControl(null, [Validators.required]);
  finalHRComments = new FormControl(null, [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(255), myGlobals.alphaNum]);
  selectionValueList = [
    {
      label: 'Selected'
    },
    {
      label: 'Rejected'
    },
    {
      label: 'Reassign'
    }
  ];

  // Constants Start
  technical_knowledge = 'technical_knowledge';
  application_based_understanding = 'application_based_understanding';
  communication = 'communication';
  analytical = 'analytical';
  executive_presence = 'executive_presence';
  potential_for_future_growth = 'potential_for_future_growth';

  // Constants End

  adaform_interview_date = 'interview_date';
  adaform_interview_place = 'interview_place';
  receivedData: any;
  commonEvaluationDetails: any;
  getParticularInterviewpanelistSubscription: Subscription;
  generalCustEvaluationProcessingFeedbacksSubscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private datePipe: DatePipe
  ) {
  }

  get f() {
    return this.evaluationForm.controls;
  }

  ngOnInit() {
    this.defaultColDefHR = this.appConfig.agGridWithAllFunc();
    this.tabledefHR();
    this.assessments = [];
    for (const iterator of SampleJson) {
      this.assessments = [...this.assessments,
      {
        name: iterator.name,
        expoints: iterator.expoints
      }];
    };
    if (this.candidateId) {
      this.getEvaluationData(this.uid);
      this.nginitFunc();
      this.getCandidateDetails();
    }
  }

  selectionListChange() {
    setTimeout(() => {
      let selectedValue = this.selectionValue.value;
    }, 100);
  }

  itemchek(data, index) {
    if (index == 0) {
      return (data[this.technical_knowledge] == 1) ? 'Average' : (data[this.technical_knowledge] == 3) ? 'Good' : (data[this.technical_knowledge] == 5) ? 'Excellent' : '';
    }
    if (index == 1) {
      return (data[this.application_based_understanding] == 1) ? 'Average' : (data[this.application_based_understanding] == 3) ? 'Good' : (data[this.application_based_understanding] == 5) ? 'Excellent' : '';
    }
    if (index == 2) {
      return (data[this.communication] == 1) ? 'Average' : (data[this.communication] == 3) ? 'Good' : (data[this.communication] == 5) ? 'Excellent' : '';
    }
    if (index == 3) {
      return (data[this.analytical] == 1) ? 'Average' : (data[this.analytical] == 3) ? 'Good' : (data[this.analytical] == 5) ? 'Excellent' : '';
    }
    if (index == 4) {
      return (data[this.executive_presence] == 1) ? 'Average' : (data[this.executive_presence] == 3) ? 'Good' : (data[this.executive_presence] == 5) ? 'Excellent' : '';
    }
    if (index == 5) {
      return (data[this.potential_for_future_growth] == 1) ? 'Average' : (data[this.potential_for_future_growth] == 3) ? 'Good' : (data[this.potential_for_future_growth] == 5) ? 'Excellent' : '';
    }

  }
  getCandidateDetails() {
    const apiData = {
      uid: this.uid ? this.uid : '',
      shortlist_name: this.shortlist_name,
      form_type_id: this.appConfig.getSelectedDriveFormDetails().id
    }
    this.adminService.getCandidateInterviewResult(apiData).subscribe((success: any) => {
      const data = success ? success : null;
      if (data) {
        this.receivedData = data?.interviewer_feedbacks;
        this.commonEvaluationDetails = data ? data : '';
        this.evaluationForm.patchValue({
          [this.adaform_interview_date]: data && data[this.adaform_interview_date] ? data[this.adaform_interview_date] : null,
          [this.adaform_interview_place]: data && data[this.adaform_interview_place] ? data[this.adaform_interview_place] : null,
        });
        this.commonEvaluationDetails?.hr_selection_decision ? this.evaluationForm.disable() : '';
        let interviewerIds = this.receivedData.map(data => data?.interviewer_id);
        this.getPanelList(interviewerIds);
      }
    }, (err) => {

    })
  }

  getEvaluationData(cid) {
    const apiData = {
      id: cid
    };
    this.adminService.getEvaluationData(apiData).subscribe((data: any) => {

      this.getCandidateData = data[0];
    });
  }

  nginitFunc() {

    this.evaluationForm = this.formBuilder.group({
      [this.adaform_interview_date]: new FormControl('', [Validators.required]),
      [this.adaform_interview_place]: new FormControl('', [RemoveWhitespace.whitespace(), myGlobals.req, myGlobals.alphaNum30]),
    });
  }


  get interview_date() {
    return this.evaluationForm.get(this.adaform_interview_date);
  }
  get interview_place() {
    return this.evaluationForm.get(this.adaform_interview_place);
  }


  submitEvaluation() {
    if (this.evaluationForm.valid && this.selectionValue.value && this.finalHRComments.value) {
      let apiData: any;
      let data: any;
      apiData = {
        reassign: false,
        uid: this.uid ? this.uid : '',
        shortlist_name: this.shortlist_name,
        form_type_id: this.appConfig.getSelectedDriveFormDetails().id,
        hr_selection_decision: this.selectionValue.value,
        hr_comments: this.finalHRComments.value,
        interview_date: this.datePipe.transform(this.evaluationForm.value[this.adaform_interview_date], 'yyyy-MM-dd'),
        interview_place: this.evaluationForm.value[this.adaform_interview_place]
      };
      if (this.selectionValue.value == 'Reassign') {
        let selectedPanels = this.gridApiHR.getSelectedNodes();
        if (selectedPanels && selectedPanels.length > 0) {
          const panelEmails = selectedPanels.map(element => {
            if (element['data']) {
              return element['data']['email'];
            }
          });
          apiData.reassign = true;
          apiData.emails = panelEmails;
          data = {
            apiData,
            iconName: '',
            dataToBeShared: {
              confirmText: `Are you sure you want to assign these panels?`,
              type: 'assign-hr',
              identity: 'panel-assign'
            },
            showConfirm: 'Confirm',
            interViwePanelAssign: 'assign',
            candidateCount: 1,
            panel: selectedPanels.length,
            candidate: 'Candidate',
            member: selectedPanels.length == 1 ? 'member' : 'members',
            showCancel: 'Cancel',
            showOk: ''
          };
        } else {
          this.appConfig.warning('No Interview Panels were selected');
        }
      } else {
        data = {
          evaluation: 'submit',
          apiData
        };
      }
      this.openDialog(ShortlistBoxComponent, data);
    } else {
      this.validateAllFields(this.evaluationForm);
      this.selectionValue.markAsTouched();
      this.finalHRComments.markAsTouched();
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
    }
  }

  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data.apiData && data.apiData.reassign) {
          delete data.apiData.reassign;
          this.reassignAPI(data.apiData);
        } else {
          delete data.apiData.reassign;
          this.evaluationSubmitApi(data.apiData);
        }
      }
    });
  }

  reassignAPI(data) {
    console.log('reassignAPI', data);
  }

  evaluationSubmitApi(data) {
    this.generalCustEvaluationProcessingFeedbacksSubscription = this.adminService.generalCustEvaluationProcessingFeedbacks(data).subscribe((res: any)=> {
      this.appConfig.success('Evaluation Submitted Successfully');
      const apiData = {
        shortlist_name: this.shortlist_name ? this.shortlist_name : '',
        college_name: '',
        education_level: '',
        status: ''
      };
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED, {data: JSON.stringify(apiData)});
    }, (err)=> {

    });
    console.log('evaluationSubmitApi', data);
  }

  // To get all users
  getPanelList(interviewer_ids) {
    console.log('inter', interviewer_ids);
    const apiData = {
      discipline: '',
      interviewer_ids
    };
    this.getParticularInterviewpanelistSubscription = this.adminService.getInterviewpanelist(apiData).subscribe((data: any) => {

      this.userListHR = data ? data : [];
      let count = 0;
      this.userListHR.forEach(element => {
        element['checked'] = false;
        count = count + 1;
        element['uid'] = count;
      });
      this.rowDataHR = this.userListHR;
    }, (err) => {
    });
  }

  onGridReadyHR(params: any) {
    this.gridApiHR = params.api;
    this.gridColumnApiHR = params.columnApi;
  }

  sorteventHR(e) {
  }

  customComparatorHR = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClickedHR(event) {
  }

  getModelHR(e) {
    this.gridApiHR.deselectAll();
    // console.log(e);
    setTimeout(() => {
      const filteredArray = this.gridApiHR.getModel().rootNode.childrenAfterFilter;
      if (filteredArray && filteredArray.length === 0) {
        this.appConfig.warningWithTitle('No search results found', 'Interview Panel Not Found');
        // this.appConfig.nzNotification('error', 'Interview Panel Not Found', 'No search results found');
      }
    }, 500);
  }

  onQuickFilterChangedHR() {
    this.gridApiHR.setQuickFilter(this.quickSearchValueHR);
    const filteredArray = this.gridApiHR.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Interview Panel Not Found');
      // this.appConfig.nzNotification('error', 'Interview Panel Not Found', 'No global search results found');
    }
  }
  tabledefHR() {
    this.columnDefsHR = [
      {
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        maxWidth: 50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        suppressMenu: true,
        field: 'is_checkedHR',
        headerName: ''
      },
      {
        headerName: 'Employee name', field: 'employee_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'employee_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
  }

  ngOnDestroy() {
    this.getParticularInterviewpanelistSubscription ? this.getParticularInterviewpanelistSubscription.unsubscribe() : '';
    this.generalCustEvaluationProcessingFeedbacksSubscription ? this.generalCustEvaluationProcessingFeedbacksSubscription.unsubscribe() : '';
  }
}
