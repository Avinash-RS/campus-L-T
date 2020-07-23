import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
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
  displayedColumns: any[] = ['View_Details', 'Assessment_Name', 'Group_Name', 'Shortlisted_candidates', 'Date', 'Time', 'Status', 'Shortlist_By', 'view_Info'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService,
  ) {

   }

  ngOnInit() {
    this.getUsersList();
  }

  getUsersList() {
    this.adminService.interviewPanelShortlist().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.userList = data ? data : [];
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
