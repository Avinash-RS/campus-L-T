import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

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

  displayedColumns: any[] = ['username', 'candidate_id', 'gender', 'insitute'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  userList:any;
  disciplineDropdown: any = [];
  shortlistLists: any;
  assessmentName:any = '';
  selectedDisciple:any = '';
  selectedShortlistname:any = '';
  datetime:any = '';

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog) { }

  ngOnInit() {
    this.getDiscipline();
    this.getShortlistNames();
  }

  onChange(result: Date): void {
    let todayDate = new Date(result);
    let month = todayDate.getMonth()+1;
    let day = todayDate.getDate()
    let hr = todayDate.getHours();
    let min = todayDate.getMinutes();
    let date = todayDate.getFullYear() +'-'+(month <= 9 ? '0' + month : month) +'-'+ (day <= 9? '0' + day : day) + ' ' + hr + ':' + min
    this.datetime = date;
  }

  onOk(result: Date): void {
    let todayDate = new Date(result);
    let month = todayDate.getMonth()+1;
    let day = todayDate.getDate()
    let hr = todayDate.getHours();
    let min = todayDate.getMinutes();
    let date = todayDate.getFullYear() +'-'+(month <= 9 ? '0' + month : month) +'-'+ (day <= 9? '0' + day : day) + ' ' + hr + ':' + min
    this.datetime = date;
  }

  // get discipline dropdown value
  getDiscipline() {
    this.adminService.getDiscipline().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.disciplineDropdown = data;
    }, (err) => {
    });
  }

  getShortlistNames() {
    this.adminService.TPOStatusShortlistLists().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.shortlistLists = data && data ? data : [];

    }, (err) => {

    });
  }

  selectChange(){
    const apiData = {
      "shortlistname": this.selectedShortlistname
    };
    this.adminService.getShortlistCandidateList(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();

      this.userList = data ? data : [];

      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
  }

  scheduleAssessment(){
    let todayDate = new Date(this.datetime);
    let month = todayDate.getMonth()+1;
    let day = todayDate.getDate()
    let date = (day <= 9? '0' + day : day) +'-'+(month <= 9 ? '0' + month : month) +'-'+ todayDate.getFullYear()

    let data = {
      "assement_name": this.assessmentName,
      "date_time": this.datetime,
      "shortlistname": this.selectedShortlistname,
      "discipline": this.selectedDisciple
    }

    this.adminService.schedulingAssessment(data).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.appConfig.success(`Mail send successfully`, '');

    }, (err) => {

    });
  }

  submitDialog() {
    
    if(this.assessmentName != ''){
      if(this.selectedDisciple != ''){
        if(this.selectedShortlistname != ''){
          if(this.datetime != ''){

            const data = {
              iconName: '',
              dataToBeShared: {
                confirmText: `Are you sure you want to assign?`,
                type: 'schedule-hr',
                identity: 'schedule-assign'
              },
              showConfirm: 'Yes',
              AssignSchedule: 'schedule',
              candidateCount: this.userList.length,
              candidate: this.userList.length == 1 ? 'candidate' : 'candidates',
              showCancel: 'No',
              showOk: ''
            };
        
            this.openDialog(ShortlistBoxComponent, data);

          }else{
            this.appConfig.error(`Select date & time`, '');
          }
        }else{
          this.appConfig.error(`Select shortlist name`, '');
        }
      }else{
        this.appConfig.error(`Select disciple`, '');
      }
    }else{
      this.appConfig.error(`Fill assessment name`, '');
    }
  }

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
        this.scheduleAssessment();
      }
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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
