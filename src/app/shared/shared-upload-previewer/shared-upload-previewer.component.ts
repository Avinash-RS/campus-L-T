import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-shared-upload-previewer',
  templateUrl: './shared-upload-previewer.component.html',
  styleUrls: ['./shared-upload-previewer.component.scss']
})
export class SharedUploadPreviewerComponent implements OnInit, OnChanges, AfterViewInit {

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
  ) {
  }

  ngOnInit() {
    this.getUsersList();
    if (this.status === 'secondshortlistpreview') {
      this.filterPredicate();
    }
  }
  ngOnChanges() {
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

    if (this.status === 'instituteError') {
      this.displayedColumns = ['field_institute_name', 'email', 'field_institute_state', 'field_institute_city', 'name',
        'field_institute_last_name', 'field_institute_title', 'field_institute_mobile_number', 'reason'];
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

    if (this.status === 'candidateError') {
      this.displayedColumns = ['tag', 'name', 'email', 'reason'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'bulkAssign') {
      this.displayedColumns = ['user_email', 'shortlist_name', 'hr_email', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'bulkAssignError') {
      this.displayedColumns = ['user_email', 'shortlist_name', 'hr_email', 'reason'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'removalofPanelist') {
      this.displayedColumns = ['user_email', 'shortlist_name', 'hr_email', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'removalofPanelistError') {
      this.displayedColumns = ['user_email', 'shortlist_name', 'hr_email', 'reason'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'interview') {
      this.displayedColumns = ['name', 'employee_id', 'email', 'discipline', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'invPanelError') {
      this.displayedColumns = ['name', 'employee_id', 'email', 'discipline', 'reason'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'ICUploadsError') {
      this.displayedColumns = ['email', 'company', 'date', 'time', 'reason'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'ICUploadsSelectedCandidatesError') {
      this.displayedColumns = ['email', 'company', 'hr_offer_reference', 'hr_offer_date', 'offer_validity', 'reason'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'ICUploadsJoinerTemplateError') {
      this.displayedColumns = ['email', 'company', 'cadre', 'designation', 'job_code', 'function', 'sub_function', 'is_ps_no', 'dh_ps_no', 'hr_ps_no', 'reason'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'ICUploadsPMECStatusError') {
      this.displayedColumns = ['email', 'medical_test_date', 'fitness_status', 'description', 'filename', 'reason'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'ICUploadsOfferAcceptanceStatusError') {
      this.displayedColumns = ['email', 'offersent_date', 'offer_status', 'filename', 'reason'];
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

    if (this.status === 'medical_upload') {
      this.displayedColumns = ['email', 'examination_date', 'fitness_status', 'description', 'file_path', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'offer_status_upload') {
      this.displayedColumns = ['email', 'offersent_date', 'offer_status', 'file_path', 'delete'];
      this.userList = this.previewerArray;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.status === 'secondshortlistpreview') {
      this.displayedColumns = ['candidate_id', 'candidate_name', 'email_id', 'shortlisted_status', 'delete'];
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

  filterPredicate() {
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const arr = [];
      data?.data?.candidate_id ? arr.push(data?.data?.candidate_id) : '';
      data?.data?.candidate_name ? arr.push(data?.data?.candidate_name) : '';
      data?.data?.email_id ? arr.push(data?.data?.email_id) : '';
      data?.data?.shortlisted_status ? arr.push(data?.data?.shortlisted_status) : '';
      const jsonS = JSON.stringify(arr).toLowerCase();
      return jsonS.indexOf(filter) != -1;
    };
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
    if (this.status === 'secondshortlistpreview') {
      this.filterPredicate();
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
