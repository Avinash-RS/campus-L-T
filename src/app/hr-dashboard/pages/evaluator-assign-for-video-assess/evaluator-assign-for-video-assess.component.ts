import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-evaluator-assign-for-video-assess',
  templateUrl: './evaluator-assign-for-video-assess.component.html',
  styleUrls: ['./evaluator-assign-for-video-assess.component.scss']
})
export class EvaluatorAssignForVideoAssessComponent implements OnInit, OnDestroy, AfterViewInit {

  getParticularInterviewpanelistSubscription: Subscription;
  refreshSubscription: Subscription;
  selectedShortlistname: any;
  userList: any;

  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef: any;
  searchBox = false;
  filterValue: string;
  rowData: any = null;
  quickSearchValue = '';
  gridColumnApi: any;
  isChecked: boolean;

  paginationPageSizeHR = 500;
  cacheBlockSizeHR: any = 500;
  gridApiHR: any;
  columnDefsHR = [];
  defaultColDefHR:any
  rowDataHR: any = null;
  searchBoxHR = false;
  filterValueHR: string;
  quickSearchValueHR = '';
  gridColumnApiHR: any;
  isCheckedHR: boolean;
  userListHR: any;
  selectedCandidates: any[] = [];
  selectedInterviewers: any[] = [];
  candidatesList: any;
  assignToEvaluatorSubscription: any;

