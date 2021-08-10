import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';
import * as moment from 'moment'; //in your component

@Component({
  selector: "app-inv-particular-assessment-candidates",
  templateUrl: "./inv-particular-assessment-candidates.component.html",
  styleUrls: ["./inv-particular-assessment-candidates.component.scss"],
})
export class InvParticularAssessmentCandidatesComponent implements OnInit {
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
    this.buttonCheck = false;
    this.getSelectedCandidates = [];
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  sortevent(e) {}

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  };

  onCellClicked(event) {
    if (event.colDef.field === "candidate_name") {
      this.redirectToProfile(
        event["data"]["candidate_id"],
        event["data"]["candidate_name"],
        event["data"]["evaluation_status"],
        event["data"]["tag"],
        event["data"]["uid"],
        event["data"]["email"],
        event["data"]["form_id"]
      );
    }

    if (event.colDef.field === "evaluation_btn") {
      // if (event["data"] && event["data"]["evaluation_status"] != "2") {
        this.appConfig.setLocalData(
          "cProPic",
          event["data"]["profile_image_url"]
        );
        this.submit(
          event["data"]["candidate_id"],
          event["data"]["candidate_name"],
          event["data"]["evaluation_status"],
          event["data"]["tag"],
          event["data"]["uid"],
          event["data"]["email"],
          event["data"]["form_id"]
        );
      // }
    }

    if (event.colDef.field === "join_interview") {
      if (
        event["data"] &&
        event["data"]["join_interview"] == "Join Interview" &&
        event["data"] &&
        event["data"]["evaluation_status"] != "2"
      ) {
        this.appConfig.setLocalData(
          "cProPic",
          event["data"]["profile_image_url"]
        );
        this.redirectToEvaluationForm(
          event["data"]["candidate_id"],
          event["data"]["candidate_name"],
          event["data"]["evaluation_status"],
          event["data"]["tag"],
          event["data"]["uid"],
          event["data"]["email"],
          event["data"]["form_id"]
        );
      }
    }
  }

  getModel(e) {
    // console.log(e);

    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning("No search results found");
    }
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning("No search results found");
    }
  }
  tabledef() {
    if (this.appConfig.isWebrtc()) {
      this.columnDefs = [
        {
          headerCheckboxSelection: true,
          width: 50,
          maxWidth: 50,
          checkboxSelection: true,
          filter: false,
          sortable: false,
          field: "is_checked",
          headerName: "",
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
          headerName: "CID",
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
          headerName: "Assigned By",
          field: "assigned_by",
          filter: 'agTextColumnFilter',
          minWidth: 150,
          sortable: true,
          tooltipField: "assigned_by",
        },
        {
          headerName: "Interview Status",
          field: "evaluation_status_1",
          filter: 'agTextColumnFilter',
          minWidth: 100,
          sortable: true,
          tooltipField: "evaluation_status_1",
          cellRenderer: (params) => {
            if (
              params["data"] &&
              params["data"]["evaluation_status_1"] == "Completed"
            ) {
              return `<span class="status completed ">Completed</button>`;
            }
            if (
              params["data"] &&
              params["data"]["evaluation_status_1"] == "Submitted"
            ) {
              return `<span class=" status inprogress">Submitted</button>`;
            } else {
              return `<span class="status ">Scheduled</button>`;
            }
          },
        },
        {
          headerName: "Interview Sessions",
          field: "join_interview",
          filter: 'agTextColumnFilter',
          floatingFilterComponentParams: { suppressFilterButton: true },
          minWidth: 150,
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
            } else {
              return `<button class="join-inter disabled"><em class="icon-Join_Video"></em> ${params["data"]["join_interview"]}</button>`;
            }
          },
        },
        {
          headerName: "Evaluate",
          headerClass: 'ag-grid-header-center',
          field: "evaluation_btn",
          filter: false,
          floatingFilterComponentParams: { suppressFilterButton: false },
          minWidth: 110,
          sortable: false,
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
              return `<button class=" btn-outline checked"><em class="icon-checked"></em>${params["data"]["evaluation_btn"]}</button>`;
            } else {
              return `<button class=" btn-outline">${params["data"]["evaluation_btn"]}</button>`;
            }
          },
        },
        {
          headerName: "Status",
          headerClass: 'ag-grid-header-center',
          field: "interview_status",
          filter: 'agTextColumnFilter',
          minWidth: 110,
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
              params["data"]["interview_status"] == "Selected"
            ) {
              return `<span class="status completed">Selected</span>`;
            }
            if (
              params["data"] &&
              params["data"]["interview_status"] == "Rejected"
            ) {
              return `<span class="status rejected">Rejected</span>`;
            } else {
              if (params["data"] && params["data"]["interview_status"]) {
                return `<span class="status" >${params["data"]["interview_status"]}</span>`;
              } else {
                return "";
              }
            }
          },
        },
      ];
    } else {
      this.columnDefs = [
        {
          headerCheckboxSelection: true,
          width: 50,
          maxWidth: 50,
          checkboxSelection: true,
          filter: false,
          sortable: false,
          field: "is_checked",
          headerName: "",
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
          headerName: "CID",
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
          headerName: "Interview Status",
          field: "evaluation_status_1",
          filter: 'agTextColumnFilter',
          minWidth: 100,
          sortable: true,
          tooltipField: "evaluation_status_1",
          cellRenderer: (params) => {
            if (
              params["data"] &&
              params["data"]["evaluation_status_1"] == "Completed"
            ) {
              return `<span class="status completed ">Completed</button>`;
            }
            if (
              params["data"] &&
              params["data"]["evaluation_status_1"] == "Submitted"
            ) {
              return `<span class=" status inprogress">Submitted</button>`;
            } else {
              return `<span class="status ">Scheduled</button>`;
            }
          },
        },
        {
          headerName: "Evaluate",
          headerClass: 'ag-grid-header-center',
          field: "evaluation_btn",
          filter: 'agTextColumnFilter',
          minWidth: 110,
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
              return `<button class=" btn-outline checked"><em class="icon-checked"></em>${params["data"]["evaluation_btn"]}</button>`;
            } else {
              return `<button class=" btn-outline">${params["data"]["evaluation_btn"]}</button>`;
            }
          },
        },
        {
          headerName: "Status",
          headerClass: 'ag-grid-header-center',
          field: "interview_status",
          filter: 'agTextColumnFilter',
          minWidth: 110,
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
              params["data"]["interview_status"] == "Selected"
            ) {
              return `<span class="status completed">Selected</span>`;
            }
            if (
              params["data"] &&
              params["data"]["interview_status"] == "Rejected"
            ) {
              return `<span class="status rejected">Rejected</span>`;
            } else {
              if (params["data"] && params["data"]["interview_status"]) {
                return `<span class="status" >${params["data"]["interview_status"]}</span>`;
              } else {
                return "";
              }
            }
          },
        },
      ];
    }
    this.rowSelection = "multiple";
    this.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.evaluation_status == "1" : false;
    };
    this.getUsersList();
  }

  getInterview() {
    var obj = {
      email: this.appConfig.getLocalData("userEmail")
        ? this.appConfig.getLocalData("userEmail")
        : "",
    };
    this.adminService.getScheduledList(obj).subscribe(
      (result: any) => {
        if (result.success) {
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
            edgeData.endTime
          );
        }
      });
    });

    this.userList = this.userList.filter((element) => element.startTime);
    this.rowData = this.userList;

    this.getSummaryCount();
  }

  isTimeExpired(startTime, endTime) {
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
      return "Join Interview";
    } else {
      let custom = moment(returned_endate).diff(moment.now(), 'minutes');
      if (custom > 0) {
        return 'Yet to Start';
      } else {
        return "Time Expired";
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
      element.evaluation_status == '2' ? this.sentToHr.push(element) : element.evaluation_status == '1' ? this.buttonCheck = true : '';
      if (
        element.interview_status == "Selected" ||
        element.interview_status == "Rejected"
      ) {
        element.interview_status == "Selected"
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

    this.adminService.invSubmittedCandidatesList(apiData).subscribe(
      (datas: any) => {
        const align = datas ? datas : [];
        let counting = 0;
        this.userList = [];
        align.forEach((element) => {
          if (element) {
            counting = counting + 1;
            element["counter"] = counting;
            element["evaluation_btn"] = element.evaluation_status == '1' || element.evaluation_status == '2' ? 'Evaluated' : 'Evaluate';
            element["interview_status"] = element["interview_status"] == "Not Selected" ? 'Rejected' : element["interview_status"];
            element["evaluation_status_1"] =
              element.evaluation_status && element.evaluation_status == "2"
                ? "Submitted"
                : element.evaluation_status == "1"
                ? "Completed"
                : "Scheduled";
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

  submit(cid, name, status, tag, uid, email, form) {
    this.appConfig.routeNavigationWithQueryParam(
      CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.SUB_EVALUATION,
      {
        data: this.nameOfAssessment ? this.nameOfAssessment : "",
        id: cid ? cid : "",
        name: name ? name : "",
        status: status ? status : "",
        tag: tag ? tag : "",
        uid: uid ? uid : "",
        email: email ? email : "",
        form: form ? form : "",
      }
    );
  }

  redirectToEvaluationForm(cid, name, status, tag, uid, email, form) {
    this.appConfig.routeNavigationWithQueryParam(
      CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.JOIN_INTERVIEW,
      {
        data: this.nameOfAssessment ? this.nameOfAssessment : "",
        id: cid ? cid : "",
        name: name ? name : "",
        status: status ? status : "",
        tag: tag ? tag : "",
        uid: uid ? uid : "",
        email: email ? email : "",
        form: form ? form : "",
      }
    );
  }

  redirectToProfile(cid, name, status, tag, uid, email, form) {
    this.appConfig.routeNavigationWithQueryParam(
      CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.SUB_EMPLOYMENT,
      {
        data: this.nameOfAssessment ? this.nameOfAssessment : "",
        id: cid ? cid : "",
        name: name ? name : "",
        status: status ? status : "",
        tag: tag ? tag : "",
        uid: uid ? uid : "",
        email: email ? email : "",
        form: form ? form : "",
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
    this.adminService.invSubmittingCandidates(apiData).subscribe(
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
        this.ngOnInit();
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
