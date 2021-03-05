import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listof-selected-candidates',
  templateUrl: './listof-selected-candidates.component.html',
  styleUrls: ['./listof-selected-candidates.component.scss']
})
export class ListofSelectedCandidatesComponent implements OnInit {
  BASE_URL = environment.API_BASE_URL;

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
  tooltipShowDelay = 0;
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';

  userList: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService
  ) { }

  ngOnInit() {
    this.tabledef();
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

    this.columnDefs = [
      {
        headerName: 'S no', field: 'counter',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 90,
        maxWidth: 90,
        sortable: true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate name', field: 'candidate_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate Email id', field: 'selected_candidate',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'selected_candidate',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate id', field: 'candidate_id',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Profile', field: 'selectedpost',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'selectedpost',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute', field: 'institute',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'institute',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Specialization', field: 'specialization',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'specialization',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      // {
      //   headerName: 'Status', field: 'status',
      //   filter: true,
      //   floatingFilterComponentParams: { suppressFilterButton: true },
      //   maxWidth: 100,
      //   sortable: true,
      //   tooltipField: 'status',
      //   getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      {
        headerName: 'Assigned to', field: 'company',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'company',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'uploaded_by',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'uploaded_by',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date & Time of upload', field: 'date_time',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        sortable: true,
        tooltipField: 'date_time',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: '', field: 'details',
        cellClass: 'agCellStyle',
        // headerTooltip: 'Download documents',
        valueFormatter: this.tooltipFormatter,
        maxWidth: 60,
        minWidth: 60,
        tooltipValueGetter: (params) => {//This will show valueFormatted if is present, if no just show the value.
          return (params.valueFormatted);
      },
        cellRenderer: (params) => {
            return `<span style="cursor: pointer;" class="material-icons d-flex justify-content-center align-items-center">
            file_download
            </span>`;            
        },
        sortable: false,
      }
    ];
    this.getUsersList();
  }

  tooltipFormatter(params) {
    return "Download documents";
  }
  // To get all users
  getUsersList() {
    const apiData = {
      company: ''
    }
    this.adminService.SelectedCandidatesList(apiData).subscribe((datas: any) => {
      this.appConfig.hideLoader();
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
      uid: element?.user_id ? element?.user_id : '',
      uname: this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : '',
      email: this.appConfig.getLocalData('userEmail') ? this.appConfig.getLocalData('userEmail') : ''
    }
    this.adminService.documentsDownload(sendReq).subscribe((data: any) => {
      this.appConfig.hideLoader();
      if (data?.url) {
        const documents = `${this.BASE_URL}/${data?.url}`;
        window.open(documents, '_blank');  
      } else {
        this.appConfig.warning('No Documents Available');
      }
            
      // const excel = data && data.file ? data.file : '';
      // window.open(excel, '_blank');

    }, (err) => {
    });
  }

}
