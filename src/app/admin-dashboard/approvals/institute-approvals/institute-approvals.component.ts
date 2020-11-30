import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import moment from 'moment';

@Component({
  selector: 'app-institute-approvals',
  templateUrl: './institute-approvals.component.html',
  styleUrls: ['./institute-approvals.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InstituteApprovalsComponent implements OnInit {

  showPage = true;

  /* Below code will be used when mat table is inside conditional statement */
  // @ViewChild(MatPaginator, { static: false }) set contents(paginator: MatPaginator) {
  //   this.dataSource.paginator = paginator;
  // }
  // @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
  //   this.dataSource.sort = sort;
  // }
  // <i class="material-icons">done</i>

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  rejectCheck;
  buttonDisabled = true;
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

  status: string;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
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
    if (event.colDef.field === 'approve') {
      this.selectedUserDetail = event['data'] ? event['data'] : '';
      this.submit('approve');
    }
    if (event.colDef.field === 'reject') {
      this.selectedUserDetail = event['data'] ? event['data'] : '';
      this.submit('reject');
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
        headerName: 'S no', field: 'id',
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
        headerName: 'Approve', field: 'approve',
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' },
        cellRenderer: (params) => {
          return `<i style="color: green; cursor: pointer" class="material-icons agCellStyle">done</i>`;
        },
        minWidth: 88,
        maxWidth: 105,
        tooltipField: 'approve'
      },
      {
        headerName: 'Reject', field: 'reject',
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' },
        cellRenderer: (params) => {
          return `<i style="color: #C02222; cursor: pointer;" class="material-icons agCellStyle">close</i>`;
        },
        minWidth: 88,
        maxWidth: 105,
        tooltipField: 'reject',
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
    ];
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    this.adminService.instituteListForApprovals().subscribe((data: any) => {
      this.appConfig.hideLoader();

      this.userList = data ? data : [];
      this.userList.forEach(element => {
        element.checked = false;
        element.approve = 'Approve';
        element.reject = 'Reject';
        const fn = element && element.field_first_name ? element.field_first_name : '';
        const ln = element && element.field_institute_last_name ? element.field_institute_last_name : '';
        element.field_first_name = fn + ' ' + ln;
        element['field_date'] = element && element['field_date'] ? element['field_date'] : '-';
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  submit(confirm) {
    let data;
    if (confirm === 'approve') {
      data = {
        status: 'approve',
        instituteName: this.selectedUserDetail['field_institute_name']
      };
    }
    if (confirm === 'reject') {
      data = {
        status: 'reject',
        instituteName: this.selectedUserDetail['field_institute_name']
      };
    }
    this.openDialog(ShortlistBoxComponent, data);
  }

  apiSubmit(data) {
    let apiData;
    if (data['status'] === 'approve') {
      apiData = [
        {
          id: this.selectedUserDetail && this.selectedUserDetail['id'] ? this.selectedUserDetail['id'] : '',
          name: this.selectedUserDetail && this.selectedUserDetail['field_first_name'] ? this.selectedUserDetail['field_first_name'] : '',
          field_institute_last_name: this.selectedUserDetail && this.selectedUserDetail['field_institute_last_name'] ? this.selectedUserDetail['field_institute_last_name'] : '',
          field_institute_title: this.selectedUserDetail && this.selectedUserDetail['field_institute_title'] ? this.selectedUserDetail['field_institute_title'] : '',
          field_institute_mobile_number: this.selectedUserDetail && this.selectedUserDetail['field_institute_mobile_number'] ? this.selectedUserDetail['field_institute_mobile_number'] : '',
          field_institute_name: this.selectedUserDetail && this.selectedUserDetail['field_institute_name'] ? this.selectedUserDetail['field_institute_name'] : '',
          email: this.selectedUserDetail && this.selectedUserDetail['email'] ? this.selectedUserDetail['email'] : '',
          field_institute_state: this.selectedUserDetail && this.selectedUserDetail['field_institute_state'] ? this.selectedUserDetail['field_institute_state'] : '',
          field_institute_city: this.selectedUserDetail && this.selectedUserDetail['field_institute_city'] ? this.selectedUserDetail['field_institute_city'] : '',
          field_insitute_comments: this.selectedUserDetail && this.selectedUserDetail['field_insitute_comments'] ? this.selectedUserDetail['field_insitute_comments'] : '',
          field_reject_comments: null,
          status: '0'
        }
      ];
    }
    if (data['status'] === 'reject') {
      apiData = [
        {
          id: this.selectedUserDetail && this.selectedUserDetail['id'] ? this.selectedUserDetail['id'] : '',
          name: this.selectedUserDetail && this.selectedUserDetail['field_first_name'] ? this.selectedUserDetail['field_first_name'] : '',
          field_institute_last_name: this.selectedUserDetail && this.selectedUserDetail['field_institute_last_name'] ? this.selectedUserDetail['field_institute_last_name'] : '',
          field_institute_title: this.selectedUserDetail && this.selectedUserDetail['field_institute_title'] ? this.selectedUserDetail['field_institute_title'] : '',
          field_institute_mobile_number: this.selectedUserDetail && this.selectedUserDetail['field_institute_mobile_number'] ? this.selectedUserDetail['field_institute_mobile_number'] : '',
          field_institute_name: this.selectedUserDetail && this.selectedUserDetail['field_institute_name'] ? this.selectedUserDetail['field_institute_name'] : '',
          email: this.selectedUserDetail && this.selectedUserDetail['email'] ? this.selectedUserDetail['email'] : '',
          field_institute_state: this.selectedUserDetail && this.selectedUserDetail['field_institute_state'] ? this.selectedUserDetail['field_institute_state'] : '',
          field_institute_city: this.selectedUserDetail && this.selectedUserDetail['field_institute_city'] ? this.selectedUserDetail['field_institute_city'] : '',
          field_insitute_comments: this.selectedUserDetail && this.selectedUserDetail['field_insitute_comments'] ? this.selectedUserDetail['field_insitute_comments'] : '',
          field_reject_comments: data['comments'],
          status: '1'
        }
      ];
    }

    this.adminService.approveOrReject(apiData).subscribe((datas: any) => {
      this.appConfig.hideLoader();
      this.appConfig.success(data && data['status'] === 'approve' ? 'Approved' : 'Rejected' + ' Successfully', '');
      this.ngOnInit();
    }, (err) => {

    });
  }


  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    // dialogDetails = {
    //   iconName: data.iconName,
    //   showCancel: data.showCancel,
    //   showConfirm: data.showConfirm,
    //   showOk: data.showOk,
    //   dataToBeShared: data.sharedData,
    // };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result['status'] === 'approve') {
        this.apiSubmit(result);
      }
      if (result && result['status'] === 'reject') {
        this.apiSubmit(result);
      }
    });
  }

}
