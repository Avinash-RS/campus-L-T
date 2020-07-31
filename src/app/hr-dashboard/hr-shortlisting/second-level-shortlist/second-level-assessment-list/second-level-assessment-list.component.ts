import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-second-level-assessment-list',
  templateUrl: './second-level-assessment-list.component.html',
  styleUrls: ['./second-level-assessment-list.component.scss']
})
export class SecondLevelAssessmentListComponent implements OnInit, AfterViewInit {

  BASE_URL = environment.API_BASE_URL;

  displayedColumns: any[] = ['uid', 'assement_name', 'date', 'time', 'group_name', 'status', 'no_of_candidate', 'report', 'pdf'];
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
    private candidateService: CandidateMappersService,
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
    this.adminService.assessmentListForSecondLevelShortlist().subscribe((datas: any) => {
      this.appConfig.hideLoader();
      console.log('datas', datas);

      if (datas) {
        this.userList = datas ? datas : [];
        let count = 0;
        this.userList.forEach(element => {
          count = count + 1;
          element['uid'] = count;
        });
      } else {
        this.userList = [];
      }
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }

  selectedUser(userDetail) {
    console.log(userDetail);
  }
  shortlistRedirect(detail) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST, detail['assement_name'] ? {data: detail['assement_name']} : {data: 'none'});
  }
  shortlistedReport(detail) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTED_CANDIDATE_REPORT, detail['assement_name'] ? {data: detail['assement_name']} : {data: 'none'});
  }
  viewReports(selectedCandidate) {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_REPORTS);
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
