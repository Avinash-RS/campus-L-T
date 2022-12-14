import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CONSTANT } from 'src/app/constants/app-constants.service';

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
  selector: 'app-candidate-status',
  templateUrl: './candidate-status.component.html',
  styleUrls: ['./candidate-status.component.scss'],
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
export class CandidateStatusComponent implements OnInit, AfterViewInit, OnDestroy {

  // 'uid',
  // , 'interview_shortlist'
  currentRole = this.appConfig.getLocalData('roles');
  displayedColumns: any[] = this.currentRole == 'institute' ? ['uid', 'new_candidate_id', 'tag_name', 'date', 'mail_sent', 'registered', 'profile_submit', 'profile_shortlist', 'assement', 'assement_shortlist', 'document_submit'] : ['new_candidate_id', 'tag_name', 'institute', 'folder_name', 'shortlist_name', 'date', 'mail_sent', 'registered', 'profile_submit', 'profile_shortlist', 'assement', 'assement_shortlist', 'document_submit'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('myDiv', { static: false }) private myDiv: ElementRef;

  dateFrom = new FormControl('');
  dateTo = new FormControl('');
  endDateValidation: boolean;
  dateValidation: boolean;
  displayNoRecords = false;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  folderLists: any;
  tagLists: any;
  shortlistLists: any;
  folderValue = new FormControl(null);
  tagValue = new FormControl(null);
  shortlistValue = new FormControl(null);
  // serverSide Things
  length;
  pageSize;
  apiPageIndex: any = 1;
  listCount: any = 50;
  normal = true;
  asc = false;
  searchInput: any;
  desc = false;
  sortedCol;
  queryObject: any;
  // MatPaginator Output
  pageEvent: PageEvent;
  overallSelect = false;

  refreshSubscription: Subscription;
  TPOStatusFolderListsSubscription: Subscription;
  TPOStatusTagListsSubscription: Subscription;
  TPOStatusShortlistListsSubscription: Subscription;
  getTPOStatusSubscription: Subscription;
  getTPOStatusSubscription1: Subscription;
  getStatusExcelDownloadSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService
  ) { }

