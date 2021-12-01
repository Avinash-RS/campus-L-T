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
        this.gridApi.setColumnDefs(null);
        this.gridApi.setColumnDefs(this.driveBasedColumndefs());
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getUsersList();
    this.gridApi.setColumnDefs(this.driveBasedColumndefs());
  }

  driveBasedColumndefs() {
    if (this.appConfig.getSelectedDrivePermissions().normal_assessment && this.appConfig.getSelectedDrivePermissions().video_assessment) {
      let initColumn: any = this.tabledefInit();
      let normalColumn: any = this.normalAssessmentColumns();
      let videoColumn: any = this.videoAssessmentColumns();
      let normalAssessColumnMerge = initColumn.concat(normalColumn);
      normalAssessColumnMerge.splice(normalAssessColumnMerge.length - 4, 0, videoColumn[0]);
      this.columnDefs = normalAssessColumnMerge;
      return this.columnDefs;
    } else {
    if (this.appConfig.getSelectedDrivePermissions().normal_assessment) {
      let initColumn: any = this.tabledefInit();
      let normalColumn: any = this.normalAssessmentColumns();
      let normalAssessColumnMerge = initColumn.concat(normalColumn);
      this.columnDefs = normalAssessColumnMerge;
      return this.columnDefs;
    }
    if (this.appConfig.getSelectedDrivePermissions().video_assessment) {
      let initColumn: any = this.tabledefInit();
      let videoColumn: any = this.videoAssessmentColumns();
      let videoAssessColumnMerge = initColumn.concat(videoColumn);
      this.columnDefs = videoAssessColumnMerge;
      return this.columnDefs;
    }
  }
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
      // if (event['data']['available'] > 0) {
        return this.shortlistRedirect(event['data']);
      // }
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

    if (event.colDef.field === 'va_scheduled_status') {
      // if (event['data']['shortlisted'] > 0) {
        let params = {
          status: event['data']['va_scheduled_status'] == 'Scheduled' ? 1 : 0,
          shortlist_name: event['data']['shortlist_name'] ? event['data']['shortlist_name'] : null,
          schedule_id: event['data']['schedule_id'] ? event['data']['schedule_id'] : null
        }
        this.routeToVideoSchedule(params);
      // }
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

  videoAssessmentColumns() {
    return [
      {
        headerName: 'Video Assessment', field: 'va_scheduled_status',
        minWidth: 140,
        headerClass: 'ag-grid-header-center',
        cellClass: 'ag-icon-custom',
        cellRenderer: (params) => {
          if (params['data']['va_scheduled_status'] == 'Scheduled') {
            return `<span class="icon-Info ag-icon-color pointer ag-icon-font-size-20"></span>`;
          } else {
            return `<span class="icon-video_camera ag-icon-color pointer ag-icon-font-size"></span>`;
          }
        },
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        sortable: true,
      }
    ]
  }
  normalAssessmentColumns() {
    return [
      {
        headerName: 'Total No. of candidates', field: 'total_count',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'total_count',
        cellStyle: params => {
          return {'text-align': 'center'}
        },
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        }
      },
      // {
      //   headerName: 'Assessment Results', field: 'status1',
      //   filter: 'agSetColumnFilter',
      //   filterParams: {
      //     applyMiniFilterWhileTyping: true
      //   },
      //   minWidth: 140,
      //   sortable: true,
      //   tooltipField: 'status1',
      //   getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      // {
      //   headerName: 'Assessments Taken', field: 'exams_taken',
      //   filter: 'agNumberColumnFilter',
      //   minWidth: 140,
      //   sortable: true,
      //   tooltipField: 'exams_taken',
      //   filterParams: {
      //     buttons: ['reset'],
      //   },
      //     getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      // {
      //   headerName: 'Yet to complete Assessments', field: 'notTaken',
      //   filter: 'agNumberColumnFilter',
      //   minWidth: 140,
      //   sortable: true,
      //   tooltipField: 'notTaken',
      //   filterParams: {
      //     buttons: ['reset'],
      //   },
      //     getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      // {
      //   headerName: 'Available for shortlist', field: 'available',
      //   filter: 'agNumberColumnFilter',
      //   minWidth: 140,
      //   sortable: true,
      //   tooltipField: 'available',
      //   filterParams: {
      //     buttons: ['reset'],
      //   },
      //     getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      {
        headerName: 'Action', field: 'buttons',
        minWidth: 120,
        headerClass: 'ag-grid-header-center',
        valueFormatter: this.tooltipFormatter,
        tooltipValueGetter: (params) => {//This will show valueFormatted if is present, if no just show the value.
          return (params.valueFormatted);
        },
        cellClass: 'ag-button-cellClass',
        cellRenderer: (params) => {
          return `<button class="ag-button-custom ag-button-color common-button-height-28 pointer" mat-raised-button>Shortlist</button>`;
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
        cellStyle: params => {
          // if (params.value) {
              return {'text-align': 'center'}
          // }
        // return null;
        },
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Report', field: 'view',
        minWidth: 100,
        maxWidth: 100,
        headerClass: 'ag-grid-header-center',
        cellClass: 'ag-icon-custom',
        cellRenderer: (params) => {
          if (params['data']['shortlisted'] > 0) {
            return `<span class="icon-View ag-icon-color pointer ag-icon-font-size"></span>`;
          }
        },
        filter: false,
        sortable: false,
      },
      {
        headerName: 'Assign to Panel', field: 'view1',
        minWidth: 120,
        headerClass: 'ag-grid-header-center',
        cellClass: 'ag-icon-custom',
        cellRenderer: (params) => {
          if (params['data']['shortlisted'] > 0) {
            return `<span class="icon-portrait ag-icon-color pointer ag-icon-font-size"></span>`;
          }
        },
        filter: false,
        sortable: false,
      }
    ]
  }

  tabledefInit() {
    return [
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
        cellRenderer: (params) => {
            return `<span class="shortlist"><span style="color: #373331" class="icon-get_app_black_24dp ag-icon-font-size-18"></span> ${params['data']['shortlist_name']}</span>`;
        }
      }
    ];
  }

  tooltipFormatter(params) {
    // if (params.value == 'completed') {
    //   return "Shortlisted";
    // }
    // if (params.value == 'waiting') {
      return "Click to shortlist";
    // } else {
    //   return "No Candidates available for shortlist";
    // }
  }

  // To get all users
  getUsersList() {
    setTimeout(() => {
      this.gridApi.showLoadingOverlay();
    }, 200);
    this.assessmentListForSecondLevelShortlistSubscription = this.adminService.assessmentListForSecondLevelShortlist().subscribe((datas: any) => {
      if (datas) {
        this.userList = datas ? datas : [];
        this.userList.forEach(element => {
          element['total_count'] = Number(element['total_count']);
          // element['available'] = element['exams_taken'] - element['shortlisted'];
          // element['notTaken'] = element['total_count'] - element['exams_taken'];
          element['status'] = element && element.status != 'completed' ? 'waiting' : 'completed';
          // element['status1'] = element['exams_taken'] && element['exams_taken'] > 0 ? 'Updated' : 'Awaiting';
          element['buttons'] = element && element.status == 'completed' ? 'completed' : element['available'] > 0 ? 'waiting' : 'Yet to complete assessment';
          element['view'] = element && element.status == 'completed' ? 'completed' : element['available'] > 0 ? 'waiting' : 'Yet to complete assessment';
          element['view1'] = element && element.status == 'completed' ? 'completed' : element['available'] > 0 ? 'waiting' : 'Yet to complete assessment';
          element['va_scheduled_status'] = element['va_total_count'] && element['va_total_count'] > 0 ? 'Scheduled' : 'Not scheduled'
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

  routeToVideoSchedule(params) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.VIDEO_ASSESSMENT_SCHEDULE, params);
  }
}
