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
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-second-level-candidate-listof-assess',
  templateUrl: './second-level-candidate-listof-assess.component.html',
  styleUrls: ['./second-level-candidate-listof-assess.component.scss']
})
export class SecondLevelCandidateListofAssessComponent implements OnInit, AfterViewInit {

  BIS = this.appConfig.getLocalData('BIS');
  userList: any;
  assessmentName: any;
  nameOfAssessment: any;
  statusHeaderData: any;
  selectedCandidatesForShortlist: any;

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
    private adminService: AdminServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.statusBar = {
      statusPanels: [
        // { statusPanel: 'agTotalRowCountComponent', align: 'left'},
        { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
        { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
        { statusPanel: 'agAggregationComponent', align: 'right' },
      ],
    };

    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.getUsersList(params['data']);
    });
  }

    // To get all users
    getUsersList(name) {
      const apiData = {
        shortlist_name: name,
      };
      this.adminService.filterSecondLevel(apiData).subscribe((response: any) => {
        let tableHeaders = response && response.table_headers ? response.table_headers : [];
        this.userList = response && response.table_data ? response.table_data : [];
        this.rowData = this.userList;
        this.tableDef(tableHeaders);
        let notTaken = response['total_no_of_candidates'] - response['exams_taken'];
        this.statusHeaderData = {
          shortlist_name: response && response.shortlist_name ? response.shortlist_name : '',
          shortlist_status: response && response.shortlist_status ? response.shortlist_status : '',
          total_no_of_candidates: response && response.total_no_of_candidates ? response.total_no_of_candidates : 0,
          available: response && response.table_data && response.table_data.length > 0 ? response.table_data.length : 0,
          shortlisted: response && response.shortlisted ? response.shortlisted : 0,
          notTaken: notTaken,
          header: true
        }
      }, (err) => {
      });
    }

  submit() {
    this.selectedCandidatesForShortlist = [];
    this.selectedCandidatesForShortlist = this.gridApi.getSelectedNodes();
    const data = {
      shortlist: 'second'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  afterSubmit(result) {
    const apiData = {
      shortlisted_ids: [],
      shortlisted_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '',
      emai_sent: result['type'] === 'yes' ? true : false,
      shortlist_name: this.nameOfAssessment,
      filter_model: ''
      };
      let candidatesArr = [];
      this.selectedCandidatesForShortlist.forEach(element => {
        if (element.data && element.data.shortlist_id) {
          const find = candidatesArr.find(fdata => fdata == element.data.shortlist_id);
          find ? '' : candidatesArr.push(element.data.shortlist_id);
        }
      });
      apiData.shortlisted_ids = candidatesArr;
      this.adminService.secondShortlistAPI(apiData).subscribe((data: any) => {
        this.appConfig.success(apiData.emai_sent ? 'The mail has been sent successfully to shortlisted candidates' : 'Selected Candidates have been shortlisted successfully');
        this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTED_CANDIDATE_REPORT, { data: this.nameOfAssessment ? this.nameOfAssessment : 'none' });
      }, (err) => {

      });
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
    let apiResultSet = res;
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
    this.columnDefs = apiResultSet;
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
        this.afterSubmit(result);
      }
    });
  }

}
