import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evalution-interviewpanel-form',
  templateUrl: './evalution-interviewpanel-form.component.html',
  styleUrls: ['./evalution-interviewpanel-form.component.scss']
})
export class EvalutionInterviewpanelFormComponent implements OnInit, AfterViewInit {

  appConstant = CONSTANT.ENDPOINTS;
  displayedColumns: any[] = ['evalution_from_name', 'date', 'time', 'created_by', 'select'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  notShowReject: boolean = true;
  notShowShortlist: boolean = true;
  selectedAssign: any;
  selectedPanelId: any;
  selectedFormArr: any = [];
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
        icon: '002-cv.svg',
        name: 'Candidate details',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS
      },
      {
        icon: '002-cv.svg',
        name: 'Interview panel',
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL,
        active: true
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.selectedAssign = JSON.parse(this.appConfig.getLocalData('hrEvalutionInterviewPanel'));
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    this.adminService.getInterviewPanelFormlist().subscribe((datas: any) => {
      this.appConfig.hideLoader();

      const align = datas;
      this.userList = align ? align : [];
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

  selectedUser(userDetail) {
    this.selectedUserDetail = userDetail;
  }

  submit(event) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS_SELECT, '1');
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.selectedPanelId = params['id'];
    });
  }

  confirmForm() {
    let tempObj = {
      'hr_id': this.selectedPanelId,
      'frm_id': this.selectedUserDetail.id,
      'frm_name': this.selectedUserDetail.name
    }
    if (this.appConfig.getLocalData('selectedFormId') != null) {
      this.selectedFormArr = JSON.parse(this.appConfig.getLocalData('selectedFormId'));
      this.selectedFormArr.push(tempObj);
      this.appConfig.setLocalData('selectedFormId', JSON.stringify(this.selectedFormArr));
    } else {
      this.selectedFormArr.push(tempObj);
      this.appConfig.setLocalData('selectedFormId', JSON.stringify(this.selectedFormArr));
    }

    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS_SELECT)
  }

}
