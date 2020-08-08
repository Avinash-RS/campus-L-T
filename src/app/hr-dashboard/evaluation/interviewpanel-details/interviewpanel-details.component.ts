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

  displayedColumns: any[] = ['uid', 'name', 'id', 'level', 'institute', 'discipline', 'checked'];
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

  constructor(private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog) { }

  ngOnInit() {
    this.selectedAssign = JSON.parse(this.appConfig.getLocalData('hrEvalutionInterviewPanel'));
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    let assessment = {
      'assement_name': this.selectedAssign.assement_name
    }
    this.adminService.getEvaluationCandidateData(assessment).subscribe((datas: any) => {
      this.appConfig.hideLoader();
      
      console.log('api', datas);
      const align = datas;
      this.userList = align ? align : [];
      this.toShoworNotShowFilter();
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }

  selectAllCheckbox(checked) {
    console.log(this.dataSource);

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
    console.log(this.userList);
    this.toShoworNotShowFilter();
  }

  toShoworNotShowFilter() {
    let runElse = true;
    let selectedCount = 0;
    this.userList.forEach(element => {
      if (element.checked) {
        selectedCount += 1;
        this.notShowReject = false;
        this.notShowShortlist = false;
        runElse = false;
      } else {
        if (runElse) {
          this.notShowReject = true;
          this.notShowShortlist = true;
        }
      }
    });
  }

  unselectSelectALL() {
    console.log(this.userList);

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
    if(this.selectedCandidateId.length == 0){
      this.selectedCandidateId.push(userDetail.candidate_id);
    }else{
      if(this.selectedCandidateId.indexOf(userDetail.candidate_id) !== -1){
        this.selectedCandidateId.splice(this.selectedCandidateId.indexOf(userDetail.candidate_id), 1);
      } else{
        this.selectedCandidateId.push(userDetail.candidate_id);
      }
    }

    this.appConfig.setLocalData('hrEvaluationInterviewSelectedCandidate', JSON.stringify(this.selectedCandidateId));
    this.toShoworNotShowFilter();
    this.unselectSelectALL();
  }

  submit() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.INTERVIEW_PANEL_DETAILS_SELECT);
  }

}
