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

@Component({
  selector: "app-inv-particular-assessment-candidates",
  templateUrl: "./inv-particular-assessment-candidates.component.html",
  styleUrls: ["./inv-particular-assessment-candidates.component.scss"],
})
export class InvParticularAssessmentCandidatesComponent implements OnInit, OnDestroy {
  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
  @ViewChild('errorTemplateRef', {static: false}) errorTemplateRef: TemplateRef<any>;
  selectedUserDetail: any;
  userList: any;
  buttonCheck;
  selectAllCheck;
  assessmentName: any;
  nameOfAssessment: any;
  displayNoRecords = false;
  getSelectedCandidates: any;
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef : any;
  rowData: any = [];
  searchBox = false;
  filterValue: string;
  quickSearchValue = "";
  gridColumnApi: any;
  isChecked: boolean;
  public rowSelection;
  public isRowSelectable;
  selectedCount: any = [];
  rejectedCount: any = [];
  scheduleListDetails: any;
  sentToHr: any = [];

  refreshSubscription: Subscription;
  getScheduledListSubscription: Subscription;
  invSubmittedCandidatesListSubscription: Subscription;
  invSubmittingCandidatesSubscription: Subscription;
  drivePermissions: any;
  errorTemplateRefVar: any;
  errorReportDetailsArray: any = [];
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
    this.buttonCheck = false;
    this.getSelectedCandidates = [];
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.getScheduledListSubscription ? this.getScheduledListSubscription.unsubscribe() : '';
    this.invSubmittedCandidatesListSubscription ? this.invSubmittedCandidatesListSubscription.unsubscribe() : '';
    this.invSubmittingCandidatesSubscription ? this.invSubmittingCandidatesSubscription.unsubscribe() : '';
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST)) {
        this.quickSearchValue = '';
        this.buttonCheck = false;
        this.getSelectedCandidates = [];
        this.drivePermissions = this.appConfig.getSelectedDrivePermissions();
        if (this.drivePermissions && this.drivePermissions.video_assessment) {
          this.gridApi.setColumnDefs(null);
          this.drivePermissionBasedColumnDefinitions();
          this.getUsersList();
          this.isRowSelectableMethod();
        } else {
          this.drivePermissionBasedColumnDefinitions();
          this.getUsersList();
          this.isRowSelectableMethod();
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
      this.appConfig.setLocalData(
        "cProPic",
        event["data"]["profile_image_url"]
      );
      this.redirectToProfile(
        event["data"]["candidate_id"],
        event["data"]["candidate_name"],
        event["data"]["normal_assessment"]["evaluation_status"],
        event["data"]["tag"],
        event["data"]["uid"],
        event["data"]["email"],
        event["data"]["form_id"],
        event["data"]["video_assessment"],
        event["data"]["shortlist_name"],
        event["data"]["is_video_scheduled"],
        event["data"]["is_normal_scheduled"]
        );
    }

    if (event.colDef.field === "video_assessment.evaluation_statusForDisplay") {
      if (event["data"]["video_assessment"] && event["data"]["video_assessment"]["scheduled_status"] == 1) {
      this.appConfig.setLocalData(
        "cProPic",
        event["data"]["profile_image_url"]
      );
      this.redirectToVideoSchedule(
        event["data"]["candidate_id"],
        event["data"]["candidate_name"],
        event["data"]["normal_assessment"]["evaluation_status"],
        event["data"]["tag"],
        event["data"]["uid"],
        event["data"]["email"],
        event["data"]["form_id"],
        event["data"]["video_assessment"],
        event["data"]["shortlist_name"],
        event["data"]["is_video_scheduled"],
        event["data"]["is_normal_scheduled"]
        );
      }
    }

    if (event.colDef.field === "normal_evaluation_btn") {
        this.appConfig.setLocalData(
          "cProPic",
          event["data"]["profile_image_url"]
        );
        this.submit(
          event["data"]["candidate_id"],
          event["data"]["candidate_name"],
          event["data"]["normal_assessment"]["evaluation_status"],
          event["data"]["tag"],
          event["data"]["uid"],
          event["data"]["email"],
          event["data"]["form_id"],
          event["data"]["video_assessment"],
          event["data"]["shortlist_name"],
          event["data"]["is_video_scheduled"],
          event["data"]["is_normal_scheduled"]
          );
    }

    if (event.colDef.field === "Video_Interview_join_interview") {
      if (
        event["data"] &&
        event["data"]["Video_Interview_join_interview"] == "Join Interview" &&
        event["data"] &&
        event["data"]["normal_assessment"]["evaluation_status"] != "2"
      ) {
        this.appConfig.setLocalData(
          "cProPic",
          event["data"]["profile_image_url"]
        );
        this.redirectToEvaluationForm(
          event["data"]["candidate_id"],
          event["data"]["candidate_name"],
          event["data"]["normal_assessment"]["evaluation_status"],
          event["data"]["tag"],
          event["data"]["uid"],
          event["data"]["email"],
          event["data"]["form_id"],
          event["data"]["video_assessment"],
          event["data"]["shortlist_name"],
          event["data"]["is_video_scheduled"],
          event["data"]["is_normal_scheduled"]
        );
      }
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
    this.isRowSelectableMethod();
  }

  drivePermissionBasedColumnDefinitions() {
      let savedefaultColumns: any = this.defaultColumns();
      let saveVideoAssessColumns: any = this.videoAssessmentColumns();
      let saveVideoInterviewColumns: any = this.videoInterviewColumns();
      let saveEvaluationFormColumns: any = this.EvaluationFormColumns();
      let merging = savedefaultColumns;
      if (this.appConfig.getSelectedDrivePermissions().video_assessment) {
       merging = merging.concat(saveVideoAssessColumns);
      }
      if (this.appConfig.getSelectedDrivePermissions().interview_assignment) {
       merging = merging.concat(saveVideoInterviewColumns);
      }
      if (this.appConfig.getSelectedDrivePermissions().normal_assessment) {
       merging = merging.concat(saveEvaluationFormColumns);
      }
      this.gridApi.setColumnDefs(merging);
  }

  isRowSelectableMethod() {
    this.rowSelection = "multiple";
    if (this.drivePermissions && this.drivePermissions.normal_assessment && this.drivePermissions.video_assessment) {
      this.isRowSelectable = function (rowNode) {
      return (rowNode.data && rowNode.data.video_assessment && rowNode.data.video_assessment.evaluation_status && (rowNode.data.video_assessment.evaluation_status == 'Selected' || rowNode.data.video_assessment.evaluation_status == 'Rejected')) && (rowNode.data && rowNode.data.normal_assessment.evaluation_status == "1" && rowNode.data.normal_assessment.interview_status == "Selected") ? true : false;
    }
    };
    if (this.drivePermissions && this.drivePermissions.normal_assessment && !this.drivePermissions.video_assessment) {
        this.isRowSelectable = function (rowNode) {
        return rowNode.data ? (rowNode.data.normal_assessment.evaluation_status == "1" && rowNode.data.normal_assessment.interview_status == "Selected") : false;
      }
    };
    if (this.drivePermissions && this.drivePermissions.video_assessment && !this.drivePermissions.normal_assessment) {
      this.isRowSelectable = function (rowNode) {
      return rowNode.data && rowNode.data.video_assessment && rowNode.data.video_assessment.evaluation_status && (rowNode.data.video_assessment.evaluation_status == 'Selected' || rowNode.data.video_assessment.evaluation_status == 'Rejected') ? true : false;
    }
   };
  }

  defaultColumns() {
    return [
      {
        headerName: 'Candidate Info',
        children: [
      {
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        width: 50,
        maxWidth: 50,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        field: "is_checked",
        headerName: "",
      },
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
        field: "email",
        filter: 'agTextColumnFilter',
        minWidth: 180,
        sortable: true,
        tooltipField: "email",
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
        field: "normal_assessment.scheduled_by",
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 150,
        sortable: true,
        tooltipField: "normal_assessment.scheduled_by",
        valueGetter: (params) => {
          return params.data.normal_assessment.scheduled_by ? params.data.normal_assessment.scheduled_by : '-';
        }
      }
    ]
  }
 ]
}

  videoInterviewColumns() {
    return [
    {
        headerName: 'Interview Sessions',
        children: [
          {
            headerName: "Date/Time of Interview",
            field: "Video_Interview_startTime",
            filter: 'agTextColumnFilter',
            minWidth: 310,
            sortable: true,
            tooltipField: "Video_Interview_startTime",
            cellRenderer: (params) => {
                return `${params["data"]["Video_Interview_startTime"]} - ${params["data"]["Video_Interview_endTime"]}`;
            },
          },
          {
          headerName: "Interview Sessions",
          field: "Video_Interview_join_interview",
          filter: 'agSetColumnFilter',
          filterParams: {
            applyMiniFilterWhileTyping: true
          },
          headerClass: 'ag-grid-header-center',
          minWidth: 240,
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
            if (params["data"] && params["data"]["Video_Interview_join_interview"] == "Join Interview") {
              return `<button class="interview-button ag-grid-buttons-icon rejected-color"><em style="margin-top: 3px;" class="icon-Join_Video"></em> ${params["data"]["Video_Interview_join_interview"]}</button>`;
            }
            if (params["data"] && params["data"]["Video_Interview_join_interview"] == "Completed") {
              return `<button class="interview-button ag-grid-buttons-icon completed-color" style="cursor: not-allowed !important"><em style="margin-top: 3px;" class="icon-Join_Video"></em> ${params["data"]["Video_Interview_join_interview"]}</button>`;
            }
            if (params["data"] && params["data"]["Video_Interview_join_interview"] == "Yet to Start") {
              return `<button class="interview-button ag-grid-buttons-icon yet-to-start-color" style="cursor: not-allowed !important"><em style="margin-top: 3px;" class="icon-Join_Video"></em> ${params["data"]["Video_Interview_join_interview"]}</button>`;
            }
            if (params["data"] && params["data"]["Video_Interview_join_interview"] == "Time Expired") {
              return `<button class="interview-button ag-grid-buttons-icon not-scheduled-white-color" style="cursor: not-allowed !important"><em style="margin-top: 3px;" class="icon-Join_Video"></em> ${params["data"]["Video_Interview_join_interview"]}</button>`;
            }
            else {
              return `<button class="interview-button ag-grid-buttons-icon not-scheduled-white-color disabled"><em style="margin-top: 3px;" class="icon-Join_Video"></em> ${params["data"]["Video_Interview_join_interview"]}</button>`;
            }
          },
        },
        {
          headerName: "Feedback",
          field: "feedback",
          filter: 'agTextColumnFilter',
          minWidth: 120,
          sortable: true,
          tooltipField: "feedback",
          getQuickFilterText: (params) => {
            return params.value;
          },
        }
    ]
   }
 ]
}

  EvaluationFormColumns() {
    return [
    {
        headerName: 'Evaluation Form',
        children: [
      {
        headerName: "Evaluation Status",
        headerClass: 'ag-grid-header-center',
        field: "normal_evaluation_btn",
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 200,
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
            params["data"] &&
            (params["data"]["normal_evaluation_btn"] == "Evaluated")
          ) {
              return `<button class="btn-outline checked inprogress-bg"><em class="icon-checked"></em>${params["data"]["normal_evaluation_btn"]}</button>`;
          }
          if (params["data"] && params["data"]["normal_evaluation_btn"] == "Submitted") {
            return `<button class="btn-outline checked completed-bg"><em class="icon-checked"></em>${params["data"]["normal_evaluation_btn"]}</button>`;
          } else {
            return `<button class="btn-outline">${params["data"]["normal_evaluation_btn"]}</button>`;
          }
        },
      },
      {
        headerName: "Evaluation Status",
        headerClass: 'ag-grid-header-center',
        field: "normal_assessment.interview_status",
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 130,
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellClass: 'ag-grid-status',
        cellRenderer: (params) => {
          if (
            params["data"] &&
            params["data"]["normal_assessment"]["interview_status"] == "Selected"
          ) {
            return `<span class="status-field completed-color">Selected</span>`;
          }
          if (
            params["data"] &&
            params["data"]["normal_assessment"]["interview_status"] == "Rejected"
          ) {
            return `<span class="status-field rejected-color">Rejected</span>`;
          } else {
            if (params["data"] && params["data"]["normal_assessment"]["interview_status"]) {
              return `<span class="status-field inprogress-color">${params["data"]["normal_assessment"]["interview_status"]}</span>`;
            } else {
              return "";
            }
          }
        },
      },
    ]
   }
  ];
}

  videoAssessmentColumns() {
    return [
    {
      headerName: 'Video Assessments',
      children: [
      {
      headerName: "Video Assessment Status",
      headerClass: 'ag-grid-header-center',
      field: "video_assessment.test_status",
      filter: 'agSetColumnFilter',
      filterParams: {
        applyMiniFilterWhileTyping: true
      },
      minWidth: 130,
      sortable: true,
      getQuickFilterText: (params) => {
        return params.value;
      },
      cellClass: 'ag-grid-status',
      cellRenderer: (params) => {
        if (
          params["data"] &&
          params["data"]["video_assessment"] && params["data"]["video_assessment"]["scheduled_status"] != 1
        ) {
          return `<span class="status-field not-scheduled-color">Not Scheduled</span>`;
        } else {
          if (
            params["data"] &&
            params["data"]["video_assessment"] && params["data"]["video_assessment"]["test_status"] == "Completed"
          ) {
            return `<span class="status-field completed-color">Completed</span>`;
          }
          if (
            params["data"] &&
            params["data"]["video_assessment"] && params["data"]["video_assessment"]["test_status"] == "In Progress"
          ) {
            return `<span class="status-field inprogress-color">In Progress</span>`;
          }
          if (
            params["data"] &&
            params["data"]["video_assessment"] && params["data"]["video_assessment"]["test_status"] == "Yet to Start"
          ) {
            return `<span class="status-field yet-to-start-color">Yet to Start</span>`;
          }
          if (
            params["data"] &&
            params["data"]["video_assessment"] && params["data"]["video_assessment"]["test_status"] == "Time Expired"
          ) {
            return `<span class="status-field rejected-color">Time Expired</span>`;
          } else {
            if (params["data"] && params["data"]["video_assessment"] && params["data"]["video_assessment"]["test_status"]) {
              return `<span class="status-field not-scheduled-color">Not Scheduled</span>`;
            } else {
              return "";
            }
          }
        }
      },
      },
      {
        headerName: "Video Evaluation Status",
        headerClass: 'ag-grid-header-center',
        field: "video_assessment.evaluation_statusForDisplay",
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 130,
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellClass: 'ag-grid-status',
        cellRenderer: (params) => {
          if (
            params["data"] &&
            params["data"]["video_assessment"] && params["data"]["video_assessment"]["scheduled_status"] != 1
          ) {
            return `<span class="status-field not-scheduled-color">Not Scheduled</span>`;
          }
          if (
            params["data"] &&
            params["data"]["video_assessment"] && params["data"]["video_assessment"]["test_status"] == "Time Expired"
          ) {
            return `<span class="status-field rejected-color pointer">Time Expired</span>`;
          } else {
            if (
              params["data"] &&
              params["data"]["video_assessment"] && params["data"]["video_assessment"]["evaluation_status"] == "Selected"
            ) {
              return `<span class="status-field completed-color pointer">Selected</span>`;
            }
            if (
              params["data"] &&
              params["data"]["video_assessment"] && params["data"]["video_assessment"]["evaluation_status"] == "Rejected"
            ) {
              return `<span class="status-field rejected-color pointer">Rejected</span>`;
            } else {
              // if (params["data"] && params["data"]["video_assessment"] && params["data"]["video_assessment"]["evaluation_status"]) {
                return `<span class="status-field yet-to-start-color pointer">Yet to Evaluate</span>`;
              // } else {
                // return "";
              // }
            }
          }
        },
      },
  ]
 }
]
}


  getInterview() {
    var obj = {
      email: this.appConfig.getLocalData("userEmail")
        ? this.appConfig.getLocalData("userEmail")
        : "",
    };
   this.getScheduledListSubscription = this.adminService.getScheduledList(obj).subscribe(
      (result: any) => {
        if (result && result.success) {
          this.scheduleListDetails = result.data;
          this.scheduleListDetails.forEach((element, i) => {
            if (element.userDtl) {
              element.link =
                element.userDtl && element.userDtl ? element.userDtl : "";
              let candidateData = this.removeInterviewer(element.userDtl);
              element.emailId =
                candidateData && candidateData.emailId
                  ? candidateData.emailId
                  : "";
            }
          });
          this.mergePhpAndEdgeService(this.scheduleListDetails);
        } else {
          this.rowData = this.userList;
        }
      },
      (err) => {
        this.rowData = this.userList;
      }
    );
  }

  mergePhpAndEdgeService(edgeSeviceData) {
    this.userList.forEach((element) => {
      edgeSeviceData.forEach((edgeData) => {
        if (element.email == edgeData.emailId) {
          element.feedback = edgeData.feedback ? edgeData.feedback : '-';
          element.videoInvStatus = edgeData.status ? edgeData.status : 'Time Expired';
          element.Video_Interview_assigned_by = edgeData.createdByName
            ? edgeData.createdByName
            : "-";
          element.Video_Interview_startTime = this.momentForm(edgeData.startTime);
          element.Video_Interview_endTime = this.momentForm(edgeData.endTime);
          element.Video_Interview_join_interview = this.isTimeExpired(
            edgeData.startTime,
            edgeData.endTime,
            element.videoInvStatus
          );
        }
      });
    });

    this.rowData = this.userList;

    this.getSummaryCount();
  }

  isTimeExpired(startTime, endTime, status) {
    var returned_startdate = moment(startTime).subtract(1, "hours");
    var returned_endate = moment(endTime).add(1, "hours");
    let isValidTime;
    if (returned_startdate && returned_endate) {
      isValidTime = moment(moment.now()).isBetween(
        returned_startdate,
        returned_endate
      );
    }
    if (isValidTime) {
      return  status == 'Yet to Start' ? "Join Interview" : status == 'Completed' ? 'Completed' : 'Time Expired';
    } else {
      let custom = moment(returned_endate).diff(moment.now(), 'minutes');
      if (custom > 0) {
        return status == 'Yet to Start' ? "Yet to Start" : status == 'Completed' ? 'Completed' : 'Time Expired';
      } else {
        return status == 'Yet to Start' ? "Time Expired" : status == 'Completed' ? 'Completed' : 'Time Expired';
      }
    }
  }

  removeInterviewer(userDetail) {
    return userDetail.find((element) => element.type == "candidate");
  }

  getSummaryCount() {
    this.selectedCount = [];
    this.rejectedCount = [];
    this.candidatesEvaluated = [];
    this.sentToHr = [];
  //   if (this.appConfig.getSelectedDrivePermissions().video_assessment && this.appConfig.getSelectedDrivePermissions().normal_assessment) {
  //     this.userList.forEach((element) => {
  //       if (element.normal_assessment.evaluation_status == '2' && element.video_assessment.sent_to_hr == 1) {
  //         this.sentToHr.push(element);
  //       }
  //       if (element.normal_assessment.evaluation_status == '1' && (element.video_assessment.evaluated_by && element.video_assessment.sent_to_hr != 1)) {
  //         this.candidatesEvaluated.push(element);
  //       }
  //       if (element.normal_assessment.evaluation_status == '1' && element.normal_assessment.interview_status == 'Selected' && element.video_assessment.evaluation_status && element.video_assessment.evaluation_status == 'selected' && element.video_assessment.sent_to_hr != 1) {
  //         this.buttonCheck = true;
  //         this.selectedCount.push(element);
  //       }
  //       if (element.normal_assessment.evaluation_status == '1' && element.normal_assessment.interview_status == 'Rejected' || (element.video_assessment.evaluation_status && element.video_assessment.evaluation_status == 'rejected')) {
  //         this.rejectedCount.push(element);
  //       }
  //   });
  // } else {
  //   if (this.appConfig.getSelectedDrivePermissions().video_assessment) {
  //   this.userList.forEach((element) => {
  //     if (element.video_assessment.sent_to_hr == 1) {
  //       this.sentToHr.push(element);
  //     }
  //     if (element.video_assessment.evaluated_by && element.video_assessment.sent_to_hr != 1) {
  //       this.candidatesEvaluated.push(element);
  //     }
  //     if ((element.video_assessment.evaluation_status && element.video_assessment.evaluation_status == 'selected') && element.video_assessment.sent_to_hr != 1) {
  //       this.buttonCheck = true;
  //       this.selectedCount.push(element);
  //     }
  //     if (element.video_assessment.evaluation_status && element.video_assessment.evaluation_status == 'rejected') {
  //       this.rejectedCount.push(element);
  //     }
  //   });
  // }
  if (this.appConfig.getSelectedDrivePermissions().normal_assessment || true) {
    this.userList.forEach((element) => {
      element.normal_assessment.evaluation_status == '2' ? this.sentToHr.push(element) : element.normal_assessment.evaluation_status == '1' ? (this.buttonCheck = true && this.candidatesEvaluated.push(element)) : '';
      if (
        element.normal_assessment.interview_status == "Selected" ||
        element.normal_assessment.interview_status == "Rejected"
      ) {
        element.normal_assessment.interview_status == "Selected"
          ? this.selectedCount.push(element)
          : this.rejectedCount.push(element);
      }
    });
   }
  }
