import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-inv-assessment-shortlisted-candidates',
  templateUrl: './inv-assessment-shortlisted-candidates.component.html',
  styleUrls: ['./inv-assessment-shortlisted-candidates.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InvAssessmentShortlistedCandidatesComponent implements OnInit, AfterViewInit {

  appConstant = CONSTANT.ENDPOINTS;
  showPage = true;
  selectedUserDetail: any;
  userList: any;
  buttonDisabled = true;
  displayedColumns: any[] = ['uid', 'Assessment_Name', 'shortlist_name', 'Shortlisted_candidates', 'Date', 'Time', 'evaluation_status', 'shortlistby', 'view_Info'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Shortlisted candidate',
        router: CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_ASSESSMENT_LIST
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.getUsersList();
  }

  getUsersList() {
    const apiData = {
      inv_id: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
    };
    this.adminService.invEvaluationAssessmentDetails(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const fileteringInvAssignOnly = data ? data : [];
      this.userList = [];
      let count = 0;
      fileteringInvAssignOnly.forEach(element => {
        // if (element && element['hr_status'] == '1') {
          count = count + 1;
          element['uid'] = count;
          this.userList.push(element);
        // }
      });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
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

  particularAssessment(AssessmentName) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST, { data: AssessmentName });
  }
}

