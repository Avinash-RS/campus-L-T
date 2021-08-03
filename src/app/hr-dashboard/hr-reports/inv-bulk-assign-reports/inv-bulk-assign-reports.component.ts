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
  defaultColDef : any;
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
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
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
        headerName: 'S no', field: 'counter',
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        sortable: true,
        tooltipField: 'counter',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate email', field: 'user_email',
        filter: 'agTextColumnFilter',
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
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'hr_email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date', field: 'date',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'date',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Time', field: 'time',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'time',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'uploaded_by',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'uploaded_by',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Reason', field: 'reason',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'reason',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];

    this.adminService.bulkUploadInvAssignReports().subscribe((data: any) => {

      const userlist = data ? data : [];
      let count = 0;
      userlist.forEach(element => {
        count = count + 1;
        element['counter'] = count;
      });
      this.rowData = userlist;
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

}
