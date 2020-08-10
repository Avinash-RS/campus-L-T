import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup } from '@angular/forms';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example geneimport { Moment } from 'moment';ration script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportsListComponent implements OnInit {

  displayedColumns: any[] = ['reportname', 'col2', 'col3', 'col4', 'fdate', 'tdate', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  form: FormGroup;
  userList;
  tagNameDropdown: any = [];
  institutesList = DropdownListForKYC['institutes'];

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService
    ) { }

  ngOnInit() {
    //   this.form = new FormGroup({
    //     title: new FormControl()
    //  });

    this.getUsersList();
    this.getTagName();
  }

  // To get all users
  getUsersList() {
    // this.adminService.userList().subscribe((data: any) => {
    // this.appConfig.hideLoader();
    const data = [{
      'reportname': 'abc',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': 'd',
      'tdate': 'e',
      'action': 'f'
    },
    {
      'reportname': 'x',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': 'd',
      'tdate': 'e',
      'action': 'f'
    },
    {
      'reportname': 'y',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': 'd',
      'tdate': 'e',
      'action': 'f'
    },
    {
      'reportname': 'y',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': 'd',
      'tdate': 'e',
      'action': 'f'
    },
    {
      'reportname': 'y',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': 'd',
      'tdate': 'e',
      'action': 'f'
    }
    ];
    this.userList = data;
    // this.userList.forEach(element => {
    //   element.checked = false;
    // });
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // }, (err) => {
    // });
  }

  // ngAfterViewInit() {
  //   if (this.dataSource) {
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //   }
  // }

  // To get all users
  getTagName() {
    this.adminService.getTagName().subscribe((data: any) => {
      this.appConfig.hideLoader();

      this.tagNameDropdown = data;

    }, (err) => {
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // selectedUser(userDetail) {
  //   this.selectedUserDetail = userDetail;
  // }

}
