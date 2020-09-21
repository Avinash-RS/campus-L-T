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
export class UsersListComponent implements OnInit, AfterViewInit {

  showPage = true;
  displayedColumns: any[] = ['counter', 'name', 'email', 'roles_target_id', 'checked'];
  dataSource: MatTableDataSource<any>;
  displayNoRecords = false;
  pageEvent: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  /* Below code will be used when mat table is inside conditional statement */
  // @ViewChild(MatPaginator, { static: false }) set contents(paginator: MatPaginator) {
  //   this.dataSource.paginator = paginator;
  // }
  // @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
  //   this.dataSource.sort = sort;
  // }
  selectedUserDetail: any;
  userList: any;
  radioCheck;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService
  ) {
  }

  ngOnInit() {
    this.getUsersList();

    // Rxjs subject for update user list
    this.rxjsUpdateUserList();
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
      });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // check search data is available or not
    if (this.dataSource.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectedUser(userDetail) {
    this.selectedUserDetail = userDetail;

  }

  //pagination next and previos click
  handlePage(e: any) {
    this.selectedUserDetail = null;
  }

  removeUser() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Are you sure you want to delete this user?',
        componentData: this.selectedUserDetail,
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
      this.getUsersList();
    }, (err) => {

    });
  }

}
