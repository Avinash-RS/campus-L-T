import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';

@Component({
  selector: 'app-hr-upload-test-report',
  templateUrl: './hr-upload-test-report.component.html',
  styleUrls: ['./hr-upload-test-report.component.scss']
})
export class HrUploadTestReportComponent implements OnInit, AfterViewInit {


  BASE_URL = environment.API_BASE_URL;

  displayedColumns: any[] = ['uid', 'shortlist_name', 'email', 'date', 'assement_error'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  displayNoRecords = false;

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
      uploaded_by: ''
    };
    this.adminService.UploadTestReports().subscribe((datas: any) => {
      // this.adminService.bulkUploadCandidatesErrorList(apiData).subscribe((datas: any) => {
      this.appConfig.hideLoader();
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

  downloadExcel(element) {
    const excel = element && element.download ? element.download : '';
    window.open(excel, '_blank');
  }
  selectedUser(userDetail) {
    
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
    if(this.dataSource.filteredData.length==0){
      this.displayNoRecords=true;
    }else{
      this.displayNoRecords=false;

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}