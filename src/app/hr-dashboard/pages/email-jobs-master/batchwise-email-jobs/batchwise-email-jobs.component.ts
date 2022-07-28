import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IsRowSelectable } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-batchwise-email-jobs',
  templateUrl: './batchwise-email-jobs.component.html',
  styleUrls: ['./batchwise-email-jobs.component.scss']
})
export class BatchwiseEmailJobsComponent implements OnInit {
  @Input() stageWiseDetails: any;
  @Input() stepperIndex: any;
  @Output() nextClickEmitter: EventEmitter<any> = new EventEmitter<any>();
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef: any;
  tooltipShowDelay = 0;
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  rowStyle = { background: '#fcfcfc' };
  getRowStyle: any;
  public isRowSelectable: IsRowSelectable;
  userList: any;
  popUpdata: any;


  stagesList = [];
  stagesListSubscription: Subscription;
  selectedValue: any;

  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();
    this.GetRowStyle();
    this.getStagesList();
  }

  ngOnChanges() {
    
  }

  getStagesList() {
    this.stagesListSubscription = this.adminService.stagesList().subscribe((res: any)=> {
      this.stagesList = res && res?.stages_list && res?.stages_list.length > 0 ? res?.stages_list : [];
      this.selectedValue = this.stagesList[0].stages[0].stage_id;
    }, (err)=> {

    });
  }

  GetRowStyle() {
    this.getRowStyle = (params) => {
      let rowsArray = params.node.rowModel.rowsToDisplay;
      let rowI = params.node.rowIndex;
      if (rowsArray[rowI].data.decline_status == 'Yes') {
          return {opacity: '0.5'};
      }
  };
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getUsersList();
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
  }

  getModel(e) {
    this.gridApi.deselectAll();
    setTimeout(() => {
      const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
      if (filteredArray && filteredArray.length === 0) {
        this.appConfig.warning('No search results found');
      }
    }, 500);
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

    this.columnDefs = [
      {
        headerName: 'Candidate ID', field: 'candidate_id',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        maxWidth:140,
        sortable: true,
        tooltipField: 'Candidate ID',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'candidate_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'Name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          if(params.data ){
           return '<span style="cursor: pointer"><span class="profileAvatar"><img src="/assets/images/img_avatar2.jpg"></span> <span>'+params.value+'</span> </span>'
          } 
          if(params.value == undefined){
            return '';
          }else {
              return ''+params.value;
          }
        }

      },
      {
        headerName: 'Phone', field: 'mobile_number',
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'Phone',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'College', field: 'institute',
        filter: 'agTextColumnFilter',
        minWidth: 160,
        sortable: true,
        tooltipField: 'College',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'Discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email Status', field: 'mailed',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'Email Status',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Sent Date & Time', field: 'date_time',
        filter: 'agDateColumnFilter',
        minWidth: 85,
        sortable: true,
        tooltipField: 'Sent Date & Time',
        getQuickFilterText: (params) => {
          return params.value;
        },
      },
    ];
  }


    // To get all users
    getUsersList() {
      this.rowData = [
        {
          candidate_id: '105',
          candidate_name: 'Avinash',
          email: 'Avinash@mailinator.com',
          mobile_number: '9865257782',
          institute: 'Seshasayee Institute of Technology',
          discipline: 'Computer Science',
          mailed: 'yes',
          date_time: '24 May 2022 12:00 PM',
          log: 'View Log'
        }
      ];

  }

  ngOnDestroy() {
    this.stagesListSubscription ? this.stagesListSubscription.unsubscribe() : '';
  }

}
