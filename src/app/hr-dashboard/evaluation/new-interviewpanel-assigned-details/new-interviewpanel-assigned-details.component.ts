import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog, MatExpansionPanel, MatAccordion } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-new-interviewpanel-assigned-details',
  templateUrl: './new-interviewpanel-assigned-details.component.html',
  styleUrls: ['./new-interviewpanel-assigned-details.component.scss']
})
export class NewInterviewpanelAssignedDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatExpansionPanel, {static: false}) pannel?: MatExpansionPanel;
  @ViewChild(MatAccordion, {static: false}) accordion?: MatAccordion;

  selectedInstitute: any;
  selectedDiscipline: any;
  selectedEdu: any;
  selectedAssessment: any;
  selectedStatus: any = '1';
  allInstitutes: any;
  allDisciplines: any;
  EduLevel = DropdownListForKYC['level'];
  allEducations: any;
  allAssessments: any;
  routedData: any;
  statusList = [
    {
      name: 'Unassigned',
      value: '0'
    },
    {
      name: 'Assigned',
      value: '1'
    }
  ];

  paginationPageSize = 1000;
  cacheBlockSize: any = 1000;
  gridApi: any;
  gridApi1: any;
  columnDefs = [];
  columnDefs1 = [];
  defaultColDef = {
    flex: 1,
    minWidth: 40,
    resizable: true,
    floatingFilter: true,
    lockPosition: true,
    suppressMenu: true,
    unSortIcon: true,
  };
  rowData: any;
  searchBox = false;
  filterValue: string;
  reportDetails1: any;
  rowData1: any;
  // quickSearchValue: string;
  quickSearchValue = '';
  quickSearchValue1 = '';
  panelOpenState1 = true;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.editRouteParamGetter();
   }

  ngOnInit() {
    this.getInstitute();
    this.getEducation();
    this.tabledef();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
 }

  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['data']) {
        this.routedData = JSON.parse(params['data']);
        this.selectedInstitute = this.routedData.college_name;
        this.getParticularAssessmentAndDiscipline(this.selectedInstitute);
        this.selectedDiscipline = this.routedData.discipline;
        this.selectedEdu = this.routedData.education_level;
        this.selectedAssessment = this.routedData.assement_name;
        this.selectedStatus = '1';
        this.go();
      } else {
      }
      // this.assessmentDetails(params['data']);
      // this.getUsersList(params['data']);
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    // this.gridApi.sizeColumnsToFit();
    // this.gridApi.setDatasource(this.dataSources);
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  tabledef() {
    this.columnDefs = [
      {
        headerName: 'S no',
        valueGetter: (params) => {
          const i = +params.node.id + 1;
          return i ? i : 'Loading...';
        },
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 100,
        sortable: true
      },
      {
        headerName: 'Candidate id', field: 'candidate_id',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate name', field: 'name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { 'cursor': 'pointer', color: '#C02222' },
        cellRenderer: (params) => {
          return `<span style="border-bottom: solid #C02222 1px">${params['data']['name']} </span>`;
        }
      },
      {
        headerName: 'Email', field: 'email',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institue name', field: 'institue',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'institue',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Education level', field: 'level',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'level',
        valueGetter: (params) => {
          if (params.data.level == 'UG') {
            return 'Undergraduate';
          } else if (params.data.level == 'PG') {
            return 'Postgraduate';
          } else if (params.data.level == 'Diploma') {
            return 'Diploma';
          } else { return '-'; }
        },
      getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Panel assigned', field: 'panel_assigned',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'panel_assigned',
        valueGetter: (params) => {
          return params && params.data &&  params.data.panel_assigned ? params.data.panel_assigned : 'Unassigned'
        },
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Assessment', field: 'assement_name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'assement_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Documents submitted', field: 'document_submit',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 140,
        sortable: true,
        tooltipField: 'document_submit',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      // {
      //   headerName: 'Status', field: 'total_count',
      //   filter: true,
      //   floatingFilterComponentParams: { suppressFilterButton: true },
      //   sortable: true,
      //   valueGetter: (params) => {
      //     const total = +params.data.total_count;
      //     // console.log(params, total, 'vg');
      //     if (total === +params.data.updated_count + +params.data.success_count) {
      //       return 'All success';
      //     } else if (total === +params.data.duplicate_count + +params.data.existing_count + +params.data.failure_count) {
      //       return 'All failure';
      //     } else { return 'Partial success'; }
      //   },
      //   getQuickFilterText: (params) => {
      //     return params.value;
      //   }
      // },
      // {
      //   headerName: 'Link to download', field: 'report_url',
      //   cellStyle: { textAlign: 'center' },
      //   cellRenderer: (params) => {
      //     return '<span><i class="material-icons">get_app</i> </span>';
      //   }
      // }

    ];

    // this.service.getNotificationData(this.adminDetails._id)
    //   .subscribe((result: any) => {
    //     if (result.data && result.data.getnotificationreports?.message) {
    //       const reportDetails = result.data.getnotificationreports?.message || [];

    //       const array = reportDetails.filter((item) => {
    //         item.report_info.created_on = moment(item.report_info.updated_on).format('MM-DD-YYYY HH:mm a');
    //         return item.request_type === 'bulk_enrolment';
    //       });
    //       this.reportDetails = array;
          this.go();
    //     }
    //   });

  }

  onCellClicked(event) {
    if (event.colDef.field === 'name') {
      const param = {
        assessment: event['data'] && event['data']['shortlist_name'] ? event['data']['shortlist_name'] : '',
        cid: event['data'] && event['data']['candidate_id'] ? event['data']['candidate_id'] : '',
        name: event['data'] && event['data']['name'] ? event['data']['name'] : '',
        status: event['data'] && event['data']['evaluation_status'] ? event['data']['evaluation_status'] : '',
        tag: event['data'] && event['data']['tag'] ? event['data']['tag'] : '',
        uid: event['data'] && event['data']['uid'] ? event['data']['uid'] : ''
      }
      // this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SUB_ASSESSMENTS,  {data: this.nameOfAssessment, id: cid ? cid : '', name: name ? name : '', status: status ? status : '', tag: tag ? tag: '', uid: uid ? uid : ''});
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_PANEL_EVALUATION, { data: param['assessment'], id: param['cid'], name: param['name'], status: param['status'], tag: param['tag'], uid: param['uid'] });
    }
  }

  getModel(e) {
    // console.log(e);

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
      // this.toast.warning('No reuslts found');
    }
  }


  getParticularAssessmentAndDiscipline(data) {
    const apiData = {
      institute: data ? data : ''
    }
    this.adminService.getParticularInstituteDiscipline(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.allAssessments = data && data['assement_name'] ? data['assement_name'] : [];
      this.allDisciplines = data && data['discipline_array'] ? data['discipline_array'] : [];
    }, (err) => {
    });
  }

  instituteChange() {

  }

  instituteChangeForDiscipline(data) {
    this.getParticularAssessmentAndDiscipline(data);
  }

  getEducation() {
    let Temp = this.EduLevel ? this.EduLevel : [];
    const final = [];
    Temp.forEach(element => {
      if (element && element['name'] == 'UG') {
        final.push(element);
      }
      if (element && element['name'] == 'PG') {
        final.push(element);
      }
      if (element && element['name'] == 'Diploma') {
        final.push(element);
      }
    });
    this.allEducations = final ? final : [];
  }

  getInstitute() {
    this.adminService.getInterviewpanelInstitutes().subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.allInstitutes = data ? data : [];
    }, (err) => {
    });
  }

  go() {
    const apiData = {
      college_name: this.selectedInstitute ? this.selectedInstitute : '',
      discipline: this.selectedDiscipline ? this.selectedDiscipline : '',
      education_level: this.selectedEdu ? this.selectedEdu : '',
      assement_name: this.selectedAssessment ? this.selectedAssessment : '',
      status: this.selectedStatus ? this.selectedStatus : ''
    }

    this.adminService.getAlreadyAssigned(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      if(!this.pannel) { return } else {this.pannel.close()}
      this.rowData = data ? data : [];
          }, (err) => {
    });
  }

}
