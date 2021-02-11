import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-upload-selected-candidates-error-report',
  templateUrl: './upload-selected-candidates-error-report.component.html',
  styleUrls: ['./upload-selected-candidates-error-report.component.scss']
})
export class UploadSelectedCandidatesErrorReportComponent implements OnInit {
  userList: any;

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
  gridColumnApi: any;
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
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
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
        headerName: 'Bussiness Name', field: 'business_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'business_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email id', field: 'email',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date', field: 'date',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        maxWidth: 120,
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
        maxWidth: 120,
        sortable: true,
        tooltipField: 'time',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Reason for not uploaded', field: 'reason',
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
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    const apiData = {
      uploaded_by: ''
    };
    this.adminService.SelectedCandidatesBulkUploadErrorList().subscribe((datas: any) => {
      this.appConfig.hideLoader();
      this.userList = datas ? datas : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

}

