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

  showPage = true;
  displayedColumns: any[] = ['id', 'assessment_name', 'group_name', 'shortlisted_candidates', 'date', 'time', 'status', 'shortlist_by', 'checked'];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  /* Below code will be used when mat table is inside conditional statement */
  // @ViewChild(MatPaginator, { static: false }) set contents(paginator: MatPaginator) {
  //   this.dataSource.paginator = paginator;
  // }
  // @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
  //   this.dataSource.sort = sort;
  // }
  selectedUserDetail: any;
  userList: any;
  radioCheck;
  rejectCheck;
  buttonDisabled = true;

  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');

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
        router: CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_ASSESSMENT_LIST
      },
    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    this.adminService.instituteListForApprovals().subscribe((data: any) => {
      console.log('dataadadad', data);
      this.appConfig.hideLoader();

      const datas = [
        {
          id: '1',
          assessment_name: 'SRM Institute of technology',
          group_name: 'SRM@gmail.com',
          shortlisted_candidates: 'Tamilnadu',
          date: '29 Mar 2020',
          time: '11:00 AM',
          status: 'waiting',
          shortlist_by: 'Avin',
          assessment_date: '29 Mar 2020',
          assessment_venue: 'Chennaisfsfsfsfsf sfsf sfsfsfsf',
          assessment_time: '11:00 AM',
          total_candidates: '100',
          selected_candidates: '20',
          shortlist_by_email: 'avin@gmail.com',
          checked: false
        },
        {
          id: '2',
          assessment_name: 'SRM Institute of technology',
          group_name: 'SRM@gmail.com',
          shortlisted_candidates: 'Tamilnadu',
          date: '29 Mar 2020',
          time: '11:00 AM',
          status: 'waiting',
          shortlist_by: 'Avin',
          assessment_date: '29 Mar 2020',
          assessment_venue: 'Chennai',
          assessment_time: '11:00 AM',
          total_candidates: '100',
          selected_candidates: '20',
          shortlist_by_email: 'avin@gmail.com',
          checked: false
        },
        {
          id: '3',
          assessment_name: 'SRM Institute of technology',
          group_name: 'SRM@gmail.com',
          shortlisted_candidates: 'Tamilnadu',
          date: '29 Mar 2020',
          time: '11:00 AM',
          status: 'waiting',
          shortlist_by: 'Avin',
          assessment_date: '29 Mar 2020',
          assessment_venue: 'Chennai',
          assessment_time: '11:00 AM',
          total_candidates: '100',
          selected_candidates: '20',
          shortlist_by_email: 'avin@gmail.com',
          checked: false
        },
        {
          id: '4',
          assessment_name: 'SRM Institute of technology',
          group_name: 'SRM@gmail.com',
          shortlisted_candidates: 'Tamilnadu',
          date: '29 Mar 2020',
          time: '11:00 AM',
          status: 'waiting',
          shortlist_by: 'Avin',
          assessment_date: '29 Mar 2020',
          assessment_venue: 'Chennai',
          assessment_time: '11:00 AM',
          total_candidates: '100',
          selected_candidates: '20',
          shortlist_by_email: 'avin@gmail.com',
          checked: false
        },
      ];
      this.userList = datas;
      // this.userList.forEach(element => {
      //   element.checked = false;
      //   element['field_date'] = element && element['field_date'] ? this.getDateFormat(element['field_date']) : '-';
      // });
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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }
  }


  submit(event) {
    event.stopPropagation();
    console.log(this.radioCheck, this.rejectCheck);
    console.log(this.selectedUserDetail);
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST);
  }

  selectedUser(userDetail) {
    console.log(userDetail);
  }

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    // dialogDetails = {
    //   iconName: data.iconName,
    //   showCancel: data.showCancel,
    //   showConfirm: data.showConfirm,
    //   showOk: data.showOk,
    //   dataToBeShared: data.sharedData,
    // };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result, result.status);
      if (result) {
      }
    });
  }

}

