import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-second-level-assessment-reports',
  templateUrl: './second-level-assessment-reports.component.html',
  styleUrls: ['./second-level-assessment-reports.component.scss']
})
export class SecondLevelAssessmentReportsComponent implements OnInit, AfterViewInit {
  visible = false;
  displayedColumns: any[] = ['uid', 'candidate_id', 'start_time', 'end_time', 'time_taken', 'technicial_marks',
    'technical_percentage',
    'english_marks',
    'english_percentage',
    'analytical_mark',
    'analytical_percentage',
    'apptitude_mark',
    'apptitude_percentage',
    'summative_mark',
    'summative_percentage',
    'checked'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  selectedUserDetail: any;
  userList: any;
  displayNoRecords = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  viewDetails: any;

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

  open(element): void {
    this.viewDetails = element;
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  // To get all users
  getUsersList() {
    this.adminService.secondLevelReports().subscribe((datas: any) => {
      this.userList = datas[0];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['uid'] = count;
      });
      this.viewDetails = datas[0][0];
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }, (err) => {
    });
  }

  personalView(details) {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.REPORTS_LIST_VIEW);

  }

  selectedUser(userDetail) {

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
    if(this.dataSource.filteredData.length==0){
      this.displayNoRecords=true;
    }else{
      this.displayNoRecords=false;

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
