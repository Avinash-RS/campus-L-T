import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.scss']
})
export class AssessmentDetailsComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['uid', 'name', 'id', 'status', 'details'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  userList: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Candidate details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.ASSESSMENTDETAILS
      },
      {
        icon: '002-cv.svg',
        name: 'Interview panel',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    // this.adminService.getCandidateListForShortlist().subscribe((datas: any) => {
    this.appConfig.hideLoader();
    const data = [
      {
        name: 'Avinash',
        uid: '232',
        id: '232',
        status: 'Waiting',
        checked: false
      },
      {
        name: 'Avinash',
        uid: '233',
        id: '233',
        status: 'Approved',
        checked: false
      },
      {
        name: 'Avinash',
        uid: '234',
        id: '234',
        status: 'Approved',
        checked: false
      },
      {
        name: 'Avinash',
        uid: '235',
        id: '235',
        status: 'Approved',
        checked: false
      },
    ];
    // console.log('api', datas);
    const align = data;
    this.userList = align ? align : [];
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // }, (err) => {
    // });
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

  view() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_PANEL_EVALUATION);
  }
}
