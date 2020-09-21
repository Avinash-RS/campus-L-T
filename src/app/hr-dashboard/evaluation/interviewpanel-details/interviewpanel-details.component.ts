import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-interviewpanel-details',
  templateUrl: './interviewpanel-details.component.html',
  styleUrls: ['./interviewpanel-details.component.scss']
})
export class InterviewpanelDetailsComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['uid', 'user_name', 'candidate_id', 'level', 'insitute', 'discipline', 'checked'];
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
  selectedCandidateId: any = [];
  buttonHide;
  displayNoRecords = false;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog
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
        router: CONSTANT.ENDPOINTS.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.selectedAssign = JSON.parse(this.appConfig.getLocalData('hrEvalutionInterviewPanel'));
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    let assessment = {
      'assement_name': this.selectedAssign.Assessment_Name
    }
    this.adminService.getEvaluationCandidateData(assessment).subscribe((datas: any) => {
      this.appConfig.hideLoader();

      const align = datas;
      this.userList = align ? align : [];
      this.toShoworNotShowFilter();
      let count = 0;
      this.userList.forEach(element => {
        element['checked'] = false;
        count = count + 1;
        element['uid'] = count;
      });
      count = 0;
      this.userList = this.userList.filter(user => {
        if(user.hr_assign_status == 0){
          count = count + 1;
          user['uid'] = count;
          return user;
        }
      })
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }

  selectAllCheckbox(checked) {

    if (checked['checked']) {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.candidate_id === ele.candidate_id) {
            element.checked = true;
          }
        });
      });
    } else {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.candidate_id === ele.candidate_id) {
            element.checked = false;
          }
        });
      });
    }
    this.getSelectedData();
    this.toShoworNotShowFilter();
  }

  toShoworNotShowFilter() {
    let runElse = true;
    let selectedCount = 0;
    this.userList.forEach(element => {
      if (element.checked) {
        selectedCount += 1;
        this.buttonHide = false;
        runElse = false;
      } else {
        if (runElse) {
          this.buttonHide = true;
        }
      }
    });
  }

  unselectSelectALL() {

    this.selectAllCheck = false;
    const pushChecked = [];
    const pushNotChecked = [];
    this.userList.forEach(element => {
      if (element.checked) {
        pushChecked.push(element);
      } else {
        pushNotChecked.push(element);
      }
    });

    if (this.userList.length === pushChecked.length) {
      this.selectAllCheck = true;
    }
    // if (this.userList.length === pushNotChecked.length) {
    //   this.selectAllCheck = false;
    // }
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

    this.userList.forEach(element => {
      if (element.candidate_id === userDetail.candidate_id) {
        element.checked = !element.checked;
      }
    });
    this.selectedUserDetail = userDetail;

    this.getSelectedData();
    this.toShoworNotShowFilter();
    this.unselectSelectALL();
  }
  // getSelected data
  getSelectedData() {
    this.selectedCandidateId = [];
    this.userList.forEach(element => {
      if (element['checked']) {
        this.selectedCandidateId.push(element.candidate_id);
      }
    });
    this.appConfig.setLocalData('hrEvaluationInterviewSelectedCandidate', JSON.stringify(this.selectedCandidateId));
  }

  submit() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS_SELECT);
  }

}
