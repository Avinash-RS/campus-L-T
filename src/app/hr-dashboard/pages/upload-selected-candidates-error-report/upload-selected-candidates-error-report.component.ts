import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-upload-selected-candidates-error-report',
  templateUrl: './upload-selected-candidates-error-report.component.html',
  styleUrls: ['./upload-selected-candidates-error-report.component.scss']
})
export class UploadSelectedCandidatesErrorReportComponent implements OnInit, OnDestroy {
  userList: any;

  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef : any;
  gridColumnApi: any;
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  refreshSubscription: Subscription;
  SelectedCandidatesBulkUploadErrorListSubscription: Subscription;
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
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.SelectedCandidatesBulkUploadErrorListSubscription ? this.SelectedCandidatesBulkUploadErrorListSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.OfferedCandidatesLIST)) {
        this.quickSearchValue = '';
        this.getUsersList();
        }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getUsersList();
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
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
        headerName: 'Business Name', field: 'business_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'business_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate Email id', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date', field: 'date',
        filter: 'agTextColumnFilter',
        maxWidth: 120,
        sortable: true,
        tooltipField: 'date',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Time', field: 'time',
        filter: 'agTextColumnFilter',
        maxWidth: 120,
        sortable: true,
        tooltipField: 'time',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Reason for not uploaded', field: 'reason',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'reason',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
  }

  // To get all users
  getUsersList() {
    const apiData = {
      uploaded_by: ''
    };
    this.gridApi.showLoadingOverlay();
   this.SelectedCandidatesBulkUploadErrorListSubscription = this.adminService.SelectedCandidatesBulkUploadErrorList().subscribe((datas: any) => {

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

