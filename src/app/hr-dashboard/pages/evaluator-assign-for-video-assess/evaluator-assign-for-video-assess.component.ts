import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { ScheduleInterviewPopupComponent } from '../schedule-interview-popup/schedule-interview-popup.component';
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
  rowData: any = [];
  quickSearchValue = '';
  gridColumnApi: any;
  isChecked: boolean;

  paginationPageSizeHR = 500;
  cacheBlockSizeHR: any = 500;
  gridApiHR: any;
  columnDefsHR = [];
  defaultColDefHR:any
  rowDataHR: any = [];
  searchBoxHR = false;
  filterValueHR: string;
  quickSearchValueHR = '';
  gridColumnApiHR: any;
  isCheckedHR: boolean;
  userListHR: any;
  selectedCandidates: any[];
  selectedInterviewers: any[];

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
    this.particularInvpanelist('');
    this.refreshOndriveChangeRXJS();
  }

  sendMail() {

  }

  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['shortlist_name']) {
        this.selectedShortlistname = params['shortlist_name'];
      } else {
      }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.getParticularInterviewpanelistSubscription ? this.getParticularInterviewpanelistSubscription.unsubscribe() : '';
    }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT)) {
        this.tabledefHR();
        this.tabledef();
        }
    });
  }

  clearAllDatas() {
    this.quickSearchValue = '';
    this.userList = null;
    this.rowData = null;
  }
  ngAfterViewInit() {
     // Hack: Scrolls to top of Page after page view initialized
     let top = document.getElementById('top');
     if (top !== null) {
       top.scrollIntoView();
       top = null;
     }
    }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabledef();
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCandidateSelect(e) {
    const selectedRows = e.api.getSelectedRows();
    // tslint:disable-next-line: prefer-const
    let sData = [];
    selectedRows.forEach((d) => {
      d.type = 'candidate'
      sData.push(d);
    });
    this.selectedCandidates = sData;
  }

  onInterviewerSelect(e) {
    const selectedRows = e.api.getSelectedRows();
    // tslint:disable-next-line: prefer-const
    let sData = [];
    selectedRows.forEach((d) => {
      d.type = 'interviewer'
      sData.push(d);
    });
    this.selectedInterviewers = sData;
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
        headerCheckboxSelectionFilteredOnly: true,
        maxWidth: 50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        suppressMenu: true,
        field: 'is_checked',
        headerName: ''
      },
      {
        headerName: 'Candidate Email ID', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          if (params['data']['level'] && params['data']['level'] != ' ') {
            return `<span style="border-bottom: solid #C02222 1px; cursor: pointer; color: #C02222;">${params['data']['email']} </span>`;
          } else {
            return `${params['data']['email']}`
          }
        }
      },
      {
        headerName: 'Candidate Name', field: 'hr_assign_status',
        filter: 'agSetColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'hr_assign_status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Test Status', field: 'discipline',
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
    ];
  }

  tabledef() {
    if (this.appConfig.getSelectedDrivePermissions().video_assessment) {
      let defaultCol: any = this.WithoutVideoSchedulingColumns();
      this.gridApi.setColumnDefs(defaultCol);
    } else {
      this.gridApi.setColumnDefs(null);
      this.gridApi.setColumnDefs(this.WithoutVideoSchedulingColumns());
    }
  }

  //  HR
  onGridReadyHR(params: any) {
    this.gridApiHR = params.api;
    this.gridColumnApiHR = params.columnApi;
    this.tabledefHR();
  }

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


  particularInvpanelist(data) {
    const apiData = {
      discipline: data ? data : ''
    }
   this.getParticularInterviewpanelistSubscription = this.adminService.getParticularInterviewpanelist(apiData).subscribe((data: any) => {

      const datas = data ? data : [];
      this.getUsersList1(datas);
    }, (err) => {
    });
  }

    // To get all users
    getUsersList1(data) {
      this.userListHR = data ? data : [];
        let count = 0;
        this.userListHR.forEach(element => {
          element['checked'] = false;
          count = count + 1;
          element['uid'] = count;
        });
        this.rowDataHR = this.userListHR;
    }


  scheduleHirerachy(){
    const selectedUserlist = this.gridApi.getSelectedNodes();
    const selectedUserlistHR = this.gridApiHR.getSelectedNodes();
    const candidateID = [];
    const HRID = [];
    selectedUserlist.forEach(element => {
      if (element['data']) {
        candidateID.push(element['data']['email'])
      }
    });

    selectedUserlistHR.forEach(element => {
      if (element['data']) {
        HRID.push(element['data']['email'])
      }
    });
    const apiData = {
      user_email: candidateID,
      hr_email: HRID,
      shortlist_name: this.selectedShortlistname,
      field_user_created_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
    };
  }
  submit() {
    const selectedUserlist = this.gridApi.getSelectedNodes();
    const selectedUserlistHR = this.gridApiHR.getSelectedNodes();
    const candidateID = [];
    const HRID = [];
    selectedUserlist.forEach(element => {
      if (element['data']) {
        candidateID.push(element['data']['email'])
      }
    });

    selectedUserlistHR.forEach(element => {
      if (element['data']) {
        HRID.push(element['data']['email'])
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
      user_email: candidateID,
      hr_email: HRID,
      shortlist_name: this.selectedShortlistname,
      field_user_created_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
    };
    this.openDialog(ShortlistBoxComponent, data, apiData);
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
      }
    });
  }

  openDialog1(component, data, apiData) {
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
