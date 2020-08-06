import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SharedServiceService } from 'src/app/services/shared-service.service';
@Component({
  selector: 'app-evaluation-candidate-details',
  templateUrl: './evaluation-candidate-details.component.html',
  styleUrls: ['./evaluation-candidate-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EvaluationCandidateDetailsComponent implements OnInit {
  appConstant = CONSTANT.ENDPOINTS;
  showPage = true;
  selectedUserDetail: any;
  userList: any;
  buttonDisabled = true;
  displayedColumns: any[] = ['uid', 'Assessment_Name', 'Group_Name', 'Shortlisted_candidates', 'Date', 'Time', 'Status', 'Shortlist_By', 'view_Info'];
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
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS
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

  getUsersList() {
    this.adminService.hrEvaluationAssessmentDetails().subscribe((data: any) => {
      this.appConfig.hideLoader();
      console.log(data);

      const datas = [
        {
          id: '1',
          Assessment_Name: 'SRM Institute of technology',
          Group_Name: 'SRM@gmail.com',
          Date: '29 Mar 2020',
          Time: '11:00 AM',
          Status: 'waiting',
          Shortlist_By: 'Avin',
          Assessment_venue: 'Chennaisfsfsfsfsf sfsf sfsfsfsf',
          Total_Candidates: '100',
          Shortlisted_candidates: '20',
          email: 'avin@gmail.com',
          checked: false
        },
        {
          id: '2',
          Assessment_Name: 'SRM Institute of technology',
          Group_Name: 'SRM@gmail.com',
          Date: '29 Mar 2020',
          Time: '11:00 AM',
          Status: 'waiting',
          Shortlist_By: 'Avin',
          Assessment_venue: 'Chennaisfsfsfsfsf sfsf sfsfsfsf',
          Total_Candidates: '100',
          Shortlisted_candidates: '20',
          email: 'avin@gmail.com',
          checked: false
        },
        {
          id: '3',
          Assessment_Name: 'SRM Institute of technology',
          Group_Name: 'SRM@gmail.com',
          Date: '29 Mar 2020',
          Time: '11:00 AM',
          Status: 'waiting',
          Shortlist_By: 'Avin',
          Assessment_venue: 'Chennaisfsfsfsfsf sfsf sfsfsfsf',
          Total_Candidates: '100',
          Shortlisted_candidates: '20',
          email: 'avin@gmail.com',
          checked: false
        },
        {
          id: '4',
          Assessment_Name: 'SRM Institute of technology',
          Group_Name: 'SRM@gmail.com',
          Date: '29 Mar 2020',
          Time: '11:00 AM',
          Status: 'waiting',
          Shortlist_By: 'Avin',
          Assessment_venue: 'Chennaisfsfsfsfsf sfsf sfsfsfsf',
          Total_Candidates: '100',
          Shortlisted_candidates: '20',
          email: 'avin@gmail.com',
          checked: false
        },
      ];

      this.userList = datas ? datas : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['uid'] = count;
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
}
