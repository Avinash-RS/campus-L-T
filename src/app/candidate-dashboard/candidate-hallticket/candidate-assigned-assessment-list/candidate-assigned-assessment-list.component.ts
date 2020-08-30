import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-candidate-assigned-assessment-list',
  templateUrl: './candidate-assigned-assessment-list.component.html',
  styleUrls: ['./candidate-assigned-assessment-list.component.scss']
})
export class CandidateAssignedAssessmentListComponent implements OnInit, AfterViewInit {

  BASE_URL = environment.API_BASE_URL;

  displayedColumns: any[] = ['uid', 'assement_name', 'date', 'time', 'pdf'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
  ) { }

  ngOnInit() {
    this.getUsersList();
  }

  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split.toUpperCase();
      return output;

    } else {
      return '-';
    }
  }

  // To get all users
  getUsersList() {
    const apiData = {
      user_id: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : ''
    }
    this.candidateService.assessmentList(apiData).subscribe((datas: any) => {
      this.appConfig.hideLoader();
      console.log('api', datas);
      this.userList = datas ? datas : [];
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

  selectedUser(userDetail) {
    console.log(userDetail);
  }
  downloadHallticket(detail) {
    const excel = detail && detail.pdf ? detail.pdf : '';
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
