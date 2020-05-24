import { Component, OnInit, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  dummyData = [
    {
      sno: 1,
      name: 'avi',
      checked: false,
      email: 'avi@gmail.com',
      role: 'hr'
    },
    {
      sno: 2,
      name: 'prem',
      checked: false,
      email: 'prem@gmail.com',
      role: 'hr'
    },
    {
      sno: 3,
      name: 'catherine',
      checked: false,
      email: 'catherine@gmail.com',
      role: 'hr'
    },
    {
      sno: 4,
      name: 'hari',
      checked: false,
      email: 'hari@gmail.com',
      role: 'hr'
    },
    {
      sno: 5,
      name: 'pradeep',
      checked: false,
      email: 'pradeep@gmail.com',
      role: 'hr'
    },
    {
      sno: 6,
      name: 'srividhya',
      checked: false,
      email: 'srividhya@gmail.com',
      role: 'hr'
    },
    {
      sno: 7,
      name: 'bala',
      checked: false,
      email: 'bala@gmail.com',
      role: 'hr'
    },
    {
      sno: 8,
      name: 'mohan',
      checked: false,
      email: 'mohan@gmail.com',
      role: 'hr'
    },
    {
      sno: 9,
      name: 'akash',
      checked: false,
      email: 'akash@gmail.com',
      role: 'hr'
    },
    {
      sno: 10,
      name: 'aaron',
      checked: false,
      email: 'aaron@gmail.com',
      role: 'hr'
    }
  ];
  showPage = true;
  displayedColumns: any[] = ['sno', 'name', 'email', 'role', 'checked'];
  dataSource: MatTableDataSource<any>;

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

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private subjectService: SharedServiceService
  ) {
    this.dataSource = new MatTableDataSource(this.dummyData);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectedUser(userDetail) {
    this.selectedUserDetail = userDetail;
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
    this.appConfig.routeNavigationWithParam(`./${CONSTANT.ROUTES.ADMIN_DASHBOARD.HOME}/${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT}/${CONSTANT.ROUTES.ADMIN_DASHBOARD.USER_MANAGEMENT_EDIT_USER}`, this.selectedUserDetail.sno);
  }

}
