import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-second-level-shortlisted-candidates-report',
  templateUrl: './second-level-shortlisted-candidates-report.component.html',
  styleUrls: ['./second-level-shortlisted-candidates-report.component.scss']
})
export class SecondLevelShortlistedCandidatesReportComponent implements OnInit, AfterViewInit {
  BASE_URL = environment.API_BASE_URL;

  // displayedColumns: any[] = ['uid', 'name', 'mail', 'roles_target_id', 'checked'];
  displayedColumns: any[] = ['sno', 'name', 'uid', 'gender', 'dob', 'institute', 'level', 'percentage', 'backlog', 'dateofpassing'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  assessmentName: any;
  nameOfAssessment: any;
  selectedCandidates: any;
  cutOff: any;
  cutOff1: any;
  cutOff2: any;
  cutOff3: any;
  cutOff4: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  check(name) {
    const apiData = {
      assement_name: name,
      shortlist: '1'
    };
    this.adminService.shortlistedCandidatesReport(apiData).subscribe((data: any) => {
      // this.appConfig.hideLoader();
    }, (err) => {

    });
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.assessmentDetails(params['data']);
      this.getUsersList(params['data']);
    });
  }

  assessmentDetails(name) {
    const apidata = {
      assement_name: name
    };
    this.adminService.assessmentDetailsOfSecond(apidata).subscribe((data: any) => {
      // this.appConfig.hideLoader();
      this.assessmentName = data;

    }, (err) => {

    });
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

  getMonthFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }
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
  getDateFormat1(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
      const output = split.toUpperCase();
      return output;

    } else {
      return '-';
    }
  }

  // To get all users
  getUsersList(names) {
    const apiData = {
      assement_name: names,
      shortlist: '1'
    };
    this.adminService.shortlistedCandidatesReport(apiData).subscribe((datas: any) => {
      const align = [];
      let sno = 0;
      datas.forEach((element, i) => {
        if (element && i == '0') {
          this.cutOff = element && element['domain_percentage_shortlist'] ? element['domain_percentage_shortlist'] : '-';
          this.cutOff1 = element && element['verbal_percentage_shortlist'] ? element['verbal_percentage_shortlist'] : '-';
          this.cutOff2 = element && element['analytical_percentage_shortlist'] ? element['analytical_percentage_shortlist'] : '-';
          this.cutOff3 = element && element['quantitative_percentage_shortlist'] ? element['quantitative_percentage_shortlist'] : '-';
          this.cutOff4 = element && element['marks_valid_shortlist'] ? element['marks_valid_shortlist'] : '-';
        }
        sno = sno + 1;
        const uid = element && element['uuid'] ? element['uuid'] : '-';
        const name = element && element['name'] ? element['name'] : '-';
        const gender = element && element['field_gender'] ? element['field_gender'] : '-';
        const dob = element && element['field_dob'] ? this.getMonthFormat(element['field_dob']) : '-';
        let institute = '-';
        let level = '-';
        let percentage = '-';
        let backlog = '-';
        let dateofpassing = '-';
        const checked = false;
        if (element && element['education']) {
          institute = element['education'] && element['education']['field_institute'] ? element['education']['field_institute'] : '-';
          level = element['education'] && element['education']['field_level'] ? element['education']['field_level'] : '-';
          percentage = element['education'] && element['education']['field_percentage'] ? element['education']['field_percentage'] : '-';
          backlog = element['education'] && element['education']['field_backlogs'] ? element['education']['field_backlogs'] : '-';
          dateofpassing = element['education'] && element['education']['field_year_of_passing'] ? this.getDateFormat(element['education']['field_year_of_passing']) : '-';
        }
        align.push(
          {
            sno,
            uid,
            name,
            gender,
            dob,
            institute,
            level,
            percentage,
            backlog,
            dateofpassing,
          }
        );
      });
      this.userList = align ? align : [];
      this.selectedCandidates = this.userList.length;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.appConfig.hideLoader();
    }, (err) => {
    });
  }

  downloadReport() {
    const excel = `${this.BASE_URL}/sites/default/files/upload_excel_error/secondlevel.csv`;
    window.open(excel, '_blank');
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

