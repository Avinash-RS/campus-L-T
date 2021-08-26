import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-second-level-assessment-list',
  templateUrl: './second-level-assessment-list.component.html',
  styleUrls: ['./second-level-assessment-list.component.scss']
})
export class SecondLevelAssessmentListComponent implements OnInit {

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

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();

    // this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST, 'assement_name' ? {data: 'assement_name'} : {data: 'none'});
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    if (event.colDef.field === 'buttons') {
      if (event['data']['available'] > 0) {
        return this.shortlistRedirect(event['data']);
      }
    }

    if (event.colDef.field === 'view') {
        this.shortlistedReport(event['data']);
    }

  }

  getModel(e) {
    // console.log(e);

    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
    }
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
        headerName: 'S no', field: 'counter',
        filter: 'agNumberColumnFilter',
        minWidth: 40,
        sortable: true,
        tooltipField: 'counter',
        filterParams: {
          buttons: ['reset'],
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Shortlist name', field: 'shortlist_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'shortlist_name',
        filterParams: {
          buttons: ['reset'],
        },
          getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Status', field: 'status',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'status',
        getQuickFilterText: (params) => {
          return params.value;
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
        headerName: 'Yet to complete Assessment', field: 'notTaken',
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
        headerName: 'Shortlisted candidates', field: 'shortlisted',
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
        headerName: 'Shortlist', field: 'buttons',
        cellClass: 'agCellStyle',
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
            return `<button class="table-btn agTable inprogress" mat-raised-button>Shortlist</button>`;
          }
          else {
            return `<button class="table-btn agTable selection-disable opacity" mat-raised-button>Shortlist</button>`;
          }
        },
        filterParams: {
          buttons: ['reset'],
        },
          sortable: true,
      },
      {
        headerName: 'View Report', field: 'view',
        headerClass: 'ag-grid-header-center',
        cellClass: 'agCellStyle',
        cellRenderer: (params) => {
          if (params['data']['shortlisted'] > 0) {
            return `<img style="cursor: pointer;" src="assets/images/eye.svg" alt="" srcset="">`;
          }
        },
        filter: false,
        sortable: false,
      }
    ];
    this.getUsersList();
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
    this.adminService.assessmentListForSecondLevelShortlist().subscribe((datas: any) => {


      if (datas) {
        this.userList = datas ? datas : [];
        let count = 0;
        this.userList.forEach(element => {
          count = count + 1;
          element['counter'] = count;
          element['total_count'] = Number(element['total_count']);
          element['available'] = element['exams_taken'] - element['shortlisted'];
          element['notTaken'] = element['total_count'] - element['exams_taken'];
          element['status'] = element && element.status != 'completed' ? 'waiting' : 'completed';
          element['buttons'] = element && element.status == 'completed' ? 'completed' : element['available'] > 0 ? 'waiting' : 'Yet to complete assessment';
          element['view'] = element && element.status == 'completed' ? 'completed' : element['available'] > 0 ? 'waiting' : 'Yet to complete assessment';
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

}
