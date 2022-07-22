import { Component, OnInit } from '@angular/core';
import { IsRowSelectable } from 'ag-grid-community';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-selected-candidate',
  templateUrl: './selected-candidate.component.html',
  styleUrls: ['./selected-candidate.component.scss']
})
export class SelectedCandidateComponent implements OnInit {
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
  public statusBar = {
    statusPanels: [
    // { statusPanel: 'agTotalRowCountComponent', align: 'left'},
    { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
    { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
    { statusPanel: 'agAggregationComponent', align: 'right' },
    ],
  };


  stagesList = [
    {
      group_name: 'Profile',
      group_id: '1',
      stages: [
        {
          stage_name: 'Incompleted Profile',
          stage_id: '1'
        }
      ]
    },
    {
      group_name: 'Applicants Shortlist',
      group_id: '2',
      stages: [
        {
          stage_name: 'Shortlisted for Assessment',
          stage_id: '2',
        },
        {
          stage_name: 'Awaiting for Shortlist',
          stage_id: '3',
        }
      ]
    },
  ];
  selectedValue = this.stagesList[0].stages[0].stage_id;

  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();
    this.GetRowStyle();
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
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        maxWidth: 50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        suppressMenu: true,
        field: 'is_checked',
        headerName: ''
      },
      {
        headerName: 'Candidate Id', field: 'candidate_id',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'candidate_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#1b4e9b' },
        cellRenderer: (params) => {
          return `<span style="color: #1b4e9b; cursor: pointer">${params['data']['candidate_name']} </span>`;
        }
      },
      {
        headerName: 'Email', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Phone', field: 'mobile_number',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'mobile_number',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'College', field: 'institute',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'institute',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email Sent', field: 'mailed',
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 95,
        sortable: true,
        tooltipField: 'mailed',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Date & Time', field: 'date_time',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        maxWidth: 120,
        sortable: true,
        tooltipField: 'date_time',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Communication Log', field: 'log',
        filter: false,
        minWidth: 120,
        sortable: false,
        tooltipField: 'log',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return `<span style="color: #1b4e9b; text-decoration: underline; cursor: pointer">View Log</span>`;
        }
      },
    ];

    this.isRowSelectable = function (rowNode) {
      return rowNode.data ? true : true;
    };
  }


    // To get all users
    getUsersList() {
      this.rowData = [
        {
          is_checked: false,
          candidate_id: '13133',
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
    //   const role = this.appConfig.getLocalData('roles');
    //   const apiData = {
    //     company: role == 'ic' ? this.appConfig.getLocalData('userId') : ''
    //   }
    //  this.gridApi.showLoadingOverlay();
    //  this.SelectedCandidatesListSubscription = this.adminService.SelectedCandidatesList(apiData).subscribe((datas: any) => {
    //     this.userList = datas ? datas : [];
    //     let count = 0;
    //     this.userList.forEach(element => {
    //       count = count + 1;
    //       element['verified'] = element['verified'] == '1' ? 'Verified' : 'Verify';
    //       element['is_editable'] = element['mailed'] == 'Not Sent' ? '-' : (element['mailed'] == 'Sent' && element['is_editable'] == 'No') ? 'Submitted' : 'Open';
    //       element['is_checked'] = element['decline_status'] == '1' ? '' : false;
    //       element['offer_status'] = element['offer_status'] ? element['offer_status'] : '--';
    //       element['fitness_status'] = element['fitness_status'] ? element['fitness_status'] : '--';
    //       element['decline_status'] = element['decline_status'] == '1' ? 'Yes' : 'No';
    //       element['details'] = count;
    //     });
    //     this.rowData = this.userList;
    //   }, (err) => {
    //   });
  }

  fns(step) {
    console.log('sass', step);
  }

}