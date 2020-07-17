import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-tpo-pre-assessment',
  templateUrl: './tpo-pre-assessment.component.html',
  styleUrls: ['./tpo-pre-assessment.component.scss']
})
export class TpoPreAssessmentComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['uid', 'candidate_id', 'mail', 'registered', 'profile_submit', 'profile_shortlist', 'assessment'];
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

  // To get all users
  getUsersList() {
    // this.adminService.firstLevelReports().subscribe((datas: any) => {
    //   this.appConfig.hideLoader();
    //   console.log('api', datas);

      const data = [
        {
          candidate_id: '1234',
          mail: true,
          registered: true,
          profile_submit: true,
          profile_shortlist: true,
          assessment: true
        },
        {
          candidate_id: '3234',
          mail: false,
          registered: true,
          profile_submit: true,
          profile_shortlist: true,
          assessment: true
        },
        {
          candidate_id: '9234',
          mail: true,
          registered: true,
          profile_submit: true,
          profile_shortlist: true,
          assessment: false
        },
        {
          candidate_id: '2234',
          mail: true,
          registered: true,
          profile_submit: false,
          profile_shortlist: true,
          assessment: true
        },
      ];
      if (data) {
        this.userList = data ? data : [];
      }
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

