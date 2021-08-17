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
    // this.tableDef();
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
      this.tableDef(res);
    }, (err)=> {

    });
  }

  tableDef(res) {
    let header = {
      sortable: true,
      resizable:true,
      columnGroupShow: 'closed',
      tooltipField: 'candidate_id',
      // minWidth: 150,
      suppressSizeToFit: true,
      enableValue: true,
      getQuickFilterText: (params) => {
        return params.value;
      },
      filterParams: {
        buttons: ['reset'],
      },
    }
    let apiResultSet = res && res.metadata && res.metadata.length > 0 ? res.metadata : [];
    this.rowData = res && res.result && res.result.length > 0 ? res.result : [];
    apiResultSet.forEach((first, index) => {
      if (first && first.children && first.children.length > 0) {
        first.children.forEach((second, index1) => {
          if (index == 0) {
            first.children[index1] = {...second, ...header};
            first.children[index1].tooltipField = second.field;
          }
          if (second && second.children && second.children.length > 0) {
            second.children.forEach((third, index2) => {
              if (index != 0) {
                second.children[index2] = {...third, ...header};
                second.children[index2].tooltipField = third.field;
                }
            });
          }
        });
      }
    });
    console.log('tabledef', apiResultSet);

    this.columnDefs = apiResultSet;
  }
}
