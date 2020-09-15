import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-uploaded-list',
  templateUrl: './uploaded-list.component.html',
  styleUrls: ['./uploaded-list.component.scss']
})
export class UploadedListComponent implements OnInit, AfterViewInit {
  showPage = true;
  displayedColumns: any[] = ['counter', 'tag', 'name', 'new_candidate_id', 'email', 'uploaded_by', 'uploader_role', 'date', 'time'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  displayNoRecords = false;
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
      // this.getPageList(apiData);
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
      // this.getPageList(apiData);
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
      // this.getPageList(apiData);
      return this.normal = true;
    }
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

  // To get all users
  getUsersList() {
  //   {
  //     "counts":"50",
  //     "start":"1",
  //     "search":"",
  //     "order_by":"tag/name/candidate_id/email/uploader_name",
  //     "order_type":"asc/desc"
  // }
    const apiData = {
      counts: '50',
      start: '1',
      search: '',
      order_by: '',
      order_type: 'asc',
      uploaded_id: this.appConfig.getLocalData('userId') ? '' : ''
    };
    this.adminService.alreadyUploadedDetails(apiData).subscribe((data1: any) => {
      this.appConfig.hideLoader();
      this.userList = data1 ? data1 : [];
      let count = 0;
      this.userList.forEach((element, i) => {
        count = count + 1;
        element['counter'] = count;
        element['time'] = element && element['time'] ? element['time'] : '';
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

  selectedUser(userDetail) {

  }

}