// }
  // To get all users
  getUsersList() {
    // const apiData = {
    //   shortlist_name: name,
    // };
    const apiData = {
      inv_id: this.appConfig.getLocalData("userId")
        ? this.appConfig.getLocalData("userId")
        : "",
    };
    setTimeout(() => {
      this.gridApi.showLoadingOverlay();
    }, 500);
   this.invSubmittedCandidatesListSubscription = this.adminService.invSubmittedCandidatesList(apiData).subscribe(
      (datas: any) => {
        const align = datas ? datas : [];
        this.userList = [];
        align.forEach((element) => {
          if (element) {
            element["normal_evaluation_btn"] = element.normal_assessment.evaluation_status == '1' ? 'Evaluated' : element.normal_assessment.evaluation_status == '2' ? 'Submitted' : 'Yet to Evaluate';
            element.video_assessment = element.video_assessment ? element.video_assessment : {};
            element.video_assessment.test_status = element["video_assessment"] && element["video_assessment"]["test_status"] == "YetToStart" ? 'Yet to Start' : (element["video_assessment"] && element["video_assessment"]["test_status"] == 'InProgress' ? 'In Progress' : element["video_assessment"] && element["video_assessment"]["test_status"] ? element["video_assessment"]["test_status"] : '');
            element.video_assessment.evaluation_status = element["video_assessment"] && element["video_assessment"]["evaluation_status"] == "selected" ? 'Selected' : (element["video_assessment"] && element["video_assessment"]["evaluation_status"] == 'rejected') ? 'Rejected' : (element["video_assessment"] && element["video_assessment"]["evaluation_status"] == 'on hold') ? 'On Hold' : '';
            element["normal_assessment"]["interview_status"] = element["normal_assessment"]["interview_status"] == "Not Selected" ? 'Rejected' : element["normal_assessment"]["interview_status"];
            element["profile_image_url"] = element["profile_image_url"] ? element["profile_image_url"] : 'assets/images/img_avatar2.jpg';
            // Video Assessment evaluation status updation for display in ag grid
            if (
              element &&
              element["video_assessment"] && element["video_assessment"]["scheduled_status"] != 1
            ) {
              element["video_assessment"]['evaluation_statusForDisplay'] = "Not Scheduled";
            }
            else if (
              element &&
              element["video_assessment"] && element["video_assessment"]["test_status"] == "Time Expired"
            ) {
              element["video_assessment"]['evaluation_statusForDisplay'] = "Time Expired";
            } else {
              if (
                element &&
                element["video_assessment"] && element["video_assessment"]["evaluation_status"] == "Selected"
              ) {
                element["video_assessment"]['evaluation_statusForDisplay'] = "Selected";
              }
              else if (
                element &&
                element["video_assessment"] && element["video_assessment"]["evaluation_status"] == "Rejected"
              ) {
                element["video_assessment"]['evaluation_statusForDisplay'] = "Rejected";
              } else {
                element["video_assessment"]['evaluation_statusForDisplay'] = "Yet to Evaluate";
              }
            }
            element.Video_Interview_assigned_by = "-";
            element.Video_Interview_startTime = '';
            element.Video_Interview_endTime = '';
            element.Video_Interview_join_interview = "Not Scheduled";
            element.feedback = '-';
            this.userList.push(element);
          }
        });
        if (this.appConfig.isWebrtc()) {
          this.getInterview();
        } else {
          this.rowData = this.userList;
          this.getSummaryCount();
        }
      },
      (err) => {
        this.rowData = [];
        this.candidatesEvaluated = [];
        this.selectedCount = [];
        this.rejectedCount = [];
        this.sentToHr = [];
      }
    );
  }

  redirectToVideoSchedule(cid, name, status, tag, uid, email, form, videoSchedule, shortlist, videoShow, evaluationShow) {
    this.appConfig.setLocalData('tabIndex', 2);
    this.appConfig.routeNavigationWithQueryParam(
      CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION,
      {
        data: this.nameOfAssessment ? this.nameOfAssessment : "",
        id: cid ? cid : "",
        name: name ? name : "",
        status: status ? status : "",
        tag: tag ? tag : "",
        uid: uid ? uid : "",
        email: email ? email : "",
        form: form ? form : "",
        videoSchedule: videoSchedule ? JSON.stringify(videoSchedule): '',
        shortlist_name: shortlist ? shortlist : "",
        videoShow, evaluationShow
      }
    );
  }

  submit(cid, name, status, tag, uid, email, form, videoSchedule, shortlist, videoShow, evaluationShow) {
    this.appConfig.setLocalData('tabIndex', 4);
    this.appConfig.routeNavigationWithQueryParam(
      CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION,
      {
        data: this.nameOfAssessment ? this.nameOfAssessment : "",
        id: cid ? cid : "",
        name: name ? name : "",
        status: status ? status : "",
        tag: tag ? tag : "",
        uid: uid ? uid : "",
        email: email ? email : "",
        form: form ? form : "",
        videoSchedule: videoSchedule ? JSON.stringify(videoSchedule): '',
        shortlist_name: shortlist ? shortlist : "",
        videoShow, evaluationShow
      }
    );
  }

  redirectToEvaluationForm(cid, name, status, tag, uid, email, form, videoSchedule, shortlist, videoShow, evaluationShow) {
    this.appConfig.setLocalData('tabIndex', 3);
    this.appConfig.routeNavigationWithQueryParam(
      CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION,
      {
        data: this.nameOfAssessment ? this.nameOfAssessment : "",
        id: cid ? cid : "",
        name: name ? name : "",
        status: status ? status : "",
        tag: tag ? tag : "",
        uid: uid ? uid : "",
        email: email ? email : "",
        form: form ? form : "",
        videoSchedule: videoSchedule ? JSON.stringify(videoSchedule): '',
        shortlist_name: shortlist ? shortlist : "",
        videoShow, evaluationShow
      }
    );
  }

  redirectToProfile(cid, name, status, tag, uid, email, form, videoSchedule, shortlist, videoShow, evaluationShow) {
    this.appConfig.setLocalData('tabIndex', 0);
    this.appConfig.routeNavigationWithQueryParam(
      CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION,
      {
        data: this.nameOfAssessment ? this.nameOfAssessment : "",
        id: cid ? cid : "",
        name: name ? name : "",
        status: status ? status : "",
        tag: tag ? tag : "",
        uid: uid ? uid : "",
        email: email ? email : "",
        form: form ? form : "",
        videoSchedule: videoSchedule ? JSON.stringify(videoSchedule): '',
        shortlist_name: shortlist ? shortlist : "",
        videoShow, evaluationShow
      }
    );
  }

  finalSubmit() {
    if (this.gridApi.getSelectedNodes().length > 0) {
      this.getSelectedCandidates = this.gridApi.getSelectedNodes();
      const data = {
        evaluation: "candidates",
      };
      this.openDialog(ShortlistBoxComponent, data);
    } else {
      this.appConfig.nzNotification(
        "error",
        "Not selected",
        "No candidates have been selected"
      );
    }
  }
  finalSubmitAPI() {
    const user_details = [];
    this.getSelectedCandidates.forEach((element) => {
      if (element && element["data"]["uid"] && element["data"]["shortlist_name"]) {
        let user = {
          user_id: element["data"]["uid"],
          shortlist_name: element["data"]["shortlist_name"]
        };
        user_details.push(user);
      }
    });
   this.invSubmittingCandidatesSubscription = this.adminService.invSubmittingCandidates(user_details).subscribe(
      (data: any) => {
      this.errorReportDetailsArray = [];
      if (data && data.length > 0) {
        this.errorReportDetailsArray = data;
        this.openMatDialog();
      } else {
        const datas = {
          iconName: "",
          dataToBeShared: {
            confirmText: `Selected candidates have been submitted successfully`,
            type: "assign-hr",
            identity: "panel-assign",
          },
          showConfirm: "Confirm",
          interViwePanelAssign: "noData",
          showCancel: "",
          showOk: "",
        };
        this.openDialog(ShortlistBoxComponent, datas);
      }
    },
      (err) => {}
    );
  }

  openMatDialog() {
    this.errorTemplateRefVar = this.matDialog.open(this.errorTemplateRef, {
      width: '700px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'errorTemplateRefPopUp'
    });
  }

  closeDialog() {
    this.quickSearchValue = '';
    this.buttonCheck = false;
    this.getSelectedCandidates = [];
    this.getUsersList();
    this.errorTemplateRefVar.close();
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
      width: "auto",
      height: "auto",
      autoFocus: false,
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.finalSubmitAPI();
      }
      if (data && data["interViwePanelAssign"]) {
        this.quickSearchValue = '';
        this.buttonCheck = false;
        this.getSelectedCandidates = [];
        this.getUsersList();
      }
    });
  }

  // Open dailog
  openDialog4(component, data) {
    let dialogDetails: any;

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: "auto",
      height: "auto",
      autoFocus: false,
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
