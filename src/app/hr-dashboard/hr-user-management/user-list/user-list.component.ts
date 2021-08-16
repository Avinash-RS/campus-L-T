import { Component, OnInit, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { MatDialog } from '@angular/material';
// import all Enterprise modules
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);

import { GridChartsModule } from '@ag-grid-enterprise/charts';
ModuleRegistry.registerModules([GridChartsModule]);
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  selectedUserDetail: any;
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
    filter:true,
    suppressSizeToFit: true,
  };
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  public gridColumnApi;
  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.tabledef();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
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
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
     
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
        headerName: 'S no', 
        field: 'counter',
        filter: 'agNumberColumnFilter',
        minWidth: 50,
        sortable: true,
        resizable:true,
        tooltipField: 'counter',
        filterParams: {
          buttons: ['reset'],
        },
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        resizable:true,
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email id', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 250,
        sortable: true,
        resizable:true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Role', field: 'role',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'role',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Employee id', field: 'field_employee_id',
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        sortable: true,
        resizable:true,
        tooltipField: 'field_employee_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'field_panel_discipline',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'field_panel_discipline',
      getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Uploaded by', field: 'field_uploaded_by',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        resizable:true,
        tooltipField: 'field_uploaded_by',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Delete', field: 'user_id',
        filter: false,
        cellStyle: { textAlign: 'center', 'display': 'flex', 'align-items': 'center' },
        cellRenderer: (params) => {
          return `<button class="submit agTable" mat-raised-button><span style="margin-right: .25em;"><img src="assets/images/delete-white-18dp.svg" alt="" srcset=""></span><span> Remove</span></button>`;
        },
        minWidth: 120,
      }
    ];
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    this.adminService.hruserList().subscribe((data: any) => {

      this.userList = data ? data : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
        element.uid = element.user_id;
        element.checked = false;
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  deleteUser() {
    const removeUser = {
      'user_id': this.selectedUserDetail.user_id
    };

    this.adminService.hrDeleteUser(removeUser).subscribe((success: any) => {

      this.appConfig.success(`User has been removed Successfully`, '');
      this.tabledef();
    }, (error) => {
    });
  }

  removeUser(userDetail) {
    const data = {
      iconName: '',
      dataToBeShared: {
        confirmText: 'Are you sure you want to delete this user?',
        componentData: userDetail,
        type: 'remove',
        identity: 'user-list-delete'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    this.openDialog(ModalBoxComponent, data);
  }

  openDialog(component, data) {
    let dialogDetails: any;
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
      if (result) {
        this.deleteUser();
      }
    });
  }
}
