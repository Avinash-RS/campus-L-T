import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
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
          this.gridApi.setColumnDefs(this.videoAssessmentColumns());
          this.getUsersList();
        } else {
          this.gridApi.setColumnDefs(this.columnDefSetting());
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
        event["data"]["shortlist_name"]
        );
    }

    if (event.colDef.field === "evaluation_btn") {
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
          event["data"]["shortlist_name"]
        );
    }

    if (event.colDef.field === "join_interview") {
      if (
        event["data"] &&
        event["data"]["join_interview"] == "Join Interview" &&
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
          event["data"]["shortlist_name"]
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
    if (this.drivePermissions && this.drivePermissions.video_assessment) {
      this.gridApi.setColumnDefs(this.videoAssessmentColumns());
    } else {
      this.gridApi.setColumnDefs(this.columnDefSetting());
    }
    this.rowSelection = "multiple";
    this.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.normal_assessment.evaluation_status == "1" : false;
    };
  }

  columnDefSetting() {
    this.columnDefs = [
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
        headerName: "Date/Time of Interview",
        field: "startTime",
        filter: 'agTextColumnFilter',
        minWidth: 310,
        sortable: true,
        tooltipField: "startTime",
        cellRenderer: (params) => {
            return `${params["data"]["startTime"]} - ${params["data"]["endTime"]}`;
        },
      },
      {
        headerName: "Assigned by",
        field: "assigned_by",
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 150,
        sortable: true,
        tooltipField: "assigned_by",
      },
      {
        headerName: "Interview Status",
        field: "evaluation_status_1",
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        minWidth: 100,
        sortable: true,
        tooltipField: "evaluation_status_1",
        cellRenderer: (params) => {
          if (
            params["data"] &&
            params["data"]["evaluation_status_1"] == "Completed"
          ) {
            return `<span class="status inprogress-bg">Completed</button>`;
          }
          if (
            params["data"] &&
            params["data"]["evaluation_status_1"] == "Submitted"
          ) {
            return `<span class=" status completed-bg">Submitted</button>`;
          } else {
            return `<span class="status scheduled-bg">Scheduled</button>`;
          }
        },
      },
      {
        headerName: "Interview Sessions",
        field: "join_interview",
        filter: 'agSetColumnFilter',
        filterParams: {
          applyMiniFilterWhileTyping: true
        },
        headerClass: 'ag-grid-header-center',
        minWidth: 340,
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
          if (params["data"] && params["data"]["join_interview"] == "Join Interview") {
            return `<button class="join-inter"><em class="icon-Join_Video"></em> ${params["data"]["join_interview"]}</button>`;
          }
          if (params["data"] && params["data"]["join_interview"] == "Interview Completed") {
            return `<button class="join-inter completed-bg" style="cursor: not-allowed !important"><em class="icon-Join_Video"></em> ${params["data"]["join_interview"]}</button>`;
          }
          // if (params["data"] && params["data"]["join_interview"] == "-") {
          //   return `Not Scheduled`;
          // }
          else {
            return `<button class="join-inter disabled"><em class="icon-Join_Video"></em> ${params["data"]["join_interview"]}</button>`;
          }
        },
      },
      {
        headerName: "Evaluate",
        headerClass: 'ag-grid-header-center',
        field: "evaluation_btn",
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
            (params["data"]["evaluation_btn"] == "Evaluated")
          ) {
              return `<button class=" btn-outline checked inprogress-bg"><em class="icon-checked"></em>${params["data"]["evaluation_btn"]}</button>`;
          }
          if (params["data"] && params["data"]["evaluation_btn"] == "Submitted") {
            return `<button class=" btn-outline checked completed-bg"><em class="icon-checked"></em>${params["data"]["evaluation_btn"]}</button>`;
          } else {
            return `<button class=" btn-outline">${params["data"]["evaluation_btn"]}</button>`;
          }
        },
      },
      {
        headerName: "Status",
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
        cellStyle: {
          textAlign: "center",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        },
        cellRenderer: (params) => {
          if (
            params["data"] &&
            params["data"]["normal_assessment"]["interview_status"] == "Selected"
          ) {
            return `<span class="status completed-bg">Selected</span>`;
          }
          if (
            params["data"] &&
            params["data"]["normal_assessment"]["interview_status"] == "Rejected"
          ) {
            return `<span class="status rejected-bg">Rejected</span>`;
          } else {
            if (params["data"] && params["data"]["normal_assessment"]["interview_status"]) {
              return `<span class="status inprogress-bg">${params["data"]["normal_assessment"]["interview_status"]}</span>`;
            } else {
              return "";
            }
          }
        },
      },
    ];
    return this.columnDefs;
  }

  videoAssessmentColumns() {
    let videoColumns = this.columnDefSetting();
    let videoObj = {
      headerName: "Video Assessment Status",
      headerClass: 'ag-grid-header-center',
      field: "video_assessment.evaluation_status",
      filter: 'agSetColumnFilter',
      filterParams: {
        applyMiniFilterWhileTyping: true
      },
      minWidth: 130,
      sortable: true,
      hide: this.drivePermissions && this.drivePermissions.video_assessment ? false : true,
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
        } else {

          if (
            params["data"] &&
            params["data"]["video_assessment"]["evaluation_status"] == "Selected"
          ) {
            return `<span class="status completed-bg">Selected</span>`;
          }
          if (
            params["data"] &&
            params["data"]["video_assessment"]["evaluation_status"] == "Rejected"
          ) {
            return `<span class="status rejected-bg">Rejected</span>`;
          }
          if (
            params["data"] &&
            params["data"]["video_assessment"]["evaluation_status"] == "Hold"
          ) {
            return `<span class="status inprogress-bg">Hold</span>`;
          } else {
            if (params["data"] && params["data"]["video_assessment"]["evaluation_status"]) {
              return `<span class="status inprogress-blue-bg">${params["data"]["video_assessment"]["evaluation_status"]}</span>`;
            } else {
              return "";
            }
          }
        }
      },
    }
    let findLastIndex = videoColumns.length - 1;
    videoColumns.splice(findLastIndex, 0, videoObj);
    return videoColumns;
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
          element.assigned_by = edgeData.createdByName
            ? edgeData.createdByName
            : "-";
          element.startTime = this.momentForm(edgeData.startTime);
          element.endTime = this.momentForm(edgeData.endTime);
          element.join_interview = this.isTimeExpired(
            edgeData.startTime,
            edgeData.endTime,
            element.normal_assessment.evaluation_status
          );
        }
      });
    });

    // this.userList = this.userList.filter((element) => element.startTime);
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
      return  status == '0' ? "Join Interview" : status == '1' ? 'Join Interview' : 'Interview Completed';
    } else {
      let custom = moment(returned_endate).diff(moment.now(), 'minutes');
      if (custom > 0) {
        return status == '0' ? "Yet to Start" : status == '1' ? 'Yet to Start' : 'Interview Completed';
      } else {
        return status == '0' ? "Time Expired" : status == '1' ? 'Time Expired' : 'Interview Completed';
      }
    }
  }

  removeInterviewer(userDetail) {
    return userDetail.find((element) => element.type == "candidate");
  }

  getSummaryCount() {
    this.selectedCount = [];
    this.rejectedCount = [];
    this.sentToHr = [];
    this.userList.forEach((element) => {
      element.normal_assessment.evaluation_status == '2' ? this.sentToHr.push(element) : element.normal_assessment.evaluation_status == '1' ? this.buttonCheck = true : '';
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
        let counting = 0;
        this.userList = [];
        align.forEach((element) => {
          if (element) {
            counting = counting + 1;
            element["counter"] = counting;
            element["evaluation_btn"] = element.normal_assessment.evaluation_status == '1' ? 'Evaluated' : element.normal_assessment.evaluation_status == '2' ? 'Submitted' : 'Yet to Evaluate';
            element["video_assessment"]["evaluation_status"] = element["video_assessment"]["evaluation_status"] == "3" ? 'Rejected' : (element["video_assessment"]["evaluation_status"] == '2' ? 'Hold' : element["video_assessment"]["evaluation_status"] == '1' ? 'Selected' : 'Yet to Evaluate');
            element["normal_assessment"]["interview_status"] = element["normal_assessment"]["interview_status"] == "Not Selected" ? 'Rejected' : element["normal_assessment"]["interview_status"];
            element["profile_image_url"] = element["profile_image_url"] ? element["profile_image_url"] : 'assets/images/img_avatar2.jpg';
            element["evaluation_status_1"] =
              element.normal_assessment.evaluation_status && element.normal_assessment.evaluation_status == "2"
                ? "Submitted"
                : element.normal_assessment.evaluation_status == "1"
                ? "Completed"
                : "Scheduled";
            element.assigned_by = "-";
            element.startTime = '';
            element.endTime = '';
            element.join_interview = "Not Scheduled";
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
      (err) => {}
    );
  }

  submit(cid, name, status, tag, uid, email, form, shortlist) {
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
        shortlist_name: shortlist ? shortlist : ""
      }
    );
  }

  redirectToEvaluationForm(cid, name, status, tag, uid, email, form, shortlist) {
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
        shortlist_name: shortlist ? shortlist : ""
      }
    );
  }

  redirectToProfile(cid, name, status, tag, uid, email, form, shortlist) {
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
        shortlist_name: shortlist ? shortlist : ""
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
    const apiData = {
      userid: [],
    };
    this.getSelectedCandidates.forEach((element) => {
      if (element) {
        apiData["userid"].push(
          element["data"] && element["data"]["uid"]
            ? element["data"]["uid"]
            : ""
        );
      }
    });
   this.invSubmittingCandidatesSubscription = this.adminService.invSubmittingCandidates(apiData).subscribe(
      (data: any) => {
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

        // this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.CANDIDATE_DETAILS_SUBMITTED, { data: this.nameOfAssessment });
      },
      (err) => {}
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
