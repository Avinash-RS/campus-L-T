import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';

@Component({
  selector: 'app-admin-uploaded-institute-list',
  templateUrl: './admin-uploaded-institute-list.component.html',
  styleUrls: ['./admin-uploaded-institute-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminUploadedInstituteListComponent implements OnInit, AfterViewInit {
  showPage = true;
  displayedColumns: any[] = ['counter', 'field_user_name', 'email', 'field_institute_state', 'field_institute_city', 'field_date', 'field_time', 'field_institute_name', 'upload_registration'];
  // displayedColumns = ['name', 'weight', 'symbol', 'position'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedUserDetail: any;
  userList: any;
  radioCheck;

  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService
  ) {
  }

  ngOnInit() {
    this.getUsersList();
  }

  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
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


  // To get all users
  getUsersList() {
    this.adminService.instituteListAfterBulkUpload().subscribe((data1: any) => {
      this.appConfig.hideLoader();
      console.log(data1);

      this.userList = data1 ? data1 : [];
      this.userList.forEach(element => {
        element['time'] = element && element['time'] ? this.tConvert(element['time']) : '';
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

  selectedUser(userDetail) {
    console.log(userDetail);

  }


}

