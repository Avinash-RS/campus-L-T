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
  firstSortlistReport: any;
  interviewPanelReport: any;
  fromDate:any;
  toDate:any;
  cityListDropdown:any;
  assessmentNameDropdown:any;
  selectedAssessmentName:any;
  selectedAssessmentNameSecond:any;
  selectedTagNameFirst:any;
  selectedCityForFirst:any;
  selectedInstituteNameForFirst:any;
  selectedTagNameSecond:any;
  selectedCityForSecond:any;
  selectedInstituteNameForSecond:any;
  yesexist = {
    width: 'auto !important'
  }
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
    this.getAllCitys();
    this.getAllAssessmentName();
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
    }
    // ,
    // {
    //   'reportname': 'y',
    //   'col2': 'a',
    //   'col3': 'b',
    //   'col4': 'c',
    //   'fdate': 'd',
    //   'tdate': 'e',
    //   'action': 'f'
    // }
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

  // To get all city
  getAllCitys() {
    this.adminService.getAllCandidateCity().subscribe((data: any) => {
      this.appConfig.hideLoader();

      this.cityListDropdown = data;

    }, (err) => {
    });
  }

  // To get assessment name
  getAllAssessmentName() {
    this.adminService.getAllAssessmentNames().subscribe((data: any) => {
      this.appConfig.hideLoader();

      this.assessmentNameDropdown = data;

    }, (err) => {
    });
  }

  // To get 1st shortlist report
  getFirstsortlistRepots(data) {
    let sendReq = {
      'to': '',
      'from': '',
      'tag': '',
      'city': '',
      'institute': ''
    };

    if(data.to._i){
      let tomonth = data.to._i.month + 1;
      let frommonth = data.from._i.month + 1;
      sendReq = {
        'to': data.to._i.year + '-' + (tomonth <= 9 ? '0' + tomonth : tomonth)  + '-' +  (data.to._i.date <= 9? '0' + data.to._i.date : data.to._i.date),
        'from': data.from._i.year + '-' + (frommonth <= 9 ? '0' + frommonth : frommonth)  + '-' +  (data.from._i.date <= 9? '0' + data.from._i.date : data.from._i.date),
        'tag': data.tagName,
        'city': data.city,
        'institute': data.instituteName
      }
      if(sendReq.to >= sendReq.from){
      
        this.adminService.firstSortlistReportslist(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
          
          const excel = data && data[0].url ? data[0].url : '';
          window.open(excel, '_blank');
  
        }, (err) => {
        });
      }else{
        this.appConfig.error("To date should be greater", '');
      }
    }else{
      sendReq = {
        'to': '',
        'from': '',
        'tag': data.tagName,
        'city': data.city,
        'institute': data.instituteName
      }
      
        this.adminService.firstSortlistReportslist(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
          
          const excel = data && data[0].url ? data[0].url : '';
          window.open(excel, '_blank');
  
        }, (err) => {
        });

      // this.appConfig.error("Date should be selected", '');
    }
  }

  // To get interview panel report
  interviewPanelRepots(data) {
  
    let sendReq = {
      'to_date': '',
      'from_date': ''
    };
    if(data.to._i){
      let tomonth = data.to._i.month + 1;
      let frommonth = data.from._i.month + 1;
      sendReq = {
        'to_date': data.to._i.year + '-' + (tomonth <= 9 ? '0' + tomonth : tomonth)  + '-' +  (data.to._i.date <= 9? '0' + data.to._i.date : data.to._i.date),
        'from_date': data.from._i.year + '-' + (frommonth <= 9 ? '0' + frommonth : frommonth)  + '-' +  (data.from._i.date <= 9? '0' + data.from._i.date : data.from._i.date)
      }
      if(sendReq.to_date >= sendReq.from_date){
        this.adminService.interviewPanelReportslist(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
    
          const excel = data && data.url ? data.url : '';
          window.open(excel, '_blank');
    
        }, (err) => {
        });
      }else{
        this.appConfig.error("To date should be greater", '');
      }
    }else{
      this.appConfig.error("Date should be selected", '');
    }
  }

  // To get 2nd  shortlist report
  secondShortlistRepots(data) {

    let sendReq = {
      'to': '',
      'from': '',
      'assement_name': ''
    };

    if(data.to._i){
      let tomonth = data.to._i.month + 1;
      let frommonth = data.from._i.month + 1;
      sendReq = {
        'to': data.to._i.year + '-' + (tomonth <= 9 ? '0' + tomonth : tomonth)  + '-' +  (data.to._i.date <= 9? '0' + data.to._i.date : data.to._i.date),
        'from': data.from._i.year + '-' + (frommonth <= 9 ? '0' + frommonth : frommonth)  + '-' +  (data.from._i.date <= 9? '0' + data.from._i.date : data.from._i.date),
        'assement_name': data.assesment.assesment
      }
      if(sendReq.to >= sendReq.from){
      
        this.adminService.secondShortlistReport(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
          
          if(data[0].url == 'No Data Found'){
            this.appConfig.error(data[0].url, '');
          }else{
            const excel = data && data[0].url ? data[0].url : '';
            window.open(excel, '_blank');
          }
  
        }, (err) => {
        });
      }else{
        this.appConfig.error("To date should be assessment date", '');
      }
    }else{
      sendReq = {
        'to': '',
        'from': '',
        'assement_name': data.assesment.assesment
      }
      
        this.adminService.secondShortlistReport(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
          
          if(data[0].url == 'No Data Found'){
            this.appConfig.error(data[0].url, '');
          }else{
            const excel = data && data[0].url ? data[0].url : '';
            window.open(excel, '_blank');
          }
  
        }, (err) => {
        });

      // this.appConfig.error("Date should be selected", '');
    }
  }

  // To get assessment feedback report
  feedbackRepots(data) {

    let sendReq = {
      'to_date': '',
      'from_date': '',
      'assement_name': ''
    };
    if(data.to._i){
      let tomonth = data.to._i.month + 1;
      let frommonth = data.from._i.month + 1;
      sendReq = {
        'to_date': data.to._i.year + '-' + (tomonth <= 9 ? '0' + tomonth : tomonth)  + '-' +  (data.to._i.date <= 9? '0' + data.to._i.date : data.to._i.date),
        'from_date': data.from._i.year + '-' + (frommonth <= 9 ? '0' + frommonth : frommonth)  + '-' +  (data.from._i.date <= 9? '0' + data.from._i.date : data.from._i.date),
        'assement_name': data.assesment.assesment
      }
      if(sendReq.to_date >= sendReq.from_date){
        this.adminService.assessmentFeedbackReport(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
          
          const excel = data && data.url ? data.url : '';
          window.open(excel, '_blank');
    
        }, (err) => {
        });
      }else{
        this.appConfig.error("To date should be assessment date", '');
      }
    }else{
      sendReq = {
        'to_date': '',
        'from_date': '',
        'assement_name': data.assesment.assesment
      }
        this.adminService.assessmentFeedbackReport(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
          
          const excel = data && data.url ? data.url : '';
          window.open(excel, '_blank');
    
        }, (err) => {
        });

      // this.appConfig.error("Date should be selected", '');
    }
  }

  // To get candidate report
  getCandidateRepots(data) {
    let sendReq = {
      'to': '',
      'from': '',
      'tag': '',
      'city': '',
      'institute': ''
    };

    if(data.to._i){
      let tomonth = data.to._i.month + 1;
      let frommonth = data.from._i.month + 1;
      sendReq = {
        'to': data.to._i.year + '-' + (tomonth <= 9 ? '0' + tomonth : tomonth)  + '-' +  (data.to._i.date <= 9? '0' + data.to._i.date : data.to._i.date),
        'from': data.from._i.year + '-' + (frommonth <= 9 ? '0' + frommonth : frommonth)  + '-' +  (data.from._i.date <= 9? '0' + data.from._i.date : data.from._i.date),
        'tag': data.tagName,
        'city': data.city,
        'institute': data.instituteName
      }
      if(sendReq.to >= sendReq.from){
      
        this.adminService.candidateReportslist(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
          
          const excel = data && data.url ? data.url : '';
          window.open(excel, '_blank');
  
        }, (err) => {
        });
      }else{
        this.appConfig.error("To date should be greater", '');
      }
    }else{
      sendReq = {
        'to': '',
        'from': '',
        'tag': data.tagName,
        'city': data.city,
        'institute': data.instituteName
      }
      
        this.adminService.candidateReportslist(sendReq).subscribe((data: any) => {
          this.appConfig.hideLoader();
          
          const excel = data && data.url ? data.url : '';
          window.open(excel, '_blank');
  
        }, (err) => {
        });

      // this.appConfig.error("Date should be selected", '');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadReports(index){

    if(index == 0){
      if(this.selectedTagNameFirst || this.selectedCityForFirst || this.selectedInstituteNameForFirst){
        let sendData = {
          'tagName': this.selectedTagNameFirst,
          'city': this.selectedCityForFirst,
          'instituteName': this.selectedInstituteNameForFirst,
          "to": this.userList[index].tdate,
          "from": this.userList[index].fdate
        }
    
        this.getFirstsortlistRepots(sendData);
      }else{
        this.appConfig.error("Please select a filter criteria", '');
      }
    }else if(index == 1){
      if(this.selectedAssessmentName){
        let sendData = {
          'assesment': this.selectedAssessmentName,
          "to": this.userList[index].tdate,
          "from": this.userList[index].fdate
        }
        this.secondShortlistRepots(sendData);
      }else{
        this.appConfig.error("Please select a filter criteria", '');
      }
    }else if(index == 2){
      if(this.selectedAssessmentNameSecond){
        let sendData = {
          'assesment': this.selectedAssessmentNameSecond,
          "to": this.userList[index].tdate,
          "from": this.userList[index].fdate
        }
        this.feedbackRepots(sendData);
      }else{
        this.appConfig.error("Please select a filter criteria", '');
      }
    }else if(index == 3){
      if(this.userList[index].tdate != 'e'){
        let dateFilter = {
          "to": this.userList[index].tdate,
          "from": this.userList[index].fdate
        }
        this.interviewPanelRepots(dateFilter);
      }else{
        this.appConfig.error("Date should be selected", '');
      }
    }
    // else if(index == 3){
    //   if(this.selectedTagNameSecond || this.selectedCityForSecond || this.selectedInstituteNameForSecond){
    //     let sendData = {
    //       'tagName': this.selectedTagNameSecond,
    //       'city': this.selectedCityForSecond,
    //       'instituteName': this.selectedInstituteNameForSecond,
    //       "to": this.userList[index].tdate,
    //       "from": this.userList[index].fdate
    //     }
    
    //     this.getCandidateRepots(sendData);
    //   }else{
    //     this.appConfig.error("Please select a filter criteria", '');
    //   }
    // }
  }
  // selectedUser(userDetail) {
  //   this.selectedUserDetail = userDetail;
  // }

}
