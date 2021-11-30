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
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-first-level-shorlist-reports',
  templateUrl: './first-level-shorlist-reports.component.html',
  styleUrls: ['./first-level-shorlist-reports.component.scss']
})
export class FirstLevelShorlistReportsComponent implements OnInit, OnDestroy {

  BASE_URL = environment.API_BASE_URL;

  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef:any
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  displayNoRecords = false;
  firstLevelReportsSubscription: Subscription;
  firstShortlistExcelDownloadSubscription: Subscription;
  refreshSubscription: Subscription;
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
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.firstLevelReportsSubscription ? this.firstLevelReportsSubscription.unsubscribe() : '';
    this.firstShortlistExcelDownloadSubscription ? this.firstShortlistExcelDownloadSubscription.unsubscribe() : '';
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRST_LEVEL_REPORTS_LIST)) {
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

  onCellClicked(event) {
    if (event.colDef.field === 'details') {
      this.downloadExcel(event['data']);
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
    // displayedColumns: any[] = ['uid', 'foldername', 'shortlistname', 'dates', 'times', 'shortlistby', 'download'];

    this.columnDefs = [
      {
        headerName: 'S no', field: 'counter',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Shortlist name', field: 'shortlistname',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'shortlistname',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date', field: 'dates',
        filter: 'agTextColumnFilter',
        maxWidth: 120,
        sortable: true,
        tooltipField: 'dates',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Time', field: 'times',
        filter: 'agTextColumnFilter',
        maxWidth: 120,
        sortable: true,
        tooltipField: 'times',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Shortlisted by', field: 'shortlistby',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'shortlistby',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate details', field: 'details',
        filter: false,
        minWidth: 120,
        cellClass: 'ag-icon-custom',
        cellRenderer: (params) => {
              return `<span class="icon-Download ag-icon-color pointer ag-icon-font-size-20"></span>`;
          },
        sortable: true,
      }
    ];
  }

  // To get all users
  getUsersList() {
   this.gridApi.showLoadingOverlay();
   this.firstLevelReportsSubscription = this.adminService.firstLevelReports().subscribe((datas: any) => {

      this.userList = datas ? datas : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
        element['details'] = count;
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  downloadExcel(element) {

    let sendReq = {
      "shortlist_name": element.shortlistname
    }
   this.firstShortlistExcelDownloadSubscription = this.adminService.firstShortlistExcelDownload(sendReq).subscribe((data: any) => {


      const excel = data && data.file ? data.file : '';
      window.open(excel, '_blank');

    }, (err) => {
    });
  }

}
