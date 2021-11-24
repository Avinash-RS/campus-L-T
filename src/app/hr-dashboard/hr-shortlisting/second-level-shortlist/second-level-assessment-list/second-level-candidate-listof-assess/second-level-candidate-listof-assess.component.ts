import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, TemplateRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModuleRegistry, AllModules } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);

import { GridChartsModule } from '@ag-grid-enterprise/charts';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { finalize } from 'rxjs/operators';
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-second-level-candidate-listof-assess',
  templateUrl: './second-level-candidate-listof-assess.component.html',
  styleUrls: ['./second-level-candidate-listof-assess.component.scss']
})
export class SecondLevelCandidateListofAssessComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoAssessDialog', {static: false}) videoAssessDialog: TemplateRef<any>;
  showSendEvaluationButton = true;
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
    // headerCheckboxSelection: this.isFirstColumn,
    // checkboxSelection: this.isFirstColumn,
    // headerCheckboxSelectionFilteredOnly: true,
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
  public rowSelection;
  public isRowSelectable;
  resultsLength:any;
  fres: any;
  refreshSubscription: Subscription;
  filterSecondLevelSubscription: Subscription;
  secondShortlistAPISubscription: Subscription;
  drivePermissions: any;
  VideoAssessdialogRef: any;
  userListApiResponse: any;
  videoAssessment: any;
  videoAssessmentCompletedCandidates: any = [];
  showSendEmailButton: any;
  videoScheduleDetailsSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedServiceService,
    private dialog: Router
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
    this.drivePermissions = this.appConfig.getSelectedDrivePermissions();
    this.refreshOndriveChangeRXJS();
  }

  isRowSelectableMethod() {
    this.rowSelection = "multiple";
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.filterSecondLevelSubscription ? this.filterSecondLevelSubscription.unsubscribe() : '';
    this.secondShortlistAPISubscription ? this.secondShortlistAPISubscription.unsubscribe() : '';
    this.videoScheduleDetailsSubscription ? this.videoScheduleDetailsSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST)) {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST);
      }
    });
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['data']) {
        this.nameOfAssessment = params['data'];
        this.getUsersList(params['data']);
      } else {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_ASSESSMENT_LIST);
      }
    });
  }

    // To get all users
    getUsersList(name) {
      const apiData = {
        shortlist_name: name,
      };
      this.videoAssessmentCompletedCandidates = [];
      this.filterSecondLevelSubscription = this.adminService.filterSecondLevel(apiData).subscribe((response: any) => {
        this.userListApiResponse = response ? response : null;
        let tableHeaders = response && response.table_headers ? response.table_headers : [];
        this.userList = response && response.table_data ? response.table_data : [];
        this.userList.forEach(element => {
          element.shortlisted_status = element.shortlisted_status == 1 ? 'Shortlisted' : 'Not Shortlisted';
          ((element.va_test_status && element.va_test_status == 'Completed') && element.shortlisted_status == 'Not Shortlisted') ? this.videoAssessmentCompletedCandidates.push(element) : '';
        });
        this.showSendEmailButton = this.videoAssessmentCompletedCandidates.length > 0 ? true : false;
        this.rowData = this.userList;
        this.tableDef(tableHeaders);
        let notTaken = response['total_no_of_candidates'] - response['exams_taken'];
        this.statusHeaderData = {
          shortlist_name: response && response.shortlist_name ? response.shortlist_name : '',
          shortlist_status: response && response.shortlist_status ? response.shortlist_status : '',
          total_no_of_candidates: response && response.total_no_of_candidates ? response.total_no_of_candidates : 0,
          available: response && response.table_data && response.table_data.length > 0 ? response.table_data.length : 0,
          shortlisted: response && response.shortlisted_count ? response.shortlisted_count : 0,
          notTaken: notTaken,
          header: true
        }
      }, (err) => {
      });
    }

  checkFilterAppied() {
    let savedFilterModel = this.gridApi.getFilterModel();
    let check = Object.keys(savedFilterModel).length === 0 && savedFilterModel.constructor === Object ? true : false;
    return !check;
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
    let savedFilterModel = this.checkFilterAppied() ? this.gridApi.getFilterModel() : '';
    const apiData = {
      shortlisted_ids: [],
      shortlisted_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '',
      emai_sent: result['type'] === 'yes' ? true : false,
      shortlist_name: this.nameOfAssessment,
      filter_model: savedFilterModel ? JSON.stringify(savedFilterModel) : ''
      };
      let candidatesArr = [];
      this.selectedCandidatesForShortlist.forEach(element => {
        if (element.data && element.data.shortlist_id) {
          const find = candidatesArr.find(fdata => fdata == element.data.shortlist_id);
          find ? '' : candidatesArr.push(element.data.shortlist_id);
        }
      });
      apiData.shortlisted_ids = candidatesArr;
     this.secondShortlistAPISubscription = this.adminService.secondShortlistAPI(apiData).subscribe((data: any) => {
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

  onCellClicked(event) {
    if (event.colDef.field == 'va_test_status') {
    if (event["data"] && event["data"]["va_scheduled_status"] && event["data"]["va_scheduled_status"] == '1') {
      this.openMatDialog(event["data"]);
    }
    }
  }

  getScheduleDetailsPHP(apiDatas) {
    const apiData = {
      shortlist_name: this.userListApiResponse.shortlist_name, candidate_user_id: Number(apiDatas.candidate_user_id), schedule_id: apiDatas.schedule_id, is_va_evaluation: 0
   }
   this.videoScheduleDetailsSubscription = this.adminService.videoAssessmentEvaluationDetails(apiData).subscribe(
      (datas: any) => {
        let data = datas ? datas : null;
        this.videoAssessment = {
          schedule_id: data && data.schedule_id ? data.schedule_id : '',
          scheduled_status: 1,
          room_id: data && data.room_id ? data.room_id : '',
          test_status: /* data && data.va_test_status ?*/ this.videoAssessTestStatus(data),
          remarks: data && data.remarks ? data.remarks : '',
          evaluation_status: /*data && data.evaluation_status ?*/ this.videoAssessEvaluationStatus(data),
          scheduled_by: data && data.scheduled_by ? data.scheduled_by : '',
          evaluated_by: data && data.evaluated_by ? data.evaluated_by : '',
          submitted_by: data && data.shortlisted_by ? data.shortlisted_by : '',
          start_datetime: data && data.start_datetime ? data.start_datetime : '',
          end_datetime: data && data.end_datetime ? data.end_datetime : '',
          uid: data && data.candidate_user_id ? data.candidate_user_id : '',
          candidate_id: data && data.candidate_id ? data.candidate_id : '',
          candidate_name: data && data.candidate_name ? data.candidate_name : '',
          shortlist_name: data && data.shortlist_name ? data.shortlist_name : '',
          showSubmitButton: data && data.shortlist_status == 1 ? false : true,
          profile_image_url: data && data.profile_image_url ? '' : 'assets/images/img_avatar2.jpg',
          redirectedFrom: 'hr',
          showTopBar: true,
      };
      this.openVideoAssessDialog();
      },
      (err) => {
        this.videoAssessment = {};
        this.openVideoAssessDialog();
      }
    );
  }

  videoAssessEvaluationStatus(data: any) {
    if (data && data.schedule_id) {
      if (data && data.va_test_status && data.va_test_status == 'Time Expired') {
        return 'Time Expired';
      }
       return (data && data.evaluation_status && data.evaluation_status == 'selected') ? 'Selected' : (data && data.evaluation_status && data.evaluation_status == 'rejected') ? 'Rejected' : data.evaluation_status ? data.evaluation_status : 'Yet to Evaluate';
    } else {
      return 'Not Scheduled';
    }
  }

  videoAssessTestStatus(data: any) {
    if (data && data.schedule_id) {
      if (data && data.va_test_status && data.va_test_status == 'YetToStart') {
        return 'Yet to Start';
      }
      if (data && data.va_test_status && data.va_test_status == 'InProgress') {
        return 'In Progress';
      }
      if (data && data.va_test_status && data.va_test_status) {
        return data.va_test_status;
      } else {
        return 'Not Scheduled';
      }
    } else {
      return 'Not Scheduled';
    }
  }

  openVideoAssessDialog() {
    this.VideoAssessdialogRef = this.matDialog.open(this.videoAssessDialog, {
      width: '1200px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForVideoAssess'
    });
  }
  openMatDialog(data: any) {
    let apiData = {
      shortlist_name: data.shortlist_name, candidate_user_id: data.candidate_user_id, schedule_id: data.va_schedule_id}
    this.getScheduleDetailsPHP(apiData);
  //   this.videoAssessment = {
  //     schedule_id: data && data.va_schedule_id ? data.va_schedule_id : '',
  //     scheduled_status: data && data.va_scheduled_status ? data.va_scheduled_status : 0,
  //     room_id: data && data.va_room_id ? data.va_room_id : '',
  //     test_status: data && data.va_test_status ? data.va_test_status : '',
  //     remarks: data && data.va_remarks ? data.va_remarks : '',
  //     evaluation_status: data && data.va_evaluation_status ? data.va_evaluation_status : '',
  //     scheduled_by: data && data.va_scheduled_by ? data.va_scheduled_by : '',
  //     evaluated_by: data && data.va_evaluated_by ? data.va_evaluated_by : '',
  //     submitted_by: data && data.shortlisted_by ? data.shortlisted_by : '',
  //     start_datetime: data && data.va_start_datetime ? data.va_start_datetime : '',
  //     end_datetime: data && data.va_end_datetime ? data.va_end_datetime : '',
  //     uid: data && data.candidate_user_id ? data.candidate_user_id : '',
  //     shortlist_name: this.userListApiResponse ? this.userListApiResponse.shortlist_name : '',
  //     showSubmitButton: data && data.shortlisted_status == 'Shortlisted' ? false : true,
  //     redirectedFrom: 'hr'
  // };

  }

  closeDialog(e) {
    this.VideoAssessdialogRef.close();
  }

  refresh() {
    this.gridApi.showLoadingOverlay();
    this.getUsersList(this.nameOfAssessment);
  }

  getModel(e) {
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
    this.drivePermissions = this.appConfig.getSelectedDrivePermissions();
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
            if (this.drivePermissions.video_assessment && first && first.headerName && first.headerName == 'Video Assessment') {
            if (second && second.field && second.field == 'va_test_status') {
              second.cellRenderer = (params) => {
                if (params["data"] && params["data"]["va_scheduled_status"] && params["data"]["va_scheduled_status"] == '1') {
                  return `<span style="cursor: pointer; color:#C02222;">${params["data"]["va_test_status"]} </span>`;
                } else {
                  return `${params["data"]["va_test_status"]}`;
                }
              }
            }
          }
        });
      }
    });
    // setTimeout(() => {
    if (apiResultSet && apiResultSet[0] && apiResultSet[0].children && apiResultSet[0].children[0] && apiResultSet[0].children[0].field && apiResultSet[0].children[0].field == 'candidate_id') {
    apiResultSet[0].children[0].headerCheckboxSelection = true;
    apiResultSet[0].children[0].headerCheckboxSelectionFilteredOnly = true;
    apiResultSet[0].children[0].checkboxSelection = true;

    // Drive condition check first
    if (this.drivePermissions && this.drivePermissions.normal_assessment && this.drivePermissions.video_assessment) {
      apiResultSet[0].children[0].checkboxSelection = function (params) {
        if (params.data && params.data.shortlisted_status && params.data.shortlisted_status != 'Shortlisted' && params.data.na_status && (params.data.va_evaluated_by && (params.data.va_evaluated_by == 'selected' || params.data.va_evaluated_by == 'rejected'))) {
          params.node.selectable = true;
          return true;
        } else {
          params.node.selectable = false;
          return false;
        }
      }
    }

    // Drive condition check second
    if (this.drivePermissions && this.drivePermissions.normal_assessment && !this.drivePermissions.video_assessment) {
      apiResultSet[0].children[0].checkboxSelection = function (params) {
        if (params.data && params.data.shortlisted_status && params.data.shortlisted_status != 'Shortlisted' && params.data.na_status) {
          params.node.selectable = true;
          return true;
        } else {
          params.node.selectable = false;
          return false;
        }
    }
    }

    // Drive condition check third
    if (this.drivePermissions && this.drivePermissions.video_assessment && !this.drivePermissions.normal_assessment) {
      apiResultSet[0].children[0].checkboxSelection = function (params) {
        if (params.data && params.data.shortlisted_status && params.data.shortlisted_status != 'Shortlisted' && (params.data.va_evaluated_by && (params.data.va_evaluated_by == 'selected' || params.data.va_evaluated_by == 'rejected'))) {
          params.node.selectable = true;
          return true;
        } else {
          params.node.selectable = false;
          return false;
        }
      }
    }

  }

    this.columnDefs = apiResultSet;
  }

  checkboxEnablingCondition(params: any) {
    if (this.drivePermissions && this.drivePermissions.normal_assessment && this.drivePermissions.video_assessment) {
      if (params.data && params.data.shortlisted_status && params.data.shortlisted_status != 'Shortlisted' && params.data.na_status && (params.data.va_evaluated_by && (params.data.va_evaluated_by == 'selected' || params.data.va_evaluated_by == 'rejected'))) {
        params.node.selectable = true;
        return true;
      } else {
        params.node.selectable = false;
        return false;
      }
    }
    if (this.drivePermissions && this.drivePermissions.normal_assessment && !this.drivePermissions.video_assessment) {
      if (params.data && params.data.shortlisted_status && params.data.shortlisted_status != 'Shortlisted' && params.data.na_status) {
        params.node.selectable = true;
        return true;
      } else {
        params.node.selectable = false;
        return false;
      }
    }

    if (this.drivePermissions && this.drivePermissions.video_assessment && !this.drivePermissions.normal_assessment) {
      if (params.data && params.data.shortlisted_status && params.data.shortlisted_status != 'Shortlisted' && (params.data.va_evaluated_by && (params.data.va_evaluated_by == 'selected' || params.data.va_evaluated_by == 'rejected'))) {
        params.node.selectable = true;
        return true;
      } else {
        params.node.selectable = false;
        return false;
      }
    }


  }

  redirectVideo() {
    this.appConfig.setLocalData('sendEvaluationCandidates', JSON.stringify(this.videoAssessmentCompletedCandidates));
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING_VIDEO_ASSESSMENT_EVALUATION_SCREEN, {shortlist_name: this.nameOfAssessment});
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
