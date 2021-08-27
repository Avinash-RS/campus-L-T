import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import * as moment from 'moment'; //in your component
// import all Enterprise modules
import { ModuleRegistry, AllModules, IDatasource, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);

import { GridChartsModule } from '@ag-grid-enterprise/charts';
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-uploaded-list',
  templateUrl: './uploaded-list.component.html',
  styleUrls: ['./uploaded-list.component.scss']
})
export class UploadedListComponent implements OnInit, AfterViewInit {
  userList: any = [];
  // serverSide Things
  length = 0;

  // Ag grid
  paginationPageSize: any = 100;
  cacheBlockSize: any = 100;
  gridApi: any;
  columnDefs = [];

  defaultColDef: any;
  rowData: any = [];
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  public gridColumnApi;
  protected rowModelType;
  protected serverSideStoreType;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService
  ) {
    this.serverSideStoreType = 'partial';
    this.rowModelType = 'infinite';
  }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithServerSideAllFunc();
    this.tabledef();
    // this.getUsersList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.gridColumnApi;
    var datasource = {
      getRows: (params: IGetRowsParams) => {
      // console.log('fetching', params);
      // console.log('ad', this.gridApi);
    // if (params.sortModel.length === 0 && Object.keys(params.filterModel).length == 0) {

      const apiData = {
        startRow: params.startRow,
        endRow: params.endRow,
        isTpo: false
      };

      this.gridApi.showLoadingOverlay();
      this.adminService.getCandidatesList(apiData).subscribe((data1: any) => {
        this.gridApi.hideOverlay();
        // console.log('data', data1);

        this.userList = data1 && data1['data'] ? data1['data'] : [];
        let count = params.startRow;
        this.userList.forEach((element, i) => {
          count = count + 1;
          element['counter'] = count;
          element['created_date'] = element['created_date'] ? element['created_date'] : '';
        });
        this.length = data1 && data1['total_count'] ? data1['total_count'] : 0;
        params.successCallback(
          this.userList, this.length
        );
      }, (err) => {
        this.gridApi.hideOverlay();
        params.failCallback();
        params.successCallback(
          this.userList, this.length
        );
        this.gridApi.showNoRowsOverlay();
      });
    // } else {
    //   this.gridApi.setFilterModel(null);
    //   this.gridApi.setSortModel(null);
    // }

      }
    }
    this.gridApi.setDatasource(datasource);
  }

  paginationChanged(e) {

  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    // event['data']
  }


  getModel(e) {
    // const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    // if (filteredArray && filteredArray.length === 0) {

    // }
  }

  onQuickFilterChanged() {
    // this.gridApi.setQuickFilter(this.quickSearchValue);
    // const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    // if (filteredArray && filteredArray.length === 0) {
    //   this.appConfig.warning('No search results found');
    //   // this.toast.warning('No reuslts found');
    // }
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('LLL');
      return split;
    }
  }

  tabledef() {

    this.columnDefs = [
      {
        headerName: 'S no',
        field: 'counter',
        filter: 'agNumberColumnFilter',
        filterParams: {
          filterOptions: ['Less than or equals', 'Greater than or equals', 'In range']
        },
        minWidth: 80,
        sortable: true,
        resizable:true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Tag', field: 'tag_name',
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        minWidth: 140,
        sortable: true,
        tooltipField: 'tag_name',
        resizable:true,
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'candidate_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_name',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        resizable:true,
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate id', field: 'candidate_id',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        filterParams: {
          filterOptions: ['Less than or equals', 'Greater than or equals', 'In range']
        },
        sortable: true,
        resizable:true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email id', field: 'email',
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        minWidth: 250,
        sortable: true,
        resizable:true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'uploader_name',
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'uploader_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploader Role', field: 'uploader_role',
        filter: 'agSetColumnFilter',
        filterParams: {
          values: params => {
              // async update simulated using setTimeout()
              setTimeout(() => {
                  // fetch values from server
                  const values = ['Institute', 'HR'];
                  // supply values to the set filter
                  params.success(values);
              }, 1000);
        },
      },
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'uploader_role',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date of Upload', field: 'created_date',
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains']
        },
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'created_date',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];

  }


  ngAfterViewInit() {
    // // Hack: Scrolls to top of Page after page view initialized
    // let top = document.getElementById('top');
    // if (top !== null) {
    //   top.scrollIntoView();
    //   top = null;
    // }
  }


}
