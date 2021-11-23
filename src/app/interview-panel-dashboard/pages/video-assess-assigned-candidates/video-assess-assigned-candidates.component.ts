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
  rowData: any = [];
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
      if (data.includes(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST)) {
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
          cellStyle: {
            textAlign: "center",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
          },
          cellRenderer: (params) => {
            if (
              params["data"] &&
              params["data"]["video_assessment"] && params["data"]["video_assessment"]["scheduled_status"] != 1
            ) {
              return `<span class="status scheduled-bg">Not Scheduled</span>`;
            }
            if (
              params["data"] &&
              params["data"]["video_assessment"] && params["data"]["video_assessment"]["test_status"] == "Time Expired"
            ) {
              return `<span style="cursor: pointer;" class="status scheduled-bg">Time Expired</span>`;
            } else {
              if (
                params["data"] &&
                params["data"]["video_assessment"] && params["data"]["video_assessment"]["evaluation_status"] == "Selected"
              ) {
                return `<span style="cursor: pointer;" class="status completed-bg">Selected</span>`;
              }
              if (
                params["data"] &&
                params["data"]["video_assessment"] && params["data"]["video_assessment"]["evaluation_status"] == "Rejected"
              ) {
                return `<span style="cursor: pointer;" class="status rejected-bg">Rejected</span>`;
              } else {
                // if (params["data"] && params["data"]["video_assessment"] && params["data"]["video_assessment"]["evaluation_status"]) {
                  return `<span style="cursor: pointer;" class="status inprogress-blue-bg">Yet to Evaluate</span>`;
                // } else {
                  // return "";
                // }
              }
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
        element.normal_assessment.interview_status == "Selected" ||
        element.normal_assessment.interview_status == "Rejected"
      ) {
        element.normal_assessment.interview_status == "Selected"
          ? this.selectedCount.push(element)
          : this.rejectedCount.push(element);
      }
    });
  }
  // To get all users
  getUsersList() {
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
            this.userList.push(element);
          }
        });
          this.rowData = this.userList;
          this.getSummaryCount();
      },
      (err) => {}
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

  momentForm(date) {
    if (date) {
      const split = moment(date).format("LLL");
      return split;
    }
  }

}
