import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort, MatDialog, PageEvent } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { ActivatedRoute } from '@angular/router';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';

@Component({
  selector: 'app-shortlisted-candidate-list',
  templateUrl: './shortlisted-candidate-list.component.html',
  styleUrls: ['./shortlisted-candidate-list.component.scss']
})
export class ShortlistedCandidateListComponent implements OnInit, AfterViewInit {

  // MatPaginator Inputs
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


  // displayedColumns: any[] = ['uid', 'name', 'mail', 'roles_target_id', 'checked'];
  displayedColumns: any[] = ['uid', 'tag_name', 'name', 'new_candidate_id', 'gender', 'dob', 'institute', 'level', 'percentage', 'backlog', 'dateofpassing', 'checked'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('myDiv', { static: false }) private myDiv: ElementRef;
  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  notShowReject: boolean = true;
  notShowShortlist: boolean = true;
  totalCandidates: any;
  selectedCandidates: number;
  fullUserList: any;
  filteredBoolean: boolean;
  rejecting: boolean;
  filter: boolean;
  apiDataTop: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.getURLParam();
  }

  ngOnInit() {
    // this.getUsersList();
  }


  getURLParam() {
    this.activatedRoute.queryParams.subscribe(params => {
      
      if (params && params['data'] === 'filtered') {
        this.filter = true;
        this.queryObject = JSON.parse(this.appConfig.getLocalData('savedQuery'));
        this.apiDataTop = {
          start: this.apiPageIndex.toString(),
          counts: this.listCount.toString(),
          order_by: '',
          order_type: '',
          search: this.searchInput ? this.searchInput : '',
          educational_level: this.queryObject['educational_level'],
          field_backlogs: this.queryObject['field_backlogs'],
          field_discipline: this.queryObject['field_discipline'],
          field_dob: this.queryObject['field_dob'],
          field_gender: this.queryObject['field_gender'],
          field_institute: this.queryObject['field_institute'],
          field_specification: this.queryObject['field_specification'],
          user_id: this.queryObject['user_id']
        };
        this.getUsersList('filtered');
      } else {
        this.filter = false;
        this.apiDataTop = {
          start: this.apiPageIndex.toString(),
          counts: this.listCount.toString(),
          order_by: '',
          order_type: '',
          search: this.searchInput ? this.searchInput : ''
        };
        this.getUsersList();
      }
    });
  }


  applyCriteria() {
    const apiData = {
      user_id: []
    };
    const dummy = {
      user_id: []
    };
    this.fullUserList.forEach(element => {
      if (element['uid']) {
        apiData['user_id'].push(element['uid']);
      }
    });

    //   this.appConfig.setLocalData('FinalshortListCheckedCandidates', JSON.stringify(dummy));
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRSTSHORTLISTING_CRITERIA, { data: this.length });
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

  reject() {
    const data = {
      shortlist: 'reject'
    };
    this.openDialog3(ShortlistBoxComponent, data);
  }

  rejectAPI() {
    const apiData = {
      user_id: []
    };
    this.userList.forEach(element => {
      if (element && element['checked']) {
        apiData['user_id'].push(element['uid']);
      }
    });
    this.adminService.firstLevelReject(apiData).subscribe((data: any) => {
      this.rejecting = true;
      // this.appConfig.hideLoader();
      this.appConfig.success('Selected candidates rejected successfully', '');
      this.getURLParam();
    });
  }

