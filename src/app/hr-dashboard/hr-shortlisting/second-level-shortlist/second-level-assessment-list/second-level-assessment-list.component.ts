import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { CONSTANT } from 'src/app/constants/app-constants.service';
// import all Enterprise modules
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);

import { GridChartsModule } from '@ag-grid-enterprise/charts';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-second-level-assessment-list',
  templateUrl: './second-level-assessment-list.component.html',
  styleUrls: ['./second-level-assessment-list.component.scss']
})
export class SecondLevelAssessmentListComponent implements OnInit, OnDestroy {

  BASE_URL = environment.API_BASE_URL;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  displayNoRecords = false;
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef :any
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  refreshSubscription: Subscription;
  assessmentListForSecondLevelShortlistSubscription: Subscription;
  firstShortlistExcelDownloadSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private router: Router,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();
    // this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST, 'assement_name' ? {data: 'assement_name'} : {data: 'none'});
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.assessmentListForSecondLevelShortlistSubscription ? this.assessmentListForSecondLevelShortlistSubscription.unsubscribe() : '';
    this.firstShortlistExcelDownloadSubscription ? this.firstShortlistExcelDownloadSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST)) {
        this.quickSearchValue = '';
        this.getUsersList();
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getUsersList();
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  downloadFirstLevelReport(shortlistName) {
    let sendReq = {
      "shortlist_name": shortlistName ? shortlistName : ''
    }
   this.firstShortlistExcelDownloadSubscription = this.adminService.firstShortlistExcelDownload(sendReq).subscribe((data: any) => {
      const excel = data && data.file ? data.file : '';
      window.open(excel, '_blank');

    }, (err) => {
    });
  }

  onCellClicked(event) {
    if (event.colDef.field === 'buttons') {
      if (event['data']['available'] > 0) {
        return this.shortlistRedirect(event['data']);
      }
    }

    if (event.colDef.field === 'shortlist_name') {
      this.downloadFirstLevelReport(event['data']['shortlist_name']);
    }


    if (event.colDef.field === 'view') {
      if (event['data']['shortlisted'] > 0) {
        this.shortlistedReport(event['data']);
      }
    }

    if (event.colDef.field === 'view1') {
      if (event['data']['shortlisted'] > 0) {
        this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT, {shortlist_name: event['data']['shortlist_name']});
      }
    }

  }

  getModel(e) {
    setTimeout(() => {
      const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
      if (filteredArray && filteredArray.length === 0) {
        this.appConfig.warning('No search results found');
      }
    }, 500);
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
      // this.toast.warning('No reuslts found');
    }
  }
  tabledef() {

    this.columnDefs = [
      {
        headerName: 'Shortlist name', field: 'shortlist_name',
        filter: 'agTextColumnFilter',
        minWidth: 170,
        sortable: true,
        tooltipField: 'shortlist_name',
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        },
        cellClass: 'shorlistName',
        cellRenderer: (params) => {
            return `<span class="shortlist"><span class="material-icons">download</span> ${params['data']['shortlist_name']}</span>`;
        }
      },
      {
        headerName: 'Total No. of candidates', field: 'total_count',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'total_count',
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Assessment Results', field: 'status1',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'status1',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Assessments Taken', field: 'exams_taken',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'exams_taken',
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Yet to complete Assessments', field: 'notTaken',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'notTaken',
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Available for shortlist', field: 'available',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'available',
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Action', field: 'buttons',
        cellClass: 'agCellStyle',
        minWidth: 140,
        headerClass: 'ag-grid-header-center',
        valueFormatter: this.tooltipFormatter,
        tooltipValueGetter: (params) => {//This will show valueFormatted if is present, if no just show the value.
          return (params.valueFormatted);
        },
        cellRenderer: (params) => {
          if (params['data']['buttons'] == 'completed') {
            return `<button class="table-btn agTable selection-disable success" mat-raised-button>Shortlisted</button>`;
          }
          if (params['data']['available'] > 0) {
            return `<button class="table-btn agTable inprogress" mat-raised-button>Shortlist...</button>`;
          }
          else {
            return ``;
          }
        },
        filterParams: {
          buttons: ['reset'],
        },
          sortable: true,
      },
      {
        headerName: 'Shortlisted count', field: 'shortlisted',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'shortlisted',
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'View Shortlisted', field: 'view',
        minWidth: 140,
        headerClass: 'ag-grid-header-center',
        cellClass: 'agCellStyle',
        cellRenderer: (params) => {
          if (params['data']['shortlisted'] > 0) {
            return `<span style="cursor: pointer; display: flex; color: #C02222" class="material-icons">visibility</span>`;
          }
        },
        filter: false,
        sortable: false,
      },
      {
        headerName: 'Assign to Panel', field: 'view1',
        minWidth: 140,
        headerClass: 'ag-grid-header-center',
        cellClass: 'agCellStyle',
        cellRenderer: (params) => {
          if (params['data']['shortlisted'] > 0) {
            return `<span style="cursor: pointer; display: flex; color: #C02222" class="material-icons">group</span>`;
          }
        },
        filter: false,
        sortable: false,
      }
    ];
  }

  tooltipFormatter(params) {
    if (params.value == 'completed') {
      return "Shortlisted";
    }
    if (params.value == 'waiting') {
      return "Click to shortlist";
    } else {
      return "No Candidates available for shortlist";
    }
  }

  // To get all users
  getUsersList() {
    this.gridApi.showLoadingOverlay();
    this.assessmentListForSecondLevelShortlistSubscription = this.adminService.assessmentListForSecondLevelShortlist().subscribe((datas: any) => {
      if (datas) {
        this.userList = datas ? datas : [];
        this.userList.forEach(element => {
          element['total_count'] = Number(element['total_count']);
          element['available'] = element['exams_taken'] - element['shortlisted'];
          element['notTaken'] = element['total_count'] - element['exams_taken'];
          element['status'] = element && element.status != 'completed' ? 'waiting' : 'completed';
          element['status1'] = element['exams_taken'] && element['exams_taken'] > 0 ? 'Updated' : 'Awaiting';
          element['buttons'] = element && element.status == 'completed' ? 'completed' : element['available'] > 0 ? 'waiting' : 'Yet to complete assessment';
          element['view'] = element && element.status == 'completed' ? 'completed' : element['available'] > 0 ? 'waiting' : 'Yet to complete assessment';
          element['view1'] = element && element.status == 'completed' ? 'completed' : element['available'] > 0 ? 'waiting' : 'Yet to complete assessment';
        });
      } else {
        this.userList = [];
      }
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  shortlistRedirect(detail) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST, {data: detail['shortlist_name'] ? detail['shortlist_name'] :'none'});
  }
  shortlistedReport(detail) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTED_CANDIDATE_REPORT, {data: detail['shortlist_name'] ? detail['shortlist_name'] :'none'});
  }

  routeToVideoSchedule() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.VIDEO_ASSESSMENT_SCHEDULE);
  }
}
