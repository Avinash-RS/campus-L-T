import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-shared-upload-previewer',
  templateUrl: './shared-upload-previewer.component.html',
  styleUrls: ['./shared-upload-previewer.component.scss']
})
export class SharedUploadPreviewerComponent implements OnInit, AfterViewInit {

  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;
  @Input() status;
  @Input() previewerArray;

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

  // To get all users
  getUsersList() {
    if (this.status === 'institute') {
      this.displayedColumns = ['field_institute_name', 'email', 'field_institute_state', 'field_institute_city', 'name',
        'field_institute_last_name', 'field_institute_title', 'field_institute_mobile_number', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'candidate') {
      this.displayedColumns = ['tag', 'name', 'email', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'resultUpload') {
      this.displayedColumns = ['user_email', 'college', 'hr_email', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'interview') {
      this.displayedColumns = ['name', 'employeeId', 'email', 'discipline', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    
    if (this.status === 'selectedCandidates') {
      this.displayedColumns = ['email', 'name', 'reference', 'offDate', 'offValidity', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'hrMapping') {
      this.displayedColumns = ['email', 'cadre', 'designation', 'doj', 'job_code', 'function1', 'sub_function', 'is_ps_no', 'dh_ps_no', 'hr_ps_no', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'decliners_upload') {
      this.displayedColumns = ['email', 'remarks', 'decline', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

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
    this.selectedUserDetail = userDetail;
  }

  removeSelectedCandidate(i) {
    this.userList.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
