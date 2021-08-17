import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);

import { GridChartsModule } from '@ag-grid-enterprise/charts';
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-second-level-candidate-listof-assess',
  templateUrl: './second-level-candidate-listof-assess.component.html',
  styleUrls: ['./second-level-candidate-listof-assess.component.scss']
})
export class SecondLevelCandidateListofAssessComponent implements OnInit, AfterViewInit {

  BIS = this.appConfig.getLocalData('BIS');
  selectedUserDetail: any;
  userList: any;
  assessmentName: any;
  nameOfAssessment: any;
  selectedCandidates: any;
  previewList: any;
  changedList: any;
  displayNoRecords = false;

  // Ag grif
  gridApi: any;
  columnDefs = [];
  defaultColDef = {
    // editable: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
    columnGroupShow: 'closed',
    flex: 1,
    minWidth: 200,
    floatingFilter: true,
    // minWidth: 150,
    suppressSizeToFit: true,
    headerCheckboxSelection: this.isFirstColumn,
    checkboxSelection: this.isFirstColumn,
  };
  tooltipShowDelay = 0;
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue = '';
  feildsValue:any = [];
  // autoGroupColumnDef = [];
  subscription: Subscription;
  value:any;
  message:any;
  public frameworkComponents;
  public statusBar;
  public sideBar;
  public paginationNumberFormatter;
  public rowClassRules;
  public autoGroupColumnDef;
  public gridColumnApi;
  public detailCellRendererParams;
  // statusBar:any;
  public components;
  public getNodeChildDetails;
  resultsLength:any;
  fres: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.statusBar = {
      statusPanels: [
        // {
        //   statusPanel: 'agTotalRowCountComponent',
        //   align: 'left',
        // },
        { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
        { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
        { statusPanel: 'agAggregationComponent', align: 'right' },
      ],
    };

    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.getdummy();
    this.tableDef();
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      // this.assessmentDetails(params['data']);
      // this.getUsersList(params['data']);
    });
  }

  assessmentDetails(name) {
    const apidata = {
      shortlist_name: name
    };
    this.adminService.assessmentDetailsOfSecond(apidata).subscribe((data: any) => {
      //
      this.assessmentName = data;

    }, (err) => {

    });
  }

  submit() {
    // this.changedList = this.userList;
    // this.previewList = this.changedList;

    // this.showShortlisted = true;
  }

  // To get all users
  getUsersList(name) {
    const apiData = {
      shortlist_name: name,
      domain_percentage: '',
      verbal_percentage: '',
      analytical_percentage: '',
      quantitative_percentage: '',
      marks_valid: ''
    };
    this.adminService.filterSecondLevel(apiData).subscribe((datas: any) => {
      this.userList = datas ? datas : [];
      let count = 0;
      this.userList.forEach((element, i) => {
        count = count + 1;
        element['uid'] = count;
      });
      this.rowData = this.userList;
      this.selectedCandidates = this.userList.length;
    }, (err) => {
    });
  }


  selectedUser(userDetail) {
  }

  ngAfterViewInit() {
  }

// Ag grid
  isFirstColumn(params) {
    var displayedColumns = params.columnApi.getAllDisplayedColumns();
    var thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
    // setTimeout(function () {
    //   params.api.getDisplayedRowAtIndex(1).setExpanded(true);
    // }, 0);
  }


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.getColumnState();
    this.gridApi.sizeColumnsToFit();
    this.gridApi.getDisplayedRowCount();
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  sortevent(e) {}

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  };

  onCellClicked(event) {}

  getModel(e) {
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
    }
  }

  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }
  getdummy() {
    this.adminService.getDummyJson().subscribe((res: any)=> {
      console.log('res', res);
      this.jsonStructureCreation(res);
    }, (err)=> {

    });
  }

  jsonStructureCreation(res) {
    let apiResult = res;
    let agParamNames: any;
    let assessmentParamNames: any;
    let sectionParamNames: any;
    // let firstElement = res[0].assessments[0];
    let datatype = [];

    apiResult.forEach((first, firstI) => {
     firstI == 0 ? agParamNames = Object.getOwnPropertyNames(first) : '';
      first.assessments.forEach((second, secondI) => {
        secondI == 0 ? assessmentParamNames = Object.getOwnPropertyNames(second) : '';
        second.sections.forEach((firstElement, firstElementI) => {
          firstElementI == 0 ? sectionParamNames = Object.getOwnPropertyNames(firstElement) : '';
          for (const key in firstElement) {
      console.log('firstElement', firstElement);
      if (Object.prototype.hasOwnProperty.call(firstElement, key)) {
        console.log('firstElement key', key);
        const element = firstElement[key];
        console.log('firstkey', firstElement[key]);
        if (parseInt(firstElement[key]) == firstElement[key] ) {
          datatype.push(key);
        }
      }
    }

        });
      });
    });

    // for (const key in firstElement) {
    //   console.log('firstElement', firstElement);
    //   if (Object.prototype.hasOwnProperty.call(firstElement, key)) {
    //     console.log('firstElement key', firstElement, key);
    //     const element = firstElement[key];
    //     console.log('firstkey', firstElement[key]);
    //     if (parseInt(firstElement[key]) == firstElement[key] ) {
    //       datatype.push(key);
    //     }
    //   }
    // }
    let removeDuplicated = new Set(datatype);
    datatype = [...removeDuplicated];
    console.log('datatype', datatype);
    let finalparam = [];
    apiResult.forEach(first => {
      first.assessments.forEach(second => {
        second.sections.forEach(firstElement => {
          let pushObj = {
            name: firstElement,
            type1: 'text'
          }
          datatype.forEach(result => {
            if (firstElement == result) {
              pushObj.type1 = 'number';
            }
          });
          finalparam.push(pushObj);
        });
      });
    });

    console.log('ad', finalparam);

    console.log('final apiResult', apiResult);
    console.log('ag paar', agParamNames);
    console.log('assessmentParamNames', assessmentParamNames);
    console.log('sectionParamNames', sectionParamNames);
  }

  tableDef() {
    this.columnDefs = [
      {
      headerName: 'Personal',
      children: [
        {
          headerName: 'Candidate ID',
          field: 'candidate_id',
          sortable: true,
          resizable:true,
          columnGroupShow: 'closed',
          tooltipField: 'candidate_id',
          // minWidth: 150,
          suppressSizeToFit: true,
          filter: 'agTextColumnFilter',
          enableValue: true,
          getQuickFilterText: (params) => {
            return params.value;
          },
          filterParams: {
            buttons: ['reset'],
          },
        },
        {
          headerName: 'Mail Id',
          field: 'mail',
          sortable: true,
          resizable:true,
          columnGroupShow: 'closed',
          tooltipField: 'mail',
          // minWidth: 150,
          suppressSizeToFit: true,
          filter: 'agTextColumnFilter',
          enableValue: true,
          getQuickFilterText: (params) => {
            return params.value;
          },
          filterParams: {
            buttons: ['reset'],
          },
        }
      ]
    },
    {
      headerName: 'Mail ID',
      children: [
        {
          headerName: 'Mail Id',
          field: 'mail',
          sortable: true,
          resizable:true,
          columnGroupShow: 'closed',
          tooltipField: 'mail',
          // minWidth: 150,
          suppressSizeToFit: true,
          filter: 'agTextColumnFilter',
          enableValue: true,
          getQuickFilterText: (params) => {
            return params.value;
          },
          filterParams: {
            buttons: ['reset'],
          },
        }
      ]
    },
  ];
}
}
