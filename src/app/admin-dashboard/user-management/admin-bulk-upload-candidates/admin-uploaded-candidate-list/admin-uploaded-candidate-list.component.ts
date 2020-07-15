import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-admin-uploaded-candidate-list',
  templateUrl: './admin-uploaded-candidate-list.component.html',
  styleUrls: ['./admin-uploaded-candidate-list.component.scss']
})
export class AdminUploadedCandidateListComponent implements OnInit, AfterViewInit {
  showPage = true;
  displayedColumns: any[] = ['counter', 'tag', 'name', 'id', 'email', 'uploaded_by', 'uploader_role', 'date', 'time'];
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

  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
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
      this.userList = data1 ? data1 : [];
      this.userList.forEach(element => {
        element['time'] = element && element['time'] ? this.tConvert(element['time']) : '';
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

