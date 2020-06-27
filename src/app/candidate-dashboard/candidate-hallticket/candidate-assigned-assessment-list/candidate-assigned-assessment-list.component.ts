import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';

@Component({
  selector: 'app-candidate-assigned-assessment-list',
  templateUrl: './candidate-assigned-assessment-list.component.html',
  styleUrls: ['./candidate-assigned-assessment-list.component.scss']
})
export class CandidateAssignedAssessmentListComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['uid', 'name', 'dob', 'time', 'hallticket'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
  ) { }

  ngOnInit() {
    this.getUsersList();
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split.toUpperCase();
      return output;

    } else {
      return '-';
    }
  }

  // To get all users
  getUsersList() {
    // this.adminService.getCandidateListForShortlist().subscribe((datas: any) => {
    //   this.appConfig.hideLoader();
    //   console.log('api', datas);
      const data = [
        {
          uid: '1',
          name: 'Avinash',
          dob: '29-10-1995',
          time: '11:30 AM',
          hallticket: 'Post Graduate',
        },
        {
          uid: '2',
          name: 'Prem',
          dob: '29-10-1995',
          time: '11:30 AM',
          hallticket: 'Post Graduate',
        },
        {
          uid: '3',
          name: 'Hari',
          dob: '29-10-1995',
          time: '11:30 AM',
          hallticket: 'Post Graduate',
        },
        {
          uid: '4',
          name: 'Pradeep',
          dob: '29-10-1995',
          time: '11:30 AM',
          hallticket: 'Post Graduate',
        },
      ];
      this.userList = data;
      // this.userList.forEach(element => {
      //   element.checked = false;
      // });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    // }, (err) => {
    // });
  }

  selectedUser(userDetail) {
    console.log(userDetail);
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
}
