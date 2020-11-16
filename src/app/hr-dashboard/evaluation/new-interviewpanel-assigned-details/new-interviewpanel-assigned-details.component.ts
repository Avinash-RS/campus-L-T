import { Component, OnInit } from '@angular/core';
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-interviewpanel-assigned-details',
  templateUrl: './new-interviewpanel-assigned-details.component.html',
  styleUrls: ['./new-interviewpanel-assigned-details.component.scss']
})
export class NewInterviewpanelAssignedDetailsComponent implements OnInit {

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

  paginationPageSize = 10;
  cacheBlockSize: any = 10;
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


//   columnDefs = [
//     { field: 'make', sortable: true, filter: true },
//     { field: 'model', sortable: true, filter: true },
//     { field: 'price', sortable: true, filter: true }
// ];
// rowData = [
//     { make: 'Toyota', model: 'Celica', price: 35000 },
//     { make: 'Ford', model: 'Mondeo', price: 32000 },
//     { make: 'Porsche', model: 'Boxter', price: 72000 }
// ];


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
        console.log('null');        
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
      },
      {
        headerName: 'Candidate id', field: 'candidate_id',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        // comparator: this.customComparator,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate name', field: 'name',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Email', field: 'email',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Institue name', field: 'institue',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Education level', field: 'level',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Panel assigned', field: 'panel_assigned',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Assessment', field: 'evaluation_status',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Documents submitted', field: 'hr_assign_result',
        filter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        sortable: true,
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

   const dummy = [
      {
          "candidate_id": "2020000015781",
          "name": "Varun Chakravarthy",
          "email": "varunchakravarthy.candidate@mailinator.com",
          "institue": "VESIT  Mumbai",
          "discipline": "Electronics and Communication",
          "level": "UG",
          "uid": "15781",
          "panel_assigned": "Anand Narayan Subramanyam Swami Krishna Vamsi Ram Narayan( Communications )",
          "evaluation_status": "0",
          "hr_assign_result": "1"
      },
      {
          "candidate_id": "2020000015779",
          "name": "Kuldeep Yadav",
          "email": "kuldeepyadav.candidate@mailinator.com",
          "institue": "VESIT  Mumbai",
          "discipline": "Civil",
          "level": "UG",
          "uid": "15779",
          "panel_assigned": "Anand Narayan Subramanyam Swami Krishna Vamsi Ram Narayan( Communications )",
          "evaluation_status": "0",
          "hr_assign_result": "1"
      }
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
          this.rowData = dummy;
    //     }
    //   });

  }

  onCellClicked(event) {
    console.log(event);
    
    // if (event.colDef.field === 'report_url') {
    //   window.location.href = event.value;
    // }
  }

  getModel(e) {
    console.log(e);
    
    // const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    // if (filteredArray?.length === 0) {
    //   // this.toast.warning('No results found');
    // }
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      console.log('adad');
      
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
    console.log('apiData', apiData);
    
    // this.adminService.getAlreadyAssigned(apiData).subscribe((data: any) => {
    //   this.appConfig.hideLoader();      
    //   console.log('data', data);
      
      // const datas = data ? data : [];
      // this.showDefault = false;
      // this.getUsersList(datas);
    // }, (err) => {
    // });
  }

}