  ngOnInit() {
    const apiData = {
      get_assement_type: 'rec',
      get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
      get_folder_name: this.folderValue.value ? this.folderValue.value : null,
      get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : null,
      get_tag_name: this.tagValue.value ? this.tagValue.value : null,
      date1_get: this.getAPIDateFormat(this.dateFrom.value),
      date2_get: this.getAPIDateFormat(this.dateTo.value),
      start: this.apiPageIndex.toString(),
      counts: this.listCount.toString(),
      order_by: '',
      order_type: '',
      search: this.searchInput ? this.searchInput : ''
    };

    this.getUsersList(apiData);
    this.appConfig.getLocalData('roles') == 'institute' ? '' : this.getFolderNames();
    this.appConfig.getLocalData('roles') == 'institute' ? '' : this.getShortlistNames();
    this.getTagNames();
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.TPOStatusFolderListsSubscription ? this.TPOStatusFolderListsSubscription.unsubscribe() : '';
    this.TPOStatusTagListsSubscription ? this.TPOStatusTagListsSubscription.unsubscribe() : '';
    this.TPOStatusShortlistListsSubscription ? this.TPOStatusShortlistListsSubscription.unsubscribe() : '';
    this.getTPOStatusSubscription ? this.getTPOStatusSubscription.unsubscribe() : '';
    this.getTPOStatusSubscription1 ? this.getTPOStatusSubscription1.unsubscribe() : '';
    this.getStatusExcelDownloadSubscription ? this.getStatusExcelDownloadSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes('status/recruitment')) {
        this.clearAll();
      }
    });
  }

  clearAll() {
    this.apiPageIndex = 1;
    this.listCount = 50;
    this.appConfig.getLocalData('roles') == 'institute' ? '' : this.folderValue.setValue(null, {emitViewToModelChange: false});
    this.appConfig.getLocalData('roles') == 'institute' ? '' : this.shortlistValue.setValue(null, {emitViewToModelChange: false});
    this.tagValue.setValue(null, {emitViewToModelChange: false});
    this.dateFrom.setValue(null);
    this.dateTo.setValue(null);
    this.searchInput = '';
    const apiData = {
      get_assement_type: 'rec',
      get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
      get_folder_name: this.folderValue.value ? this.folderValue.value : null,
      get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : null,
      get_tag_name: this.tagValue.value ? this.tagValue.value : null,
      date1_get: '',
      date2_get: '',
      start: this.apiPageIndex.toString(),
      counts: this.listCount.toString(),
      order_by: '',
      order_type: '',
      search: this.searchInput ? this.searchInput : ''
    };
    this.getUsersList(apiData);
    this.getTagNames();
    this.appConfig.getLocalData('roles') == 'institute' ? '' : this.getFolderNames();
    this.appConfig.getLocalData('roles') == 'institute' ? '' : this.getShortlistNames();
  }
  getFolderNames() {
   this.TPOStatusFolderListsSubscription = this.adminService.TPOStatusFolderLists().subscribe((data: any) => {
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

   this.TPOStatusTagListsSubscription = this.adminService.TPOStatusTagLists(dataObj).subscribe((data: any) => {
      this.tagLists = data && data ? data : [];

    }, (err) => {

    });
  }
  getShortlistNames() {
   this.TPOStatusShortlistListsSubscription = this.adminService.getAllShortlistedShortlistNames_ALL().subscribe((data: any) => {
      this.shortlistLists = data && data ? data : [];
    }, (err) => {

    });
  }

  pageChanged(event) {
    if (event.previousPageIndex > event.pageIndex) {
      // previous button clicked
      this.apiPageIndex = event.pageIndex + 1;
      const apiData = {
        get_assement_type: 'rec',
        get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
        get_folder_name: this.folderValue.value ? this.folderValue.value : '',
        get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
        get_tag_name: this.tagValue.value ? this.tagValue.value : '',
        date1_get: this.getAPIDateFormat(this.dateFrom.value),
        date2_get: this.getAPIDateFormat(this.dateTo.value),
        start: this.apiPageIndex.toString(),
        counts: this.listCount.toString(),
        order_by: '',
        order_type: '',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getUsersList(apiData);
    }
    if (event.previousPageIndex < event.pageIndex) {
      // next button clicked
      this.apiPageIndex = event.pageIndex + 1;
      const apiData = {
        get_assement_type: 'rec',
        get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
        get_folder_name: this.folderValue.value ? this.folderValue.value : '',
        get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
        get_tag_name: this.tagValue.value ? this.tagValue.value : '',
        date1_get: this.getAPIDateFormat(this.dateFrom.value),
        date2_get: this.getAPIDateFormat(this.dateTo.value),
          start: this.apiPageIndex.toString(),
        counts: this.listCount.toString(),
        order_by: '',
        order_type: '',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getUsersList(apiData);
    }
    if (event.pageSize !== this.listCount) {

      this.listCount = event.pageSize;
      this.apiPageIndex = 1;
      const apiData = {
        get_assement_type: 'rec',
        get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
        get_folder_name: this.folderValue.value ? this.folderValue.value : '',
        get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
        get_tag_name: this.tagValue.value ? this.tagValue.value : '',
        date1_get: this.getAPIDateFormat(this.dateFrom.value),
        date2_get: this.getAPIDateFormat(this.dateTo.value),
        start: this.apiPageIndex.toString(),
        counts: this.listCount.toString(),
        order_by: '',
        order_type: '',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getUsersList(apiData);
    }
  }

  applySearch() {
    const apiData = {
      start: this.apiPageIndex.toString(),
      counts: this.listCount.toString(),
      order_by: '',
      order_type: '',
      search: this.searchInput ? this.searchInput : ''
    };
    this.getUsersList(apiData);
  }


  // To get all users
  getUsersList(apiData) {
   this.getTPOStatusSubscription = this.adminService.getTPOStatus(apiData).subscribe((data: any) => {


      this.userList = data && data['result'] ? data['result'] : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['uid'] = count;
      });

      this.dataSource = new MatTableDataSource(this.userList);
      this.length = data && data['count'] ? data['count'] : '0';
      this.triggerFalseClick();
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }
  triggerFalseClick() {
    if (this.myDiv) {

      const el: HTMLElement = this.myDiv.nativeElement as HTMLElement;
      el.focus();
    }
  }

  onChangeApiHit(apiData) {
   this.getTPOStatusSubscription1 = this.adminService.getTPOStatus(apiData).subscribe((data: any) => {


      if (data) {
        // this.userList = data ? data : [];
        this.userList = data && data['result'] ? data['result'] : [];
        let count = 0;
        this.userList.forEach(element => {
          count = count + 1;
          element['uid'] = count;
        });
      }
      this.dataSource = new MatTableDataSource(this.userList);
      this.length = data && data['count'] ? data['count'] : '0';
      this.triggerFalseClick();
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.ngAfterViewInit();
    }, (err) => {
    });
  }
  selectChange() {
    this.listCount = 50;
    this.apiPageIndex = 1;
    const apiData = {
      get_assement_type: 'rec',
      get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
      get_folder_name: this.folderValue.value ? this.folderValue.value : '',
      get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
      get_tag_name: this.tagValue.value ? this.tagValue.value : '',
      date1_get: this.getAPIDateFormat(this.dateFrom.value),
      date2_get: this.getAPIDateFormat(this.dateTo.value),
      start: this.apiPageIndex.toString(),
      counts: this.listCount.toString(),
      order_by: '',
      order_type: '',
      search: this.searchInput ? this.searchInput : ''
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
          this.listCount = 50;
          this.apiPageIndex = 1;
          const apiData = {
            get_assement_type: 'rec',
            get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
            get_folder_name: this.folderValue.value ? this.folderValue.value : '',
            get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
            get_tag_name: this.tagValue.value ? this.tagValue.value : '',
            date1_get: this.getAPIDateFormat(this.dateFrom.value),
            date2_get: this.getAPIDateFormat(this.dateTo.value),
            start: this.apiPageIndex.toString(),
            counts: this.listCount.toString(),
            order_by: '',
            order_type: '',
            search: this.searchInput ? this.searchInput : ''
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
    this.listCount = 50;
    this.apiPageIndex = 1;
    const apiData = {
      get_assement_type: 'rec',
      get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
      get_folder_name: this.folderValue.value ? this.folderValue.value : '',
      get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
      get_tag_name: this.tagValue.value ? this.tagValue.value : '',
      date1_get: '',
      date2_get: '',
      start: this.apiPageIndex.toString(),
      counts: this.listCount.toString(),
      order_by: '',
      order_type: '',
      search: this.searchInput ? this.searchInput : ''
    };
    this.onChangeApiHit(apiData);
  }


  ngAfterViewInit() {
    if (this.dataSource) {
      // this.dataSource.paginator = this.paginator;
      this.length = this.length;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // check search data is available or not
    if (this.dataSource.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  download() {
    const apiData = {
      get_assement_type: 'rec',
      get_created_by: this.appConfig.getLocalData('roles') == 'institute' ? this.appConfig.getLocalData('userId') : '',
      get_folder_name: this.folderValue.value ? this.folderValue.value : '',
      get_shortlist_name: this.shortlistValue.value ? this.shortlistValue.value : '',
      get_tag_name: this.tagValue.value ? this.tagValue.value : '',
      date1_get: this.getAPIDateFormat(this.dateFrom.value),
      date2_get: this.getAPIDateFormat(this.dateTo.value)
    };

   this.getStatusExcelDownloadSubscription = this.adminService.getStatusExcelDownload(apiData).subscribe((data: any) => {


      const excel = data && data[0].url ? data[0].url : '';
      window.open(excel, '_blank');
    }, (err) => {
    });
  }

}
