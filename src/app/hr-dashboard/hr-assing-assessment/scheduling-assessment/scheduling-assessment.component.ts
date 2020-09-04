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
  selector: 'app-scheduling-assessment',
  templateUrl: './scheduling-assessment.component.html',
  styleUrls: ['./scheduling-assessment.component.scss'],
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
export class SchedulingAssessmentComponent implements OnInit, AfterViewInit {

  displayedColumns: any[] = ['candidate_name', 'candidate_id', 'gender', 'institute'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  userList:any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService) { }

  ngOnInit() {
    this.getUsersList();
  }

  // To get all users
  getUsersList() {
    // const apiData = {
    //   get_assement_type: 'pre',
    //   get_created_by: '',
    //   get_folder_name: '',
    //   get_shortlist_name: '',
    //   get_tag_name: '',
    //   date1_get: '',
    //   date2_get: ''
    // };
    // this.adminService.getTPOStatus(apiData).subscribe((data: any) => {
      // this.appConfig.hideLoader();

      // this.userList = data ? data : [];
      this.userList = [{
        'candidate_name': 'avi',
        'candidate_id': 123,
        'gender': 'male',
        'institute': 'abc'
      },
      {
        'candidate_name': 'avi',
        'candidate_id': 123,
        'gender': 'male',
        'institute': 'abc'
      }
    ]

      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    // }, (err) => {
    // });
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
