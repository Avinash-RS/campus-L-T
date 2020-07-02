import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['uid', 'name', 'gender', 'dob', 'institute', 'technical_marks',
    'technical_percentage',
    'english_marks',
    'english_percentage',
    'analytical_marks',
    'analytical_percentage',
    'aptitude_marks',
    'aptitude_percentage',
    'summative_marks',
    'summative_percentage',
    'checked'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  selectedUserDetail: any;
  userList: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    // this.adminService.getCandidateListForShortlist().subscribe((datas: any) => {
    //   console.log('api', datas);
    const data = [
      {
        uid: '1',
        name: '294248',
        gender: '21 Jun 2020 11:10 AM',
        dob: '22 Jun 2020 12:10 AM',
        institute: '114m 45s',
        technical_marks: '65',
        technical_percentage: '65.5%',
        english_marks: '65',
        english_percentage: '65.5%',
        analytical_marks: '65',
        analytical_percentage: '65.5%',
        aptitude_marks: '65',
        aptitude_percentage: '65.5%',
        summative_marks: '65',
        summative_percentage: '65.5%',
        checked: false
      },
      {
        uid: '2',
        name: '3959375',
        gender: '21 Jun 2020 11:10 AM',
        dob: '22 Jun 2020 12:10 AM',
        institute: '114m 45s',
        technical_marks: '65',
        technical_percentage: '65.5%',
        english_marks: '65',
        english_percentage: '65.5%',
        analytical_marks: '65',
        analytical_percentage: '65.5%',
        aptitude_marks: '65',
        aptitude_percentage: '65.5%',
        summative_marks: '65',
        summative_percentage: '65.5%',
        checked: false
      },
      {
        uid: '3',
        name: '979752',
        gender: '21 Jun 2020 11:10 AM',
        dob: '22 Jun 2020 12:10 AM',
        institute: '114m 45s',
        technical_marks: '65',
        technical_percentage: '65.5%',
        english_marks: '65',
        english_percentage: '65.5%',
        analytical_marks: '65',
        analytical_percentage: '65.5%',
        aptitude_marks: '65',
        aptitude_percentage: '65.5%',
        summative_marks: '65',
        summative_percentage: '65.5%',
        checked: false
      },
      {
        uid: '4',
        name: '1342535',
        gender: '21 Jun 2020 11:10 AM',
        dob: '22 Jun 2020 12:10 AM',
        institute: '114m 45s',
        technical_marks: '65',
        technical_percentage: '65.5%',
        english_marks: '65',
        english_percentage: '65.5%',
        analytical_marks: '65',
        analytical_percentage: '65.5%',
        aptitude_marks: '65',
        aptitude_percentage: '65.5%',
        summative_marks: '65',
        summative_percentage: '65.5%',
        checked: false
      },
      {
        uid: '5',
        name: '0947248',
        gender: '21 Jun 2020 11:10 AM',
        dob: '22 Jun 2020 12:10 AM',
        institute: '114m 45s',
        technical_marks: '65',
        technical_percentage: '65.5%',
        english_marks: '65',
        english_percentage: '65.5%',
        analytical_marks: '65',
        analytical_percentage: '65.5%',
        aptitude_marks: '65',
        aptitude_percentage: '65.5%',
        summative_marks: '65',
        summative_percentage: '65.5%',
        checked: false
      },
    ];
    const align = [];
    this.userList = data;
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.appConfig.hideLoader();
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
