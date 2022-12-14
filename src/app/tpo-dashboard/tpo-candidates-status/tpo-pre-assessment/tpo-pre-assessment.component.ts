import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';
import moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-tpo-pre-assessment',
  templateUrl: './tpo-pre-assessment.component.html',
  styleUrls: ['./tpo-pre-assessment.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TpoPreAssessmentComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['uid', 'new_candidate_id', 'mail_sent', 'registered', 'profile_submit', 'profile_shortlist', 'assement'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  dateFrom = new FormControl('');
  dateTo = new FormControl('');
  endDateValidation: boolean;
  dateValidation: boolean;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  folderLists: any;
  tagLists: any;
  shortlistLists: any;
  folderValue = new FormControl('');
  tagValue = new FormControl('');
  shortlistValue = new FormControl('');

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
  ) { }

  ngOnInit() {
    this.getUsersList();
    this.getFolderNames();
    this.getTagNames();
    this.getShortlistNames();
  }

  getFolderNames() {
    this.adminService.TPOStatusFolderLists().subscribe((data: any) => {
      this.folderLists = data && data ? data : [];

    }, (err) => {

    });
  }
  getTagNames() {
    let loggedInUserRole = this.appConfig.getLocalData('roles')
    let  dataObj = {
      'current_user_id': ''
    }
    if(loggedInUserRole == 'institute'){
      dataObj.current_user_id = this.appConfig.getLocalData('userId');
    }
    this.adminService.TPOStatusTagLists(dataObj).subscribe((data: any) => {
      this.tagLists = data && data ? data : [];

    }, (err) => {

    });
  }
  getShortlistNames() {
    this.adminService.TPOStatusShortlistLists().subscribe((data: any) => {
      this.shortlistLists = data && data ? data : [];

    }, (err) => {

    });
  }

  // To get all users
  getUsersList() {
    const apiData = {
      get_assement_type: 'pre',
      get_created_by: this.appConfig.getLocalData('userId'),
      get_folder_name: '',
      get_shortlist_name: '',
      get_tag_name: '',
      date1_get: '',
      date2_get: ''
    };
    this.adminService.getTPOStatus(apiData).subscribe((data: any) => {

      this.userList = data ? data : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['uid'] = count;
      });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }

  onChangeApiHit(apiData) {
    this.adminService.getTPOStatus(apiData).subscribe((data: any) => {


      if (data) {
        this.userList = data ? data : [];
        let count = 0;
        this.userList.forEach(element => {
          count = count + 1;
          element['uid'] = count;
        });
      }
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }
  selectChange() {
    const apiData = {
      get_assement_type: 'pre',
      get_created_by: this.appConfig.getLocalData('userId'),
      get_folder_name: this.folderValue.value ? this.folderValue.value : '',
      get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
      get_tag_name: this.tagValue.value ? this.tagValue.value : '',
      date1_get: this.getAPIDateFormat(this.dateFrom.value),
      date2_get: this.getAPIDateFormat(this.dateTo.value)
    };
    this.onChangeApiHit(apiData);
  }

  selectedUser(userDetail) {
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;
    } else {
      return '';
    }
  }
  getAPIDateFormat(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
      const output = split;
      return output;
    } else {
      return '';
    }
  }
  // Apply Date Filter
  applyDateFilter() {
    // Change Date format to yyyy-mm-dd and date Validation
    if (!this.dateFrom.value && !this.dateTo.value) {
      this.dateFrom.setValue('');
      this.dateTo.setValue('');
      this.dateValidation = false;
      this.endDateValidation = false;
    } else {
      if ((this.dateFrom.value && !this.dateTo.value) || (!this.dateFrom.value && this.dateTo.value)) {
        this.endDateValidation = false;
        this.dateValidation = true;
      } else {
        this.dateValidation = false;
        const momentDate = new Date(this.dateFrom.value);
        const startDate = moment(momentDate).format('YYYY-MM-DD');
        const momentDate1 = new Date(this.dateTo.value);
        const endDate = moment(momentDate1).format('YYYY-MM-DD');
        if (momentDate.getTime() > momentDate1.getTime()) {
          this.endDateValidation = true;
        } else {
          this.endDateValidation = false;
          const apiData = {
            get_assement_type: 'pre',
            get_created_by: this.appConfig.getLocalData('userId'),
            get_folder_name: this.folderValue.value ? this.folderValue.value : '',
            get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
            get_tag_name: this.tagValue.value ? this.tagValue.value : '',
            date1_get: this.getAPIDateFormat(this.dateFrom.value),
            date2_get: this.getAPIDateFormat(this.dateTo.value)
          };
          this.onChangeApiHit(apiData);
        }
      }
    }
  }
  confirmDate() {
    this.applyDateFilter();
  }
  cancelDate() {
    this.dateFrom.setValue('');
    this.dateTo.setValue('');
    this.endDateValidation = false;
    this.dateValidation = false;
    const apiData = {
      get_assement_type: 'pre',
      get_created_by: this.appConfig.getLocalData('userId'),
      get_folder_name: this.folderValue.value ? this.folderValue.value : '',
      get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
      get_tag_name: this.tagValue.value ? this.tagValue.value : '',
      date1_get: '',
      date2_get: ''
    };
    this.onChangeApiHit(apiData);
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

}

