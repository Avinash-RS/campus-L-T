import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-evaluation-interview-panel',
  templateUrl: './evaluation-interview-panel.component.html',
  styleUrls: ['./evaluation-interview-panel.component.scss']
})
export class EvaluationInterviewPanelComponent implements OnInit, AfterViewInit {

  appConstant = CONSTANT.ENDPOINTS;
  showPage = true;
  displayedColumns: any[] = ['counter', 'assessment_name', 'group_name', 'date', 'time', 'status', 'shortlist_name', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  demodata =[
    {
      'counter': 1,
      'assessment_name': 'Assessment 1',
      'group_name': '2020_Kousalya_SRM University',
      'date': '26 June 2020',
      'time': '11 : 30 AM',
      'status': 'Waiting',
      'shortlist_name': 'Batch 1',
      'action': '1'
    },
    {
      'counter': 2,
      'assessment_name': 'Assessment 2',
      'group_name': '2020_Kousalya_VIT University',
      'date': '26 June 2020',
      'time': '10 : 00 AM',
      'status': 'Completed',
      'shortlist_name': 'Batch 2',
      'action': '1'
    }
  ]

  constructor(private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService) { }

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

  // To get all users
  getUsersList() {
    // this.adminService.alreadyUploadedDetails().subscribe((data1: any) => {
      // this.appConfig.hideLoader();
      // console.log(data1);
      this.userList = this.demodata;
      // this.userList = data1 ? data1 : [];
      // this.userList.forEach((element, i) => {
      //   element['time'] = element && element['time'] ? this.tConvert(element['time']) : '';
      // });
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

  selectedUser(userDetail) {
    console.log(userDetail);
  }

}
