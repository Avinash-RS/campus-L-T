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
  userList:any;
  disciplineDropdown: any = [];
  shortlistLists: any;
  assessmentName:any = '';
  selectedDisciple:any = '';
  selectedShortlistname:any = '';
  datetime:any = '';

  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef : any;
  rowData: any = [];
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';

  constructor(private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog) { }

  ngOnInit() {
    // this.getDiscipline();
    this.tabledef();
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.getShortlistNames();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
 }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
  }

  getModel(e) {
    // console.log(e);

    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
    }
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
      // this.toast.warning('No reuslts found');
    }
  }
  tabledef() {
    // displayedColumns: any[] = ['username', 'candidate_id', 'gender', 'insitute'];

    this.columnDefs = [
      // {
      //   headerName: 'S no', field: 'counter',
      //   filter: true,
      //   floatingFilterComponentParams: { suppressFilterButton: true },
      //   minWidth: 140,
      //   sortable: true,
      //   tooltipField: 'counter',
      //   // comparator: this.customComparator,
      //   getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      {
        headerName: 'Candidate name', field: 'username',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'username',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate id', field: 'candidate_id',
        filter: 'agNumberColumnFilter',
        maxWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Gender', field: 'gender',
        filter: 'agTextColumnFilter',
        maxWidth: 120,
        sortable: true,
        tooltipField: 'gender',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Insitute', field: 'insitute',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'insitute',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
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

      this.disciplineDropdown = data;
    }, (err) => {
    });
  }

  getShortlistNames() {
    this.adminService.TPOStatusShortlistLists().subscribe((data: any) => {

      this.shortlistLists = data && data ? data : [];

    }, (err) => {

    });
  }

  selectChange(){
    const apiData = {
      "shortlistname": this.selectedShortlistname
    };
    this.adminService.getShortlistCandidateList(apiData).subscribe((data: any) => {


      this.userList = data ? data : [];
      this.userList.forEach(element => {
        if(element.discipline){
          this.disciplineDropdown.push(element.discipline);
        }
      });
      this.rowData = this.userList;
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

}
