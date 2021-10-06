import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup } from '@angular/forms';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
export class ReportsListComponent implements OnInit, OnDestroy {

  displayedColumns: any[] = ['reportname', 'col2', 'col3', 'col4', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  form: FormGroup;
  userList;
  tagNameDropdown: any = [];
  // institutesList = DropdownListForKYC['institutes'];
  institutesList: any;
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
  evaluationReportInstitutes: any;
  selectedevaluationReportInstitute: any;
  yesexist = {
    width: 'auto !important'
  }
  refreshSubscription: Subscription;
  getoverallInstituteSubscription: Subscription;
  getTagNameSubscription: Subscription;
  getAllCandidateCitySubscription: Subscription;
  shortlist2ReportAPISubscription: Subscription;
  evalationReportAPISubscription: Subscription;
  firstSortlistReportslistSubscription: Subscription;
  firstSortlistReportslistSubscription1: Subscription;
  interviewPanelReportslistSubscription: Subscription;
  secondShortlistReportSubscription: Subscription;
  secondShortlistReportSubscription1: Subscription;
  assessmentFeedbackReportSubscription: Subscription;
  assessmentFeedbackReportSubscription1: Subscription;
  candidateReportslistSubscription: Subscription;
  candidateReportslistSubscription1: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private candidateService: CandidateMappersService
    ) {
    }

