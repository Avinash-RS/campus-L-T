import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import * as moment from 'moment'; //in your component
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';

@Component({
  selector: 'app-video-assess-assigned-candidates',
  templateUrl: './video-assess-assigned-candidates.component.html',
  styleUrls: ['./video-assess-assigned-candidates.component.scss']
})
export class VideoAssessAssignedCandidatesComponent implements OnInit, OnDestroy {
  userList: any;
  nameOfAssessment: any;
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef : any;
  rowData: any = null;
  searchBox = false;
  filterValue: string;
  quickSearchValue = "";
  gridColumnApi: any;
  isChecked: boolean;
  selectedCount: any = [];
  rejectedCount: any = [];
  rowSelection: any = 'single';
  refreshSubscription: Subscription;
  invSubmittedCandidatesListSubscription: Subscription;
  drivePermissions: any;
  candidatesEvaluated: any = [];
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
    this.drivePermissions = this.appConfig.getSelectedDrivePermissions();
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.invSubmittedCandidatesListSubscription ? this.invSubmittedCandidatesListSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_ASSIGNED_DETAILS)) {
        this.quickSearchValue = '';
        this.drivePermissions = this.appConfig.getSelectedDrivePermissions();
        if (this.drivePermissions && this.drivePermissions.video_assessment) {
          this.gridApi.setColumnDefs(null);
          this.drivePermissionBasedColumnDefinitions();
          this.getUsersList();
        } else {
          this.drivePermissionBasedColumnDefinitions();
          this.getUsersList();
        }
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabledef();
    this.getUsersList();
  }

  sortevent(e) {}

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  };

  onCellClicked(event) {
    if (event.colDef.field === "candidate_name") {
      const data = {
        candidate_user_id: event['data'] && event['data']['candidate_user_id'] ? event['data']['candidate_user_id'] : '',
        candidateName: event['data'] && event['data']['candidate_name'] ? event['data']['candidate_name'] : ''
      };
      this.openDialog(CommonKycProfileViewComponent, data);
    }

    if (event.colDef.field === "evaluation_status") {
      let details = {
        candidate_user_id: event['data'] && event['data']['candidate_user_id'] ? event['data']['candidate_user_id'] : '',
        shortlist_name: event['data'] && event['data']['shortlist_name'] ? event['data']['shortlist_name'] : '',
        schedule_id: event['data'] && event['data']['schedule_id'] ? event['data']['schedule_id'] : ''
      }
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.VIDEO_ASSESS_EVALUATION_DETAILS, details);
    }

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
      this.appConfig.warning("No search results found");
    }
  }
  tabledef() {
    this.drivePermissionBasedColumnDefinitions();
  }

  drivePermissionBasedColumnDefinitions() {
      let savedefaultColumns: any = this.defaultColumns();
      let merging = savedefaultColumns;
      this.gridApi.setColumnDefs(merging);
  }

  defaultColumns() {
    return [
      {
        headerName: "Candidate Id",
        field: "candidate_id",
        filter: 'agNumberColumnFilter',
        minWidth: 180,
        sortable: true,
        tooltipField: "candidate_id",
        getQuickFilterText: (params) => {
          return params.value;
        },
      },
      {
        headerName: "Candidate Name",
        field: "candidate_name",
        filter: 'agTextColumnFilter',
        minWidth: 180,
        sortable: true,
        tooltipField: "candidate_name",
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: "#C02222" },
        cellRenderer: (params) => {
          return `<span style="cursor: pointer"><span class="profileAvatar"><img src="${params["data"]["profile_image_url"]}"></span> <span>${params["data"]["candidate_name"]}</span> </span>`;
        },
      },
      {
        headerName: "Email Id",
        field: "email_id",
        filter: 'agTextColumnFilter',
        minWidth: 180,
        sortable: true,
        tooltipField: "email_id",
        getQuickFilterText: (params) => {
          return params.value;
        },
      },
      {
        headerName: "Shortlist Name",
        field: "shortlist_name",
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: "shortlist_name",
        getQuickFilterText: (params) => {
          return params.value;
        },
      },
      {
        headerName: "Assigned by",
        field: "scheduled_by",
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 150,
        sortable: true,
        tooltipField: "scheduled_by",
        valueGetter: (params) => {
          return params.data.scheduled_by ? params.data.scheduled_by : '-';
        }
      },
      {
          headerName: "Video Evaluation Status",
          headerClass: 'ag-grid-header-center',
          field: "evaluation_status",
          filter: 'agSetColumnFilter',
          filterParams: {
            applyMiniFilterWhileTyping: true
          },
          minWidth: 130,
          sortable: true,
          getQuickFilterText: (params) => {
            return params.value;
          },
          cellStyle: {
            textAlign: "center",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
          },
          cellRenderer: (params) => {
              if (
                params["data"] && params["data"]["evaluation_status"] == "Selected"
              ) {
                return `<span style="cursor: pointer;" class="status completed-bg">Selected</span>`;
              }
              if (
                params["data"] && params["data"]["evaluation_status"] == "Rejected"
              ) {
                return `<span style="cursor: pointer;" class="status rejected-bg">Rejected</span>`;
              } else {
                  return `<span style="cursor: pointer;" class="status inprogress-blue-bg">Yet to Evaluate</span>`;
              }
          },
        }
    ]
}

  getSummaryCount() {
    this.selectedCount = [];
    this.rejectedCount = [];
    this.candidatesEvaluated = [];
    this.userList.forEach((element) => {
      if (
        element.evaluation_status == "Selected" ||
        element.evaluation_status == "Rejected"
      ) {
        this.candidatesEvaluated.push(element);
        element.evaluation_status == "Selected"
          ? this.selectedCount.push(element)
          : this.rejectedCount.push(element);
      }
    });
  }
  // To get all users
  getUsersList() {
    setTimeout(() => {
      this.gridApi.showLoadingOverlay();
    }, 500);
   this.invSubmittedCandidatesListSubscription = this.adminService.assignedVAEvaluationListForEvaluators().subscribe(
      (datas: any) => {
        const align = datas ? datas : [];
        this.userList = align;
        this.userList.forEach((element) => {
          if (element) {
            element.evaluation_status = element["evaluation_status"] == "selected" ? 'Selected' : (element["evaluation_status"] == 'rejected') ? 'Rejected' : 'Yet to Evaluate';
            element["profile_image_url"] = element["profile_image_url"] ? element["profile_image_url"] : 'assets/images/img_avatar2.jpg';
          }
        });
        this.rowData = this.userList;
        this.getSummaryCount();
      },
      (err) => {
        this.rowData = [];
      }
    );
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format("LLL");
      return split;
    }
  }

        // Open dailog
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
      }
    });
  }

}
