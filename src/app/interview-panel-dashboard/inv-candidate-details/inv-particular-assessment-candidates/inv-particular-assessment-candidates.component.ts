import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-inv-particular-assessment-candidates',
  templateUrl: './inv-particular-assessment-candidates.component.html',
  styleUrls: ['./inv-particular-assessment-candidates.component.scss']
})
export class InvParticularAssessmentCandidatesComponent implements OnInit, AfterViewInit {


  // displayedColumns: any[] = ['uid', 'name', 'mail', 'roles_target_id', 'checked'];
  displayedColumns: any[] = ['uid', 'name', 'id', 'status', 'details', 'checked'];
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
        name: 'Shortlisted candidate',
        router: CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST
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
      this.toShoworNotShowFilter();
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    // }, (err) => {
    // });
  }

  selectAllCheckbox(checked) {
    console.log(this.dataSource);

    if (checked['checked']) {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.uid === ele.uid) {
            element.checked = true;
          }
        });
      });
    } else {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.uid === ele.uid) {
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
      if (element.uid === userDetail.uid) {
        element.checked = !element.checked;
      }
    });
    this.selectedUserDetail = userDetail;
    this.toShoworNotShowFilter();
    console.log(userDetail);
    this.unselectSelectALL();
  }

  submit(event) {

  }

}
