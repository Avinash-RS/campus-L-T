import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-inv-shortlisted-candidates-view-screen',
  templateUrl: './inv-shortlisted-candidates-view-screen.component.html',
  styleUrls: ['./inv-shortlisted-candidates-view-screen.component.scss']
})
export class InvShortlistedCandidatesViewScreenComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['count', 'candidate_name', 'uid', 'evaluation_status'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  userList: any;
  assessmentName: any;
  nameOfAssessment: any;
  displayNoRecords = false;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Shortlisted candidate',
        router: CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_SUBMITTED
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.assessmentDetails(params['data']);
      this.getUsersList(params['data']);
    });
  }

  assessmentDetails(name) {
    const apidata = {
      shortlist_name: name
    };
    this.adminService.hrEvaluationParticularAssessmentDetailsHeader(apidata).subscribe((data: any) => {
      // this.appConfig.hideLoader();
      this.assessmentName = data;

    }, (err) => {

    });
  }


  // To get all users
  getUsersList(name) {

    const apiData = {
      assement_name: name,
    };
    this.adminService.invSubmittedCandidatesList(apiData).subscribe((datas: any) => {
      this.appConfig.hideLoader();


      const align = datas ? datas : [];
      let counting = 0;
      this.userList = [];
      align.forEach(element => {
        if (element && element['hr_assign_status'] == '1') {
          counting = counting + 1;
          element['count'] = counting;
          this.userList.push(element);
        }
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

