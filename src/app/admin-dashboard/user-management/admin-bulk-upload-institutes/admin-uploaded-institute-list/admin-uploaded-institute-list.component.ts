import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';

@Component({
  selector: 'app-admin-uploaded-institute-list',
  templateUrl: './admin-uploaded-institute-list.component.html',
  styleUrls: ['./admin-uploaded-institute-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminUploadedInstituteListComponent implements OnInit {
  showPage = true;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
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
    private sharedService: SharedServiceService
  ) {
  }

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
    // event['data']
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
    }
  }

  tabledef() {
    this.columnDefs = [
      {
        headerName: 'S no', field: 'counter',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        maxWidth: 100,
        minWidth: 85,
        sortable: true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute name', field: 'field_institute_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_name',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute id', field: 'id',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        maxWidth: 120,
        minWidth: 100,
        sortable: true,
        tooltipField: 'id',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institute email id', field: 'email',
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
        headerName: 'State', field: 'field_institute_state',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 100,
        maxWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_state',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'City', field: 'field_institute_city',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 100,
        maxWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_city',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date', field: 'field_date',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        maxWidth: 140,
        sortable: true,
        tooltipField: 'field_date',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: `Contact person`, field: 'field_first_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'field_first_name',
        getQuickFilterText: (params) => {
          return params.value;
        },
      },
      {
        headerName: 'Job title', field: 'field_institute_title',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        maxWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_title',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Mobile number', field: 'field_institute_mobile_number',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        maxWidth: 140,
        sortable: true,
        tooltipField: 'field_institute_mobile_number',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Comments', field: 'field_insitute_comments',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        maxWidth: 140,
        sortable: true,
        tooltipField: 'field_insitute_comments',
        getQuickFilterText: (params) => {
          return params.value;
        },
        valueGetter: (params) => {
          return params.data.field_insitute_comments ? params.data.field_insitute_comments : '-';
        },
      },
      {
        headerName: 'Status', field: 'admin_status',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 120,
        maxWidth: 140,
        sortable: true,
        tooltipField: 'admin_status',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          if (params &&  params['data'] && params['data']['admin_status'] == 'Approved') {
            return `<span class="green-1"> Approved </span>`;
          } 
          if (params &&  params['data'] && params['data']['admin_status'] == 'Rejected') {
            return `<span class="red-1"> Rejected </span>`;
          } else {
            return `-`;
          }
        },
      },
    ];
    this.getUsersList();
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }
  }


  // To get all users
  getUsersList() {
    this.adminService.instituteListAfterBulkUpload().subscribe((data1: any) => {
      this.appConfig.hideLoader();

      this.userList = data1 ? data1 : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
        element['time'] = element && element['time'] ? element['time'] : '';
        const fn = element && element.field_first_name ? element.field_first_name : '';
        const ln = element && element.field_institute_last_name ? element.field_institute_last_name : '';
        element.field_first_name = fn + ' ' + ln;
        element['field_date'] = element && element['field_date'] ? this.getDateFormat(element['field_date']) : '-';
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

}