  shortlist() {

    const data = {
      shortlist: 'first'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }
  apiShortlistSubmit(apiDatas) {
    const date = new Date();
    const currentDate = this.getDateFormat1(date);
    let minutes;
    if (date.getMinutes().toString().length === 1) {
      minutes = '0' + date.getMinutes().toString();
    } else {
      minutes = date.getMinutes();
    }
    const time = this.tConvert(`${date.getHours()}:${minutes}`);
    const apiUserList = [];

    this.userList.forEach(element => {
      if (element['checked']) {
        apiUserList.push(element['uid']);
      }
    });
    let apiData;
    apiData = {
      user_id: this.overallSelect ? [] : apiUserList,
      folder_name: apiDatas && apiDatas['folderName'] ? apiDatas['folderName'] : '',
      shortlist_name: apiDatas && apiDatas['shortlistName'] ? apiDatas['shortlistName'] : '',
      dates: currentDate,
      times: time,
      field_assement_type: apiDatas && apiDatas['type'] ? apiDatas['type'] : 'rec',
      shortlistby: this.appConfig.getLocalData('username'),
      select: this.overallSelect ? this.queryObject : ''
    };
    this.adminService.submitShortlistedCandidates(apiData).subscribe((data: any) => {

      this.appConfig.hideLoader();
      const datas = {
        first_level_shortlist_success: 'first_level_shortlist_success'
      };
      this.overallSelect = false;
      this.openDialog1(ShortlistBoxComponent, datas);
      this.appConfig.clearLocalDataOne('savedQuery');

    }, (err) => {

    });
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }
  }
  getDOBFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }
  }

  getDateFormat1(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
      const output = split.toUpperCase();
      return output;

    } else {
      return '-';
    }
  }


  pageChanged(event) {
    if (event.previousPageIndex > event.pageIndex) {
      // previous button clicked
      this.apiPageIndex = event.pageIndex + 1;
      const apiData = {
        start: this.apiPageIndex.toString(),
        counts: this.listCount.toString(),
        order_by: '',
        order_type: '',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getPageList(apiData);
    }
    if (event.previousPageIndex < event.pageIndex) {
      // next button clicked
      this.apiPageIndex = event.pageIndex + 1;
      const apiData = {
        start: this.apiPageIndex.toString(),
        counts: this.listCount.toString(),
        order_by: '',
        order_type: '',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getPageList(apiData);
    }
    if (event.pageSize !== this.listCount) {
      this.listCount = event.pageSize;
      this.apiPageIndex = 1;
      this.getURLParam();
    }
  }

  sorting(column, columnSelect) {
    if (this.sortedCol !== columnSelect) {
      this.normal = true;
      this.asc = false;
      this.desc = false;
    }
    this.sortedCol = columnSelect;
    if (this.normal) {
      this.normal = false;
      const apiData = {
        start: this.apiPageIndex.toString(),
        counts: this.listCount.toString(),
        order_by: column,
        order_type: 'asc',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getPageList(apiData);
      return this.asc = true;
    }
    if (this.asc) {
      this.asc = false;
      const apiData = {
        start: this.apiPageIndex.toString(),
        counts: this.listCount.toString(),
        order_by: column,
        order_type: 'desc',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getPageList(apiData);
      return this.desc = true;
    }
    if (this.desc) {
      this.desc = false;
      const apiData = {
        start: this.apiPageIndex.toString(),
        counts: this.listCount.toString(),
        order_by: '',
        order_type: '',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getPageList(apiData);
      return this.normal = true;
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
    this.getPageList(apiData);
  }

  // To get all users
  getPageList(apiData) {
    if (this.filter) {
      apiData.educational_level = this.queryObject['educational_level'];
      apiData.field_backlogs = this.queryObject['field_backlogs'];
      apiData.field_discipline = this.queryObject['field_discipline'];
      apiData.field_dob = this.queryObject['field_dob'];
      apiData.field_gender = this.queryObject['field_gender'];
      apiData.field_institute = this.queryObject['field_institute'];
      apiData.field_specification = this.queryObject['field_specification'];
      apiData.user_id = this.queryObject['user_id'];
    }
    // const apiData = {
    //   start: this.apiPageIndex.toString(),
    //   counts: this.listCount.toString()
    // };
    this.adminService.getCandidateListForShortlist(apiData).subscribe((datas: any) => {
    
      this.filteredBoolean = false;
      const align = [];
      let ApiCummulativeBacklog = 0;
      this.length = datas[1];
      const newData = datas[0] ? datas[0] : [];
      newData.forEach(element => {
        const uid = element && element['uuid'] ? element['uuid'] : '-';
        const name = element && element['name'] ? element['name'] : '-';
        const new_candidate_id = element && element['new_candidate_id'] ? element['new_candidate_id'] : '-';
        const gender = element && element['field_gender'] ? element['field_gender'] : '-';
        const tag_name = element && element['tag_name'] ? element['tag_name'] : '-';
        const dob = element && element['field_dob'] ? this.getDOBFormat(element['field_dob']) : '-';
        let institute = '-';
        let level = '-';
        let percentage = '-';
        let backlog = '-';
        let dateofpassing = '-';
        const checked = false;
        if (element && element['education'] && element['education'].length > 0) {
          let cummulativeBacklog = 0;
          element['education'].forEach(ele => {
            if (ele && ele['field_level'] === 'Other' && (level !== 'SSLC' && level !== 'HSC' && level !== 'Diploma' && level !== 'UG' && level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'SSLC' && (level !== 'HSC' && level !== 'Diploma' && level !== 'UG' && level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'HSC' && (level !== 'Diploma' && level !== 'UG' && level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'Diploma' && (level !== 'UG' && level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'UG' && (level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'PG') {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
          });
          ApiCummulativeBacklog = cummulativeBacklog;
        }

        align.push(
          {
            uid,
            name,
            new_candidate_id,
            gender,
            tag_name,
            dob,
            institute,
            level,
            percentage,
            backlog: ApiCummulativeBacklog,
            dateofpassing,
            checked: false
          }
        );
      });
      // if (this.filter) {
      //   align.forEach(element => {
      //     element.checked = true;
      //   });
      // }
      this.fullUserList = align ? align : [];
      this.userList = align ? align : [];
      // this.totalCandidates = this.fullUserList.length;
      this.totalCandidates = this.length;
      this.toShoworNotShowFilter();
      this.dataSource = new MatTableDataSource(this.userList);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.appConfig.hideLoader();
    }, (err) => {
    });
  }

  // To get all users
  getUsersList(filter?: any) {
    // const apiData = {
    //   start: this.apiPageIndex.toString(),
    //   counts: this.listCount.toString()
    // };
  
    this.adminService.getCandidateListForShortlist(this.apiDataTop).subscribe((datas: any) => {
      
      this.filteredBoolean = false;
      const align = [];
      let ApiCummulativeBacklog = 0;
      this.length = datas[1];
      this.paginator['_pageIndex'] = 0;
      const newData = datas[0] ? datas[0] : [];
      newData.forEach(element => {
        const uid = element && element['uuid'] ? element['uuid'] : '-';
        const name = element && element['name'] ? element['name'] : '-';
        const new_candidate_id = element && element['new_candidate_id'] ? element['new_candidate_id'] : '-';
        const gender = element && element['field_gender'] ? element['field_gender'] : '-';
        const tag_name = element && element['tag_name'] ? element['tag_name'] : '-';
        const dob = element && element['field_dob'] ? this.getDOBFormat(element['field_dob']) : '-';
        let institute = '-';
        let level = '-';
        let percentage = '-';
        let backlog = '-';
        let dateofpassing = '-';
        const checked = false;
        if (element && element['education'] && element['education'].length > 0) {
          let cummulativeBacklog = 0;
          element['education'].forEach(ele => {
            if (ele && ele['field_level'] === 'Other' && (level !== 'SSLC' && level !== 'HSC' && level !== 'Diploma' && level !== 'UG' && level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'SSLC' && (level !== 'HSC' && level !== 'Diploma' && level !== 'UG' && level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'HSC' && (level !== 'Diploma' && level !== 'UG' && level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'Diploma' && (level !== 'UG' && level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'UG' && (level !== 'PG')) {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
            if (ele && ele['field_level'] === 'PG') {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
              cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
            }
          });
          ApiCummulativeBacklog = cummulativeBacklog;
        }

        align.push(
          {
            uid,
            name,
            new_candidate_id,
            gender,
            tag_name,
            dob,
            institute,
            level,
            percentage,
            backlog: ApiCummulativeBacklog,
            dateofpassing,
            checked: false
          }
        );
      });
      // if (this.filter) {
      //   align.forEach(element => {
      //     element.checked = true;
      //   });
      // }
      this.fullUserList = align ? align : [];
      this.userList = align ? align : [];
      // this.totalCandidates = this.fullUserList.length;
      this.totalCandidates = this.length;
      this.toShoworNotShowFilter();
      this.dataSource = new MatTableDataSource(this.userList);
      this.length = datas[1];
      this.triggerFalseClick();
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      // this.length = datas[1];
      this.appConfig.hideLoader();
    }, (err) => {
    });
  }

  triggerFalseClick() {
    if (this.myDiv) {

      const el: HTMLElement = this.myDiv.nativeElement as HTMLElement;
      el.focus();
    }
  }
  selectAllCheckbox(checked) {

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
    this.toShoworNotShowFilter();
  }

  toShoworNotShowFilter() {
    let runElse = true;
    let selectedCount = 0;
    this.userList.forEach(element => {
      if (element.checked) {
        selectedCount = selectedCount + 1;
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
    this.selectedCandidates = selectedCount;
    this.rejectingSelection();
  }

  rejectingSelection() {
    if (this.rejecting && this.filter) {
      let selectedCount = 0;
      this.userList.forEach(element => {
        if (element) {
          element['checked'] = false;
          selectedCount = selectedCount + 1;
        }
      });
      this.selectedCandidates = selectedCount;
      this.rejecting = false;
    }
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
      // this.triggerFalseClick();
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.length = this.length;
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
    this.unselectSelectALL();
  }



  // Mat table select all functions below
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row) => {
        this.selection.select(row);

      });

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  profileView(candidateId, candidateName) {
    const data = {
      candidateId: candidateId ? candidateId : '',
      candidateName: candidateName ? candidateName : '',
    };
    this.openDialog4(CommonKycProfileViewComponent, data);
  }


  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

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
      if (result) {
        this.apiShortlistSubmit(result);
      }
    });
  }


  // Open dailog
  openDialog1(component, data) {
    let dialogDetails: any;

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
      this.apiDataTop = {
        start: '1',
        counts: this.listCount.toString(),
        order_by: '',
        order_type: '',
        search: this.searchInput ? this.searchInput : ''
      };
      this.getUsersList();
      if (result) {
      }
    });
  }

  // Open dailog
  openDialog3(component, data) {
    let dialogDetails: any;

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
      if (result) {
        this.rejectAPI();
      }
    });
  }

  // Open dailog
  openDialog4(component, data) {
    let dialogDetails: any;

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
      if (result) {
      }
    });
  }

}