  ngOnInit() {
    this.getInstitute();
    this.getUsersList();
    this.getTagName();
    this.getAllCitys();
    this.getAllAssessmentName();
    this.evaluationInstitute();
    this.refreshOndriveChangeRXJS();

  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.getoverallInstituteSubscription ? this.getoverallInstituteSubscription.unsubscribe() : '';
    this.getTagNameSubscription ? this.getTagNameSubscription.unsubscribe() : '';
    this.getAllCandidateCitySubscription ? this.getAllCandidateCitySubscription.unsubscribe() : '';
    this.shortlist2ReportAPISubscription ? this.shortlist2ReportAPISubscription.unsubscribe() : '';
    this.evalationReportAPISubscription ? this.evalationReportAPISubscription.unsubscribe() : '';
    this.firstSortlistReportslistSubscription ? this.firstSortlistReportslistSubscription.unsubscribe() : '';
    this.firstSortlistReportslistSubscription1 ? this.firstSortlistReportslistSubscription1.unsubscribe() : '';
    this.interviewPanelReportslistSubscription ? this.interviewPanelReportslistSubscription.unsubscribe() : '';
    this.secondShortlistReportSubscription ? this.secondShortlistReportSubscription.unsubscribe() : '';
    this.secondShortlistReportSubscription1 ? this.secondShortlistReportSubscription1.unsubscribe() : '';
    this.assessmentFeedbackReportSubscription ? this.assessmentFeedbackReportSubscription.unsubscribe() : '';
    this.assessmentFeedbackReportSubscription1 ? this.assessmentFeedbackReportSubscription1.unsubscribe() : '';
    this.candidateReportslistSubscription ? this.candidateReportslistSubscription.unsubscribe() : '';
    this.candidateReportslistSubscription1 ? this.candidateReportslistSubscription1.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.REPORTS_LIST)) {
        this.getInstitute();
        this.getUsersList();
        this.getTagName();
        this.getAllCitys();
        this.getAllAssessmentName();
        this.evaluationInstitute();
      }
    });
  }

  getInstitute() {
   this.getoverallInstituteSubscription = this.candidateService.getoverallInstitute().subscribe((data: any) => {

      const list = data ? data : [];
      this.institutesList = list;
      this.institutesList.sort((a,b) => 0 - (a.name > b.name ? -1 : 1));
    }, (err)=> {

    });
  }

  // To get all users
  getUsersList() {
    const today = moment();

    const data = [{
      'reportname': 'abc',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': today,
      'tdate': today,
      'action': 'f'
    },
    {
      'reportname': 'x',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': today,
      'tdate': today,
      'action': 'f'
    },
    {
      'reportname': 'y',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': today,
      'tdate': today,
      'action': 'f'
    },
    {
      'reportname': 'y',
      'col2': 'a',
      'col3': 'b',
      'col4': 'c',
      'fdate': today,
      'tdate': today,
      'action': 'f'
    }
    ];
    this.userList = data;
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // To get all users
  getTagName() {
   this.getTagNameSubscription = this.adminService.getTagName().subscribe((data: any) => {


      this.tagNameDropdown = data;

    }, (err) => {
    });
  }

  // To get all city
  getAllCitys() {
    this.getAllCandidateCitySubscription = this.adminService.getAllCandidateCity().subscribe((data: any) => {


      this.cityListDropdown = data;

    }, (err) => {
    });
  }

  // To get assessment name
  getAllAssessmentName() {
    this.shortlist2ReportAPISubscription = this.adminService.shortlist2ReportAPI().subscribe((data: any) => {


      this.assessmentNameDropdown = data ? data : [];


    }, (err) => {
    });
  }

  evaluationInstitute() {
    this.evalationReportAPISubscription = this.adminService.evalationReportAPI().subscribe((data: any) => {

      this.evaluationReportInstitutes = data ? data : [];

      // this.assessmentNameDropdown = data;

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

    if(data.to && data.to._d){
      const dateT = data.to && data.to._d ? moment(data.to._d).format('YYYY-MM-DD') : '';
      const dateF = data.from && data.from._d ? moment(data.from._d).format('YYYY-MM-DD') : '';
      sendReq = {
        'to': dateT.toString(),
        'from': dateF.toString(),
        'tag': data.tagName,
        'city': data.city,
        'institute': data.instituteName
      }
      if(sendReq.to >= sendReq.from){

       this.firstSortlistReportslistSubscription = this.adminService.firstSortlistReportslist(sendReq).subscribe((data: any) => {


          if(data && data[0] && data[0].url == 'No Data Found'){
            this.appConfig.nzNotification("error", "No Data Found", "No data found for the selected 1st shortlist");
          }else{
            const excel = data && data[0].url ? data[0].url : '';
            window.open(excel, '_blank');
          }

        }, (err) => {
        });
      }else{
        this.appConfig.nzNotification("error", "Invalid date", "1st shortlist 'Date to' should be greater than 'Date from'");
      }
    }else{
      sendReq = {
        'to': '',
        'from': '',
        'tag': data.tagName,
        'city': data.city,
        'institute': data.instituteName
      }

       this.firstSortlistReportslistSubscription1 = this.adminService.firstSortlistReportslist(sendReq).subscribe((data: any) => {


          if(data && data[0] && data[0].url == 'No Data Found'){
            this.appConfig.nzNotification("error", "No Data Found", "No data found for the selected 1st shortlist");
          }else{
            const excel = data && data[0].url ? data[0].url : '';
            window.open(excel, '_blank');
          }

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
    if(data.to && data.to._d){
      const dateT = data.to && data.to._d ? moment(data.to._d).format('YYYY-MM-DD') : '';
      const dateF = data.from && data.from._d ? moment(data.from._d).format('YYYY-MM-DD') : '';
      sendReq = {
        'to_date': dateT.toString(),
        'from_date': dateF.toString()
      }
      if(sendReq.to_date >= sendReq.from_date){
       this.interviewPanelReportslistSubscription = this.adminService.interviewPanelReportslist(sendReq).subscribe((data: any) => {


        const excel = data && data[0].url ? data[0].url : '';
        window.open(excel, '_blank');

        }, (err) => {
        });
      }else{
        this.appConfig.nzNotification("error", "Invalid date", "Interview Panel 'Date to' should be greater than 'Date from'");
      }
    }else{
      this.appConfig.nzNotification("error", "Invalid date", "Date field is mandatory for Interview panel report");
    }
  }

  // To get 2nd  shortlist report
  secondShortlistRepots(data) {

    let sendReq = {
      'to': '',
      'from': '',
      'institute': ''
    };

    if(data.to && data.to._d){
      const dateT = data.to && data.to._d ? moment(data.to._d).format('YYYY-MM-DD') : '';
      const dateF = data.from && data.from._d ? moment(data.from._d).format('YYYY-MM-DD') : '';
      sendReq = {
        'to': dateT.toString(),
        'from': dateF.toString(),
        'institute': data.institute_name
      }
      if(sendReq.to >= sendReq.from){
       this.secondShortlistReportSubscription = this.adminService.secondShortlistReport(sendReq).subscribe((data: any) => {


          if(data[0].url == 'No Data Found'){
            this.appConfig.nzNotification("error", "No Data Found", "No data found for the selected 2nd shortlist");
          }else{
            const excel = data && data[0].url ? data[0].url : '';
            window.open(excel, '_blank');
          }

        }, (err) => {
        });
      }else{
        this.appConfig.nzNotification("error", "Invalid date", "2nd shortlist 'Date to' should be greater than 'Date from'");
      }
    }else{
      sendReq = {
        'to': '',
        'from': '',
        'institute': data.institute_name
      }
       this.secondShortlistReportSubscription1 = this.adminService.secondShortlistReport(sendReq).subscribe((data: any) => {


          if(data[0].url == 'No Data Found'){
            this.appConfig.nzNotification("error", "No Data Found", "No data found for the selected 2nd shortlist");
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
      'institute': ''
    };
    if(data.to && data.to._d){
      const dateT = data.to && data.to._d ? moment(data.to._d).format('YYYY-MM-DD') : '';
      const dateF = data.from && data.from._d ? moment(data.from._d).format('YYYY-MM-DD') : '';
      sendReq = {
        'to_date': dateT.toString(),
        'from_date': dateF.toString(),
        'institute': data.institute_name
      }
      if(sendReq.to_date >= sendReq.from_date){
      this.assessmentFeedbackReportSubscription =  this.adminService.assessmentFeedbackReport(sendReq).subscribe((data: any) => {


        const excel = data && data[0].url ? data[0].url : '';
        window.open(excel, '_blank');

        }, (err) => {
        });
      }else{
        this.appConfig.nzNotification("error", "Invalid date", "Evaluation feedback 'Date to' should be greater than 'Date from'");
      }
    }else{
      sendReq = {
        'to_date': '',
        'from_date': '',
        'institute': data.institute_name
      }
      this.assessmentFeedbackReportSubscription1 = this.adminService.assessmentFeedbackReport(sendReq).subscribe((data: any) => {


        const excel = data && data[0].url ? data[0].url : '';
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

    if(data.to && data.to._d){
      const dateT = data.to && data.to._d ? moment(data.to._d).format('YYYY-MM-DD') : '';
      const dateF = data.from && data.from._d ? moment(data.from._d).format('YYYY-MM-DD') : '';
      sendReq = {
        'to': dateT.toString(),
        'from': dateF.toString(),
        'tag': data.tagName,
        'city': data.city,
        'institute': data.instituteName
      }
      if(sendReq.to >= sendReq.from){

      this.candidateReportslistSubscription = this.adminService.candidateReportslist(sendReq).subscribe((data: any) => {


        const excel = data && data[0].url ? data[0].url : '';
        window.open(excel, '_blank');

        }, (err) => {
        });
      }else{
        this.appConfig.nzNotification("error", "Invalid date", "Candidate report 'Date to' should be greater than 'Date from'");
      }
    }else{
      sendReq = {
        'to': '',
        'from': '',
        'tag': data.tagName,
        'city': data.city,
        'institute': data.instituteName
      }

       this.candidateReportslistSubscription1 = this.adminService.candidateReportslist(sendReq).subscribe((data: any) => {


        const excel = data && data[0].url ? data[0].url : '';
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
        this.appConfig.nzNotification("error", "1st Shortlist", "Tag name or City or Institute name is required");
      }
    }else if(index == 1){
      if(this.selectedAssessmentName){
        let sendData = {
          'institute_name': this.selectedAssessmentName,
          "to": this.userList[index].tdate,
          "from": this.userList[index].fdate
        }
        this.secondShortlistRepots(sendData);
      }else{
        this.appConfig.nzNotification("error", "2nd Shortlist", "Institute name is required");
      }
    }else if(index == 2){
      if(this.selectedevaluationReportInstitute || (this.userList[index].fdate && this.userList[index].fdate['_d']) && (this.userList[index].tdate && this.userList[index].tdate['_d'])){
        let sendData = {
          'institute_name': this.selectedevaluationReportInstitute ? this.selectedevaluationReportInstitute : '',
          "to": this.userList[index].tdate,
          "from": this.userList[index].fdate
        }
        this.feedbackRepots(sendData);
      }else{
        this.appConfig.nzNotification("error", "Evaluation Feedback", "Either Institute name Or Date field is mandatory");
      }
    }else if(index == 3){
      if(this.userList[index].tdate){
        let dateFilter = {
          "to": this.userList[index].tdate,
          "from": this.userList[index].fdate
        }
        this.interviewPanelRepots(dateFilter);
      }else{
        this.appConfig.nzNotification("error", "Interview Panel", "Date is required");
      }
    }
  }

}
