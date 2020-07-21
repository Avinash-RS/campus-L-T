import { Component, OnInit, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: any[] = ['uid', 'name', 'email', 'role', 'field_employee_id', 'field_panel_discipline', 'field_uploaded_by', 'checked'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  userListIndex;

  constructor(private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private matDialog: MatDialog) { }

  ngOnInit() {
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    this.adminService.hruserList().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.userList = data;
      this.userList.forEach(element => {
        element.uid = element.user_id;
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

  selectedUser(userDetail, i) {
    this.selectedUserDetail = userDetail;
    this.userListIndex = i;
  }

  deleteUser(){
    var removeUser = {
      'user_id': this.selectedUserDetail.user_id
    }
    
    this.adminService.hrDeleteUser(removeUser).subscribe((success: any) => {
      this.appConfig.hideLoader();
      this.userList.splice(this.userListIndex, 1);
      this.appConfig.success(`User has been removed Successfully`, '');
      this.selectedUserDetail = null;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
    }, (error) => {
    });
  }

  removeUser() {
    const data = {
      iconName: '',
      dataToBeShared: {
        confirmText: 'Are you sure you want to delete this user?',
        componentData: this.selectedUserDetail,
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
