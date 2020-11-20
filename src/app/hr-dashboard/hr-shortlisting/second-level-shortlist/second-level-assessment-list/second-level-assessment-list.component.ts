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
  defaultColDef = {
    flex: 1,
    minWidth: 40,
    resizable: true,
    floatingFilter: true,
    lockPosition: true,
    suppressMenu: true,
    unSortIcon: true,
  };
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
      if (event['data']['status'] == 'completed') {
        this.shortlistedReport(event['data']);
      } else {
        this.shortlistRedirect(event['data']);
      }
    }
  }

  getModel(e) {
    // console.log(e);
    
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.nzNotification('error', 'Not Found', 'No search results found');
    }
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.nzNotification('error', 'Not Found', 'No global search results found');      
      // this.toast.warning('No reuslts found');
    }
  }
  tabledef() {

    this.columnDefs = [
      {
        headerName: 'S no', field: 'counter',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Shortlist name', field: 'group_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'group_name',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Status', field: 'status',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'No. of candidates', field: 'no_of_candidate',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'no_of_candidate',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Shortlist', field: 'buttons',
        // cellStyle: { textAlign: 'center', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' },
        cellClass: 'agCellStyle',
        cellRenderer: (params) => {
          if (params['data']['buttons'] == 'completed') {
            return `<img style="cursor: pointer;" src="assets/images/eye.svg" alt="" srcset="">`;            
          } else {
            return `<button class="table-btn agTable" mat-raised-button>Shortlist</button>`;            
          }
        },
        sortable: true,
      }
    ];
    this.getUsersList();
  }


  // To get all users
  getUsersList() {
    this.adminService.assessmentListForSecondLevelShortlist().subscribe((datas: any) => {
      this.appConfig.hideLoader();

      if (datas) {
        this.userList = datas ? datas : [];
        let count = 0;
        this.userList.forEach(element => {
          count = count + 1;
          element['counter'] = count;
          element['status'] = element && element.status != 'completed' ? 'waiting' : 'completed';
          element['buttons'] = element && element.status != 'completed' ? 'waiting' : 'completed';
        });
      } else {
        this.userList = [];
      }
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  shortlistRedirect(detail) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST, detail['group_name'] ? {data: detail['group_name']} : {data: 'none'});
  }
  shortlistedReport(detail) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTED_CANDIDATE_REPORT, detail['group_name'] ? {data: detail['group_name']} : {data: 'none'});
  }
  viewReports(selectedCandidate) {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_REPORTS);
  }

}
