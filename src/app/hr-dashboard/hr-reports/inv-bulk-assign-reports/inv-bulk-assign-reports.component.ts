import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-inv-bulk-assign-reports',
  templateUrl: './inv-bulk-assign-reports.component.html',
  styleUrls: ['./inv-bulk-assign-reports.component.scss']
})
export class InvBulkAssignReportsComponent implements OnInit {

  paginationPageSize = 1000;
  cacheBlockSize: any = 1000;
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
  reportDetails1: any;
  quickSearchValue = '';

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.tabledef();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    // this.gridApi.sizeColumnsToFit();
    // this.gridApi.setDatasource(this.dataSources);
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  tabledef() {
    this.columnDefs = [
      {
        headerName: 'S no',
        valueGetter: (params) => {
          const i = +params.node.id + 1;
          return i ? i : 'Loading...';
        },
        minWidth: 100,
      },
      {
        headerName: 'Candidate email', field: 'user_email',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'user_email',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Interview panel email', field: 'hr_email',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'hr_email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date', field: 'date',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'date',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Time', field: 'time',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'time',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'uploaded_by',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'uploaded_by',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Reason', field: 'reason',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'reason',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];

    // this.service.getNotificationData(this.adminDetails._id)
    //   .subscribe((result: any) => {
    //     if (result.data && result.data.getnotificationreports?.message) {
    //       const reportDetails = result.data.getnotificationreports?.message || [];

    //       const array = reportDetails.filter((item) => {
    //         item.report_info.created_on = moment(item.report_info.updated_on).format('MM-DD-YYYY HH:mm a');
    //         return item.request_type === 'bulk_enrolment';
    //       });
    //       this.reportDetails = array;
          // this.go();
    //     }
    //   });
    this.adminService.bulkUploadInvAssignReports().subscribe((data: any) => {
      this.appConfig.hideLoader();      
      this.rowData = data ? data : [];
          }, (err) => {
    });

  }

  onCellClicked(event) {
    if (event.colDef.field === 'name') {
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SUB_ASSESSMENTS,  {data: '', id: '', name: '', status: '', tag: '', uid: ''});
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

}