  constructor(
    public appConfig: AppConfigService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    this.editRouteParamGetter();
   }

   ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.defaultColDefHR = this.appConfig.agGridWithAllFunc();
    this.refreshOndriveChangeRXJS();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabledef();
  }

  onGridReadyHR(params: any) {
    this.gridApiHR = params.api;
    this.gridColumnApiHR = params.columnApi;
    this.tabledefHR();
  }

  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['shortlist_name']) {
        this.selectedShortlistname = params['shortlist_name'];
        let evaluationCandidates = this.appConfig.getLocalData('sendEvaluationCandidates');
        this.candidatesList = evaluationCandidates ? JSON.parse(evaluationCandidates) : null;
        if (this.candidatesList && this.candidatesList.length > 0) {
          this.particularInvpanelist('');
          this.getCandidatesList(this.candidatesList);
        } else {
          this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST, {data: this.selectedShortlistname});
        }
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST);
      }
    });
  }

  ngOnDestroy() {
    this.appConfig.clearLocalDataOne('sendEvaluationCandidates');
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.getParticularInterviewpanelistSubscription ? this.getParticularInterviewpanelistSubscription.unsubscribe() : '';
    this.assignToEvaluatorSubscription ? this.assignToEvaluatorSubscription.unsubscribe() : '';
    }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_VIDEO_ASSESSMENT_EVALUATION_SCREEN)) {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST);
      }
    });
  }

  clearAllDatas() {
    this.quickSearchValue = '';
    this.userList = null;
    this.rowData = null;
    this.quickSearchValueHR = '';
    this.userListHR = null;
    this.rowDataHR = null;
  }
  ngAfterViewInit() {
     // Hack: Scrolls to top of Page after page view initialized
     let top = document.getElementById('top');
     if (top !== null) {
       top.scrollIntoView();
       top = null;
     }
    }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCandidateSelect(e) {
    const selectedRows = e.api.getSelectedRows();
    // tslint:disable-next-line: prefer-const
    this.selectedCandidates = selectedRows;
  }

  onInterviewerSelect(e) {
    const selectedRows = e.api.getSelectedRows();
    // tslint:disable-next-line: prefer-const
    this.selectedInterviewers = selectedRows;
  }

  onCellClicked(event) {
    if (event.colDef.field === 'email' && event['data'] && (event['data']['level'] && event['data']['level'] != ' ')) {
        const data = {
          candidate_user_id: event['data'] && event['data']['uid'] ? event['data']['uid'] : '',
          candidateName: event['data'] && event['data']['name'] ? event['data']['name'] : '',
        };
    }
  }

  getModel(e) {
    // console.log(e);
    setTimeout(() => {
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Candidate Not Found');
      // this.appConfig.nzNotification('error', 'Candidate Not Found', 'No search results found');
    }
  }, 500);
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warningWithTitle('No search results found', 'Candidate Not Found');
      // this.appConfig.nzNotification('error', 'Candidate Not Found', 'No global search results found');
    }
  }

  WithoutVideoSchedulingColumns() {
    return [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerName: 'Candidate Id', field: 'candidate_id',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate Email Id', field: 'email_id',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email_id',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return `${params['data']['email_id']}`
        }
      },
      {
        headerName: 'Candidate Name', field: 'candidate_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      }
    ];
  }

  tabledef() {
    if (this.appConfig.getSelectedDrivePermissions().video_assessment) {
      let defaultCol: any = this.WithoutVideoSchedulingColumns();
      this.columnDefs = defaultCol;
      // this.gridApi.setColumnDefs(defaultCol);
    } else {
      this.columnDefs = this.WithoutVideoSchedulingColumns();
      // this.gridApi.setColumnDefs(null);
      // this.gridApi.setColumnDefs(this.WithoutVideoSchedulingColumns());
    }
  }

  //  HR

  sorteventHR(e) {
  }

  customComparatorHR = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClickedHR(event) {
  }

  getModelHR(e) {
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
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
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

  getCandidatesList(data: any) {
      this.userList = data;
      this.rowData = data;
  }

  particularInvpanelist(data) {
    const apiData = {
      discipline: data ? data : ''
    }
   this.getParticularInterviewpanelistSubscription = this.adminService.getParticularInterviewpanelistWithoutLoader(apiData).subscribe((data: any) => {

      const datas = data ? data : [];
      this.getUsersList1(datas);
    }, (err) => {
    });
  }

    // To get all users
    getUsersList1(data) {
      this.userListHR = data ? data : [];
        this.userListHR.forEach(element => {
          element['checked'] = false;
        });
        this.rowDataHR = this.userListHR;
    }


  sendMail() {
    const selectedUserlist = this.gridApi.getSelectedNodes();
    const selectedUserlistHR = this.gridApiHR.getSelectedNodes();
    const candidateID = [];
    const HRID = [];
    let ScheduleId: any;
    selectedUserlist.forEach((element, i) => {
      if (element['data']) {
        i == 0 ? ScheduleId = element['data']['va_schedule_id'] : '';
        candidateID.push(element['data']['candidate_user_id'])
      }
    });

    selectedUserlistHR.forEach(element => {
      if (element['data']) {
        HRID.push(element['data']['uid'])
      }
    });
    let data;
    if (candidateID.length > 0 && HRID.length > 0) {
      data = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Are you sure you want to assign these panels?`,
          type: 'assign-hr',
          identity: 'panel-assign'
        },
        showConfirm: 'Confirm',
        interViwePanelAssign: 'assign',
        candidateCount: candidateID.length,
        panel: HRID.length,
        candidate: candidateID.length == 1 ? 'Candidate' : 'Candidates',
        member: HRID.length == 1 ? 'member' : 'members',
        showCancel: 'Cancel',
        showOk: ''
      };
    } else {
      if (candidateID.length < 1 && HRID.length < 1) {
        data = {
          iconName: '',
          dataToBeShared: {
            confirmText: `No candidates and interview panels has been selected`,
            type: 'assign-hr',
            identity: 'panel-assign'
          },
          showConfirm: 'Confirm',
          interViwePanelAssign: 'noData',
          showCancel: '',
          showOk: ''
        };
      } else {
          data = {
            iconName: '',
            dataToBeShared: {
              confirmText: candidateID.length < 1 ? `No candidates has been selected` : HRID.length < 1 ? 'No interview panel has been selected' : '',
              type: 'assign-hr',
              identity: 'panel-assign'
            },
            showConfirm: 'Confirm',
            interViwePanelAssign: 'noData',
            showCancel: '',
            showOk: ''
      }

    }
  }
    const apiData = {
      shortlist_name: this.selectedShortlistname,
      candidate_user_ids: candidateID,
      interviewer_ids: HRID,
      schedule_id: ScheduleId
    };
    this.openDialog(ShortlistBoxComponent, data, apiData);
  }

  assigntoPanel(apiData) {
    this.assignToEvaluatorSubscription = this.adminService.VideoAssessmentAssignToEvaluator(apiData).subscribe((data: any) => {
    this.matDialog.closeAll();
    this.appConfig.success('Candidates have been successfully assigned to respective Evaluators');
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST, {data: this.selectedShortlistname});
   }, (err) => {
      this.matDialog.closeAll();
    });
   }

  openDialog(component, data, apiData) {
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
        this.assigntoPanel(apiData);
      }
    });
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
     return split;
    }
  }

}
