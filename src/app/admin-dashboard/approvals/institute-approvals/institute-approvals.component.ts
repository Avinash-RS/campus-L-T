import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import moment from 'moment';

@Component({
  selector: 'app-institute-approvals',
  templateUrl: './institute-approvals.component.html',
  styleUrls: ['./institute-approvals.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InstituteApprovalsComponent implements OnInit, AfterViewInit {

  showPage = true;
  displayedColumns: any[] = ['id', 'field_institute_name', 'email', 'field_institute_state', 'field_institute_city', 'field_date', 'field_time', 'field_first_name', 'approve', 'reject', 'checked'];

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
          uid: '1',
          name: 'SRM Institute of technology',
          mail: 'SRM@gmail.com',
          state: 'Tamilnadu',
          city: 'Chennai',
          date: '29 Mar 2020',
          time: '11:00 AM',
          contact_person: 'Avinash',
          approve: false,
          reject: false,
          checked: false
        },
        {
          uid: '2',
          name: 'SRM Institute of technology',
          mail: 'SRM@gmail.com',
          state: 'Tamilnadu',
          city: 'Chennai',
          date: '29 Mar 2020',
          time: '11:00 AM',
          contact_person: 'Avinash',
          approve: false,
          reject: false,
          checked: false
        },
        {
          uid: '3',
          name: 'SRM Institute of technology',
          mail: 'SRM@gmail.com',
          state: 'Tamilnadu',
          city: 'Chennai',
          date: '29 Mar 2020',
          time: '11:00 AM',
          contact_person: 'Avinash',
          approve: false,
          reject: false,
          checked: false
        },
        {
          uid: '4',
          name: 'SRM Institute of technology SRM Institute of technology',
          mail: 'SRM@gmail.com',
          state: 'Tamilnadu',
          city: 'Chennai',
          date: '29 Mar 2020',
          time: '11:00 AM',
          contact_person: 'Avinash',
          approve: false,
          reject: false,
          checked: false
        },
      ];
      this.userList = data;
      this.userList.forEach(element => {
        element.checked = false;
        element['field_date'] = element && element['field_date'] ? this.getDateFormat(element['field_date']) : '-';
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
    let data;
    if (this.radioCheck) {
      data = {
        status: 'approve',
        instituteName: this.selectedUserDetail['field_institute_name']
      };
    }
    if (this.rejectCheck) {
      data = {
        status: 'reject',
        instituteName: this.selectedUserDetail['field_institute_name']
      };
    }
    this.openDialog(ShortlistBoxComponent, data);
  }

  apiSubmit(data) {
    let apiData;
    if (data['status'] === 'approve') {
      apiData = [
        {
          id: this.selectedUserDetail && this.selectedUserDetail['id'] ? this.selectedUserDetail['id'] : '',
          name: this.selectedUserDetail && this.selectedUserDetail['field_first_name'] ? this.selectedUserDetail['field_first_name'] : '',
          field_institute_last_name: this.selectedUserDetail && this.selectedUserDetail['field_institute_last_name'] ? this.selectedUserDetail['field_institute_last_name'] : '',
          field_institute_title: this.selectedUserDetail && this.selectedUserDetail['field_institute_title'] ? this.selectedUserDetail['field_institute_title'] : '',
          field_institute_mobile_number: this.selectedUserDetail && this.selectedUserDetail['field_institute_mobile_number'] ? this.selectedUserDetail['field_institute_mobile_number'] : '',
          field_institute_name: this.selectedUserDetail && this.selectedUserDetail['field_institute_name'] ? this.selectedUserDetail['field_institute_name'] : '',
          email: this.selectedUserDetail && this.selectedUserDetail['email'] ? this.selectedUserDetail['email'] : '',
          field_institute_state: this.selectedUserDetail && this.selectedUserDetail['field_institute_state'] ? this.selectedUserDetail['field_institute_state'] : '',
          field_institute_city: this.selectedUserDetail && this.selectedUserDetail['field_institute_city'] ? this.selectedUserDetail['field_institute_city'] : '',
          field_insitute_comments: this.selectedUserDetail && this.selectedUserDetail['field_insitute_comments'] ? this.selectedUserDetail['field_insitute_comments'] : '',
          field_reject_comments: null,
          status: '0'
        }
      ];
    }
    if (data['status'] === 'reject') {
      apiData = [
        {
          id: this.selectedUserDetail && this.selectedUserDetail['id'] ? this.selectedUserDetail['id'] : '',
          name: this.selectedUserDetail && this.selectedUserDetail['field_first_name'] ? this.selectedUserDetail['field_first_name'] : '',
          field_institute_last_name: this.selectedUserDetail && this.selectedUserDetail['field_institute_last_name'] ? this.selectedUserDetail['field_institute_last_name'] : '',
          field_institute_title: this.selectedUserDetail && this.selectedUserDetail['field_institute_title'] ? this.selectedUserDetail['field_institute_title'] : '',
          field_institute_mobile_number: this.selectedUserDetail && this.selectedUserDetail['field_institute_mobile_number'] ? this.selectedUserDetail['field_institute_mobile_number'] : '',
          field_institute_name: this.selectedUserDetail && this.selectedUserDetail['field_institute_name'] ? this.selectedUserDetail['field_institute_name'] : '',
          email: this.selectedUserDetail && this.selectedUserDetail['email'] ? this.selectedUserDetail['email'] : '',
          field_institute_state: this.selectedUserDetail && this.selectedUserDetail['field_institute_state'] ? this.selectedUserDetail['field_institute_state'] : '',
          field_institute_city: this.selectedUserDetail && this.selectedUserDetail['field_institute_city'] ? this.selectedUserDetail['field_institute_city'] : '',
          field_insitute_comments: this.selectedUserDetail && this.selectedUserDetail['field_insitute_comments'] ? this.selectedUserDetail['field_insitute_comments'] : '',
          field_reject_comments: data['comments'],
          status: '1'
        }
      ];
    }

    this.adminService.approveOrReject(apiData).subscribe((datas: any) => {
      this.appConfig.hideLoader();
      this.appConfig.success(data && data['status'] === 'approve' ? 'Approved' : 'Rejected' + ' Successfully', '');
      this.ngOnInit();
    }, (err) => {

    });
  }

  selectedUser(userDetail) {
    console.log(this.radioCheck);
    this.buttonDisabled = false;
    this.rejectCheck = null;

    console.log(userDetail);

    this.selectedUserDetail = userDetail;
    this.userList.forEach(element => {
      if (element['email'] === userDetail['email']) {
        element['checked'] = true;
      } else {
        element['checked'] = false;
      }
    });
  }

  selectedUserReject(userDetail) {
    console.log(userDetail);
    this.buttonDisabled = false;
    this.radioCheck = null;
    this.selectedUserDetail = userDetail;
    this.userList.forEach(element => {
      if (element['email'] === userDetail['email']) {
        element['checked'] = true;
      } else {
        element['checked'] = false;
      }
    });
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
      if (result && result['status'] === 'approve') {
        this.apiSubmit(result);
      }
      if (result && result['status'] === 'reject') {
        this.apiSubmit(result);
      }
    });
  }

}
