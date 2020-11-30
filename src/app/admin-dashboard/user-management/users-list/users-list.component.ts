import { Component, OnInit, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  showPage = true;
  displayNoRecords = false;
  pageEvent: any;

  selectedUserDetail: any;
  userList: any;
  radioCheck;

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

    // Rxjs subject for update user list
    this.rxjsUpdateUserList();
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
    if (event.colDef.field === 'user_id') {
      this.selectedUserDetail = event['data'] ? event['data'] : '';
      this.removeUser(this.selectedUserDetail);  
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
        minWidth: 140,
        sortable: true,
        tooltipField: 'counter',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        // comparator: this.customComparator,
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
        headerName: 'Role', field: 'roles_target_id',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'roles_target_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Delete', field: 'user_id',
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center' },
        cellRenderer: (params) => {
          return `<button class="submit agTable" mat-raised-button><span style="margin-right: .25em;"><img src="assets/images/delete-white-18dp.svg" alt="" srcset=""></span><span> Remove</span></button>`;
        },
        minWidth: 120,
        maxWidth: 120,
      }
    ];
    this.getUsersList();
  }


  // To get all users
  getUsersList() {
    this.adminService.userList().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.userList = data ? data : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
        element.checked = false;
        element['user_id'] = element['uid'];
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  removeUser(userDetail) {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Are you sure you want to delete this user?',
        componentData: userDetail,
        type: 'delete',
        identity: 'user-list-delete'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    this.appConfig.openDialog(ModalBoxComponent, data);
  }

  editUser() {
    this.appConfig.routeNavigationWithParam(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_EDIT_USER, this.selectedUserDetail.uid);
  }

  // Rxjs subject for update user list
  rxjsUpdateUserList() {
    this.sharedService.updateUserlist.subscribe((data) => {
      this.tabledef();
    }, (err) => {

    });
  }

}
