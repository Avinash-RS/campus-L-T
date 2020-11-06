import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.scss']
})
export class AssessmentDetailsComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['count', 'candidate_name', 'candidate_id', 'evaluation_status', 'details'];
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
    console.log(this.activatedRoute);
    
    const subWrapperMenus = [
      {
        icon: 'work.svg',
        name: 'Candidate details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS,
        active: true
      },
      {
        icon: '002-cv.svg',
        name: 'Interview panel',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL
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
      shortlist_name: name,
    };
    this.adminService.hrEvaluationParticularAssessmentDetails(apiData).subscribe((datas: any) => {
      this.appConfig.hideLoader();

      const align = datas;
      this.userList = align ? align : [];
      let counting = 0;
      this.userList.forEach(element => {
        counting = counting + 1;
        element['count'] = counting;
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

  view(cid, name, status, tag, uid) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SUB_ASSESSMENTS,  {data: this.nameOfAssessment, id: cid ? cid : '', name: name ? name : '', status: status ? status : '', tag: tag ? tag: '', uid: uid ? uid : ''});
  }

}
