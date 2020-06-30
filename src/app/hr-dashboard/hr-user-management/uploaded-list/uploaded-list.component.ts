import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-uploaded-list',
  templateUrl: './uploaded-list.component.html',
  styleUrls: ['./uploaded-list.component.scss']
})
export class UploadedListComponent implements OnInit, AfterViewInit {
  showPage = true;
  displayedColumns: any[] = ['counter', 'field_tag', 'field_user_name', 'uid', 'usermail', 'field_user_created_by', 'field_created_role', 'created', 'created_1'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

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
  }

  // To get all users
  getUsersList() {
    this.adminService.alreadyUploadedDetails().subscribe((data1: any) => {
      this.appConfig.hideLoader();
      console.log(data1);

      // const data = [
      //   {
      //     uid: '1',
      //     tag: '2019_Kowsalya',
      //     name: 'Avinash',
      //     candidateId: '213',
      //     email: 'avinashcarr@gmail.com',
      //     uploadedBy: 'Someone',
      //     role: 'Administrator',
      //     date: '29-10-1995',
      //     time: '11:30 AM',
      //   },
      //   {
      //     uid: '2',
      //     tag: '2019_Kowsalya',
      //     name: 'Prem',
      //     candidateId: '213',
      //     email: 'avinashcarr@gmail.com',
      //     uploadedBy: 'Someone',
      //     role: 'HR',
      //     date: '29-10-1995',
      //     time: '11:30 AM',
      //   },
      //   {
      //     uid: '3',
      //     tag: '2019_Kowsalya',
      //     name: 'Hari',
      //     candidateId: '213',
      //     email: 'avinashcarr@gmail.com',
      //     uploadedBy: 'Someone',
      //     role: 'Administrator',
      //     date: '29-10-1995',
      //     time: '11:30 AM',
      //   },
      //   {
      //     uid: '4',
      //     tag: '2019_Kowsalya',
      //     name: 'Pradeep',
      //     candidateId: '213',
      //     email: 'avinashcarr@gmail.com',
      //     uploadedBy: 'Someone',
      //     role: 'HR',
      //     date: '29-10-1995',
      //     time: '11:30 AM',
      //   },
      // ];
      this.userList = data1;
      this.userList.forEach(element => {
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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectedUser(userDetail) {
    console.log(userDetail);

  }


}
