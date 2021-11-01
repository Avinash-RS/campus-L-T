import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { ModuleRegistry, AllModules, IDatasource, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);
import { GridChartsModule } from '@ag-grid-enterprise/charts';
import { ClickableStatusBarComponent } from './custom-get-selected-rows-count';
import { firstShortlistFilterModel } from './firstShortlist_filtermodel';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment'; //in your component
import { DropdownListForKYC } from 'src/app/constants/kyc-dropdownlist-details';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';
ModuleRegistry.registerModules([GridChartsModule]);

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MY_FORMATS_Month = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-shortlisted-candidate-list',
  templateUrl: './shortlisted-candidate-list.component.html',
  styleUrls: ['./shortlisted-candidate-list.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS || MY_FORMATS_Month },
  ],
})
export class ShortlistedCandidateListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('customFilter', { static: false }) customFilterRef: TemplateRef<any>;
  @ViewChild('lastAppliedFilterViewPopUp', { static: false }) lastAppliedFilterViewPopUp: TemplateRef<any>;

  filterProfileList = 'Profile List';
  filterGenderList = 'Gender';
  filterDOBList = 'Date of Birth';
  filterEducationList = 'Education Level';
  filterBacklogsList = 'Total Backlogs';
  lastAppliedFilter: any;
  profileDropDownValues = this.firstShortlistFilterModel.getProfileList();
  genderDropDownValues = this.firstShortlistFilterModel.getGenderList();
  educationDropDownValues = this.firstShortlistFilterModel.getEducationList();
  backlogsDropDownValues = this.firstShortlistFilterModel.getBacklogsList();
  getSpecificBacklogsList = this.firstShortlistFilterModel.getSpecificBacklogsList();
  HSCDiscipline = DropdownListForKYC['HSCDiscipline'];
  diplamoSpecialization = [
    {
      label: 'Diploma Engineering',
      value: 'Diploma Engineering'
    }
  ];


ugSpecializationList: any;
pgSpecializationList: any;
diplomaDisciplineList: any;
ugDisciplineList: any;
pgDisciplineList: any;
diplomaInstitutesList: any;
ugInstitutesList: any;
pgInstitutesList: any;

  minDate: Date;
  maxDate: Date;
  dateFrom = new FormControl(null);
  dateTo = new FormControl(null);

  educationForm: FormGroup;
  form_education_array = 'Education_Array';
  form_education_level = 'level';
  form_education_percentage_from = 'percentage_from';
  form_education_percentage_to = 'percentage_to';
  form_education_yearOfPassing_from = 'yearOfPassingFrom';
  form_education_yearOfPassing_to = 'yearOfPassingTo';
  form_education_institute = 'institute';
  form_education_specialization = 'specialization';
  form_education_discipline = 'discipline';
  form_education_backlogs = 'backlogs';
  form_education_checked = 'checked';

  instituteList = DropdownListForKYC.institutes;
  // serverSide Things
  rowSelection: any;
  userList: any = [];
  pageRowCount = 0;

  // Ag grid
  paginationPageSize: any = 100;
  cacheBlockSize: any = 100;
  gridApi: any;
  columnDefs: any;
  defaultColDef: any = this.appConfig.agGridWithServerSideAllFunc();

  rowData: any = [];
  quickSearchValue = '';
  public gridColumnApi;
  public rowModelType;
  public serverSideStoreType;

  public frameworkComponents;
  public statusBar;
  public sideBar;
  public paginationNumberFormatter;
  public rowClassRules;
  public autoGroupColumnDef;
  public detailCellRendererParams;
  // statusBar:any;
  public components;
  public getNodeChildDetails;
  isRowSelectable: any;
  resultsLength: any;
  fres: any;
  selectedCustomFilterListValue: any;
  FilterdialogRef: any;
  lastAppliedFilterdialogRef: any;
  lastAPICalledFilter: any;
  buttonLoading = false;
  refreshTrue: boolean;
  refreshSubscription: Subscription;
  getCandidateListForShortlistSubscription: Subscription;
  submitShortlistedCandidatesSubscription: Subscription;
  getAllEducationFormDropdownListSubscription: Subscription;
  constructor(
    private appConfig: AppConfigService,
    private firstShortlistFilterModel: firstShortlistFilterModel,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private matDialog: MatDialog,
    private dialog: MatDialog,
    public globalValidator: GlobalValidatorService,
    private fb: FormBuilder,
    private sharedService: SharedServiceService,
    private router: Router
  ) {
    this.dateValidation();
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRSTSHORTLISTING_LIST)) {
        this.gridApi.deselectAll();
        this.clearAllFilters();
      }
    });
  }

  dateValidCustomCheck(isDateFrom) {
      if (isDateFrom) {
        let startDate = this.dateFrom.value;
        if (this.dateTo && this.dateTo.value && startDate && this.dateTo.valid) {
        let dateFrom = moment(startDate).format();
        let dateTo = moment(this.dateTo.value).format();
        let isEndDateBeforeStartDate = moment(dateTo).isBefore(dateFrom);
        isEndDateBeforeStartDate ? this.dateTo.setErrors({notValid: true}) : this.dateTo.setErrors(null);
        if (!isEndDateBeforeStartDate) {
          this.dateTo.updateValueAndValidity();
        }
      }
     } else {
        let endDate = this.dateTo.value;
        if (this.dateFrom && this.dateFrom.value && endDate) {
          let dateFrom = moment(this.dateFrom.value).format();
          let dateTo = moment(endDate).format();
          let isEndDateBeforeStartDate = moment(dateTo).isBefore(dateFrom);
          isEndDateBeforeStartDate ? this.dateTo.setErrors({notValid: true}) : this.dateTo.setErrors(null);
          if (!isEndDateBeforeStartDate) {
            this.dateTo.updateValueAndValidity();
          }
        }
     }
  }

  dateValidation() {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 90, 0, 1);
    // this.maxDate = new Date(currentYear + 20, 11, 31);
    // this.maxDate = new Date(currentYear - 16, 0, 1);
    this.maxDate = new Date();
  }

chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, i, formname) {
  if (this.dateConvertion(normalizedMonth['_d'])) {
    if (formname == '1') {
      this.getEducationArr.at(i).patchValue({
        [this.form_education_yearOfPassing_from]: this.dateConvertionMonth(normalizedMonth['_d']),
      });
    } else {
      this.getEducationArr.at(i).patchValue({
        [this.form_education_yearOfPassing_to]: this.dateConvertionMonth(normalizedMonth['_d']),
      });
    }
}
  datepicker.close();
}

dateConvertion(date) {
  if (date) {
    const split = moment(date).format();
    if (split == 'Invalid date') {
      const ddFormat = moment(date, 'DD-MM-YYYY').format();
      return ddFormat == 'Invalid date' ? null : ddFormat;
    }
   return split == 'Invalid date' ? null : split;
  }
}

dateShowFormat(date) {
  if (date) {
    const split = moment(date).format('DD MMM YYYY');
    if (split == 'Invalid date') {
      const ddFormat = moment(date, 'DD-MM-YYYY').format('DD MMM YYYY');
      return ddFormat == 'Invalid date' ? null : ddFormat;
    }
    return split == 'Invalid date' ? null : split;
  }
}

dateConvertionMonth(date) {
  if (date) {
    const split = moment(date).format();
    if (split == 'Invalid date') {
      const ddFormat = moment(date, 'DD-MM-YYYY').format();
      return ddFormat == 'Invalid date' ? null : ddFormat;
    }
   return split == 'Invalid date' ? null : split;
  }
}

  ngOnInit() {
    this.formArrayInitialize();
    this.defaultColDef = this.appConfig.agGridWithServerSideAllFuncWithRowGrouping();
    this.defaultColDef.checkboxSelection = this.isFirstColumn;
    this.defaultColDef.enableValue = false;
    this.defaultColDef.enableRowGroup = false;
    this.defaultColDef.enablePivot = false;
    this.tableDef();
    this.frameworkComponents = {
      clickableStatusBarComponent: ClickableStatusBarComponent,
    };
    this.statusBar = {
      statusPanels: [{ statusPanel: 'clickableStatusBarComponent' }],
    };
    this.educationDropdownValuesAPI();
    this.refreshOndriveChangeRXJS();
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.getCandidateListForShortlistSubscription ? this.getCandidateListForShortlistSubscription.unsubscribe() : '';
    this.submitShortlistedCandidatesSubscription ? this.submitShortlistedCandidatesSubscription.unsubscribe() : '';
    this.getAllEducationFormDropdownListSubscription ? this.getAllEducationFormDropdownListSubscription.unsubscribe() : '';
  }

  selectAll(e) {
    this.selectorUnselectAllCheckbox(e);
  }

  selectorUnselectAllCheckbox(condition) {
    this.gridApi.collapseAll();
    let endIndex = this.gridApi.paginationProxy.bottomDisplayedRowIndex;
    let startIndex = endIndex - 99;
    this.gridApi.forEachNode((row, index) => {
      if (row['rowIndex'] >= startIndex && row['rowIndex'] <= endIndex) {
        this.gridApi.getRowNode(row.id).selectThisNode(condition);
      }
    });
  }

  checkFilterAppied() {
    let savedFilterModel = this.gridApi && this.gridApi.getFilterModel();
    let check = Object.keys(savedFilterModel).length === 0 && savedFilterModel.constructor === Object ? true : false;
    return !check;
  }

  tableDef() {
    let table_headers = [
      {
        headerName: 'Candidate Information',
        children: [
          {
            headerName: 'Candidate Id', field: 'candidate_id', //colId: 'ccandidate_id',
            minWidth: 140,
            filter: "agTextColumnFilter",
            filterParams: {
              suppressAndOrCondition: true,
              filterOptions: ['contains']
            },
            sortable: true,
            resizable:true,
            columnGroupShow: null,
            tooltipField: 'candidate_id',
            getQuickFilterText: (params) => {
              return params.value;
            }
          },
          {
            headerName: "Candidate Name",
            field: "candidate_name",
            filter: "agTextColumnFilter",
            filterParams: {
              suppressAndOrCondition: true,
              filterOptions: ['contains']
            },
            sortable: true,
            rowGroup: false,
            columnGroupShow: null,
            tooltipField: 'candidate_name',
            getQuickFilterText: (params) => {
              return params.value;
            },
            cellRenderer: (params) => {
              if (params['data']['kyc_exempted'] && params['data']['kyc_exempted'] == 'no') {
                return `<span style="border-bottom: solid #C02222 1px; cursor: pointer; color: #C02222;">${params['data']['candidate_name']} </span>`;
              } else {
                return `${params['data']['candidate_name']}`
              }
            }
          },
          {
            headerName: "Email Id",
            field: "email",
            filter: "agTextColumnFilter",
            filterParams: {
              suppressAndOrCondition: true,
              filterOptions: ['contains']
            },
            // rowGroup: true,
            // enableRowGroup: true,
            columnGroupShow: null,
            tooltipField: 'email',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Is KYC Skipped",
            field: "kyc_exempted",
            filter: 'agSetColumnFilter',
            filterParams: {
              values: params => {
                  // async update simulated using setTimeout()
                  setTimeout(() => {
                      // fetch values from server
                      const values = ['Yes', 'No'];
                      // supply values to the set filter
                      params.success(values);
                  }, 1000);
            },
            },
            sortable: true,
            columnGroupShow: null,
            tooltipField: 'kyc_exempted',
            getQuickFilterText: (params) => {
              return params.value;
            },
            cellRenderer: (params) => {
              return params['data']['kyc_exempted'];
            }
          },
          {
            headerName: "For Grouping",
            field: "emailId",
            filter: false,
            filterParams: {
              suppressAndOrCondition: true,
              filterOptions: ['contains']
            },
            tooltipField: 'emailId',
            rowGroup: true,
            hide: true,
            sortable: false,
            enableRowGroup: true,
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Gender",
            field: "gender",
            filter: false,
            columnGroupShow: 'open',
            tooltipField: 'gender',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Date of Birth",
            field: "dob",
            filter: false,
            columnGroupShow: 'open',
            tooltipField: 'dob',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Tag Name",
            field: "tag_name",
            filter: "agTextColumnFilter",
            filterParams: {
              suppressAndOrCondition: true,
              filterOptions: ['contains']
            },
            columnGroupShow: 'open',
            tooltipField: 'tag_name',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Profile List",
            field: "position_applied_for",
            columnGroupShow: 'open',
            filter: false,
            tooltipField: 'position_applied_for',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Total Backlogs",
            field: "total_backlog",
            filter: false,
            columnGroupShow: 'open',
            tooltipField: 'total_backlog',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
        ]
      },
      {
        headerName: 'Educational Details',
        children: [
          {
            headerName: "Education Level",
            field: "education.level",
            filter: false,
            sortable: false,
            tooltipField: 'education.level',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Institute",
            field: "education.institute",
            filter: false,
            sortable: false,
            tooltipField: 'education.institute',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Specialization",
            field: "education.specification",
            filter: false,
            sortable: false,
            tooltipField: 'education.specification',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Discipline",
            field: "education.discipline",
            filter: false,
            sortable: false,
            tooltipField: 'education.discipline',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Year of Passing",
            field: "education.year_of_passing",
            filter: false,
            sortable: false,
            tooltipField: 'education.year_of_passing',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Percentage",
            field: "education.percentage",
            filter: false,
            sortable: false,
            tooltipField: 'education.percentage',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
          {
            headerName: "Backlogs",
            field: "education.backlogs",
            filter: false,
            sortable: false,
            tooltipField: 'education.backlogs',
            getQuickFilterText: (params) => {
              return params.value;
            },
          },
        ]
      }
    ];

    this.columnDefs = table_headers;
    this.autoGroupColumnDef = {
      headerName: "",
      field: 'candidate_id',
      filter: false,
      sortable: false,
      maxWidth: 80,
      resizable:false,
      tooltipField: 'candidate_id',
      getQuickFilterText: (params) => {
        return params.value;
      },
      cellRendererParams: {
        innerRenderer: function (params) {
          return params.data.candidate_id;
        },
      }
    };
    this.serverSideStoreType = 'partial';
    this.rowModelType = 'serverSide';
    this.rowSelection = 'multiple';
    this.isRowSelectable = function (rowNode) {
      return rowNode.level == 0;
    };
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.gridColumnApi = params.gridColumnApi;

    var datasource = this.callApiForGetShortlistingCandidates();
    params.api.setServerSideDatasource(datasource);
  }

  isFirstColumn(params) {
    var displayedColumns = params.columnApi.getAllDisplayedColumns();
    var thisIsFirstColumn = displayedColumns[0] === params.column;
    return params.node.level == '1' ? false : thisIsFirstColumn;
  }

  onGroupOpened(event) {
    // console.log('e', event);
  }

  onFilterChanged(e) {
    this.gridApi.deselectAll();
    this.gridApi.paginationGoToFirstPage();
    this.gridApi.refreshServerSideStore({ purge: true });
  }

  callApiForGetShortlistingCandidates() {
    return {
      getRows: (params) => {
    if (this.lastAppliedFilter) {
          let filterModel = {
            ...params.request.filterModel,
            ...this.lastAPICalledFilter
          }
          params.request.filterModel = filterModel;
        }

        if (this.refreshTrue) {
          params.request.filterModel = {};
          params.request.sortModel = {};
          this.refreshTrue = false;
        }
        let apiData: any = params;
          if (params.request && params.request.groupKeys && params.request.groupKeys.length == 0) {
            this.gridApi.hideOverlay();
            this.buttonLoading = true;
           this.getCandidateListForShortlistSubscription = this.adminService.getCandidateListForShortlist(params.request).subscribe((data1: any) => {
              this.buttonLoading = false;
              this.userList = data1 && data1['data'] ? data1['data'] : [];
              this.userList.forEach(element => {
                if (element && element.educations) {
                  element.educations.forEach(ele => {
                    element.education = ele;
                  });
                }
              });
              if (this.userList.length > 0) {
                this.gridApi.hideOverlay();
                let count = params.startRow;
                this.userList.forEach((element, i) => {
                  element.emailId = element.educations && element.educations.length > 0 ? element.email : null;
                  count = count + 1;
                  element['counter'] = count;
                });
                this.pageRowCount = data1 && data1['total_count'] ? data1['total_count'] : 0;
                params.success({
                  rowData: this.userList,
                  rowCount: this.pageRowCount
                });

              } else {
                params.success({
                  rowData: [],
                  rowCount: 0
                });
                this.gridApi.showNoRowsOverlay();
              }
            }, (err) => {
              this.gridApi.retryServerSideLoads();
              this.buttonLoading = false;
              params.fail();
            });
          } else {
            const subArray = this.userList.find(data => {
              if (data.email == params.request.groupKeys[0].toString()) {
                return data.email == params.request.groupKeys[0].toString()
              }
            });
            let customizeDataForNestedLevel = [];
            if (subArray.educations && subArray.educations.length > 0) {
              subArray.educations.pop();
              subArray.educations.forEach(element => {
                let main: any = {
                  candidate_id: subArray.candidate_id ? '' : '',
                  candidate_name: subArray.candidate_name ? '' : '',
                  email: subArray.email ? '' : '',
                  gender: subArray.gender ? '' : '',
                  dob: subArray.dob ? '' : '',
                  position_applied_for: subArray.position_applied_for ? '' : '',
                  tag_name: subArray.tag_name ? '' : '',
                  total_backlog: subArray.total_backlog ? '' : ''
                };
                main.education = element;
                customizeDataForNestedLevel.push(main);
              });
            }
            let newSubUserList = customizeDataForNestedLevel && customizeDataForNestedLevel.length > 0 ? customizeDataForNestedLevel : [];
            if (newSubUserList.length > 0) {
              params.success({
                rowData: newSubUserList,
                rowCount: newSubUserList.length
              });
            } else {
              params.fail();
            }
          }
      }
    }
  }

  paginationChanged(e) {
  }

  sortevent(e) {
    this.gridApi.deselectAll();
    this.gridApi.refreshServerSideStore({ purge: true });
  }

  unselectAllSelected() {
    this.gridApi.forEachNode((row, index) => {
    this.gridApi.getRowNode(row.id).selectThisNode(false);
    });
    return true;
  }

  onCellClicked(event) {
    if (event.colDef.field === 'candidate_name' && event['data'] && (event['data']['kyc_exempted'] && event['data']['kyc_exempted'] == 'no')) {
      const data = {
        candidate_user_id: event['data'] && event['data']['user_id'] ? event['data']['user_id'] : '',
        candidateName: event['data'] && event['data']['candidate_name'] ? event['data']['candidate_name'] : '',
      };
      this.openDialog1(CommonKycProfileViewComponent, data);
  }
  }

  onFirstDataRendered(params) {
    // params.api.sizeColumnsToFit();
    // setTimeout(function () {
    //   params.api.getDisplayedRowAtIndex(1).setExpanded(true);
    // }, 0);
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('LLL');
      return split;
    }
  }


  shortlist() {

    const data = {
      shortlist: 'first'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }
  apiShortlistSubmit(apiDatas) {
    let apiData;
    let user_ids = [];
    let getSelectedCandidates = this.gridApi.getSelectedNodes();
    getSelectedCandidates.forEach(element => {
      if (element['data']) {
        user_ids.push(element['data']['user_id']);
      }
    });
    apiData = {
      user_id: user_ids,
      folder_name: apiDatas && apiDatas['folderName'] ? apiDatas['folderName'] : '',
      shortlist_name: apiDatas && apiDatas['shortlistName'] ? apiDatas['shortlistName'] : '',
      field_assement_type: apiDatas && apiDatas['type'] ? apiDatas['type'] : 'rec',
      shortlistby: this.appConfig.getLocalData('username'),
    };
    this.submitShortlistedCandidatesSubscription = this.adminService.submitShortlistedCandidates(apiData).subscribe((data: any) => {
      const datas = {
        first_level_shortlist_success: 'first_level_shortlist_success'
      };
      this.gridApi.deselectAll();
      this.clearAllFilters();
      this.openDialog1(ShortlistBoxComponent, datas);
    }, (err) => {

    });
  }

  ngAfterViewInit() {
    // // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
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
        this.apiShortlistSubmit(result);
      }
    });
  }


  // Open dailog
  openDialog1(component, data) {
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

  UnsavedclearAllFilters() {
    this.profileDropDownValues = this.firstShortlistFilterModel.getProfileList();
    this.genderDropDownValues = this.firstShortlistFilterModel.getGenderList();
    this.patchCheck();
    this.backlogsDropDownValues = this.firstShortlistFilterModel.getBacklogsList();
    this.dateFrom.setValue(null);
    this.dateTo.setValue(null);
  }

  clearAllFilters() {
    if (!this.buttonLoading) {
    this.refreshTrue = true;
    this.profileDropDownValues = this.firstShortlistFilterModel.getProfileList();
    this.genderDropDownValues = this.firstShortlistFilterModel.getGenderList();
    this.patchCheck();
    this.lastAppliedFilter = null;
    this.backlogsDropDownValues = this.firstShortlistFilterModel.getBacklogsList();
    this.dateFrom.setValue(null);
    this.dateTo.setValue(null);
    this.gridApi.paginationGoToFirstPage();
    this.gridApi.setFilterModel(null);
    this.gridApi.setSortModel(null);
    this.gridApi.refreshServerSideStore({ purge: true });
    }
  }

  selectedCustomFilterList(selectedFilterList) {
    this.selectedCustomFilterListValue = selectedFilterList;
  }

  viewLastAppliedFilter() {
    this.lastAppliedFilterdialogRef = this.dialog.open(this.lastAppliedFilterViewPopUp, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForlastViewPopup'
    });
  }
  customFilterOpen() {
    this.selectedCustomFilterListValue = this.selectedCustomFilterListValue ? this.selectedCustomFilterListValue : this.filterProfileList;
    this.dateValidCustomCheck(true);
    this.dateValidCustomCheck(false);
    this.FilterdialogRef = this.dialog.open(this.customFilterRef, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForcustomFilter'
    });
  }

  closeDialog() {
    this.FilterdialogRef.close();
    this.lastAppliedFilterdialogRef ? this.lastAppliedFilterdialogRef.close() : '';
  }
formArrayInitialize() {
  this.educationForm = this.fb.group({
    [this.form_education_array]: this.fb.array([])
  });
  this.patchCheck();
}

initEducationArray() {
  return this.fb.group({
    [this.form_education_checked]: [false],
    [this.form_education_level]: [null],
    [this.form_education_percentage_from]: [null, [RemoveWhitespace.whitespace(), this.globalValidator.percentageNew(), this.globalValidator.percentage(), Validators.maxLength(5)]],
    [this.form_education_percentage_to]: [null, [RemoveWhitespace.whitespace(), this.globalValidator.percentageNew(), this.globalValidator.percentage(), Validators.maxLength(5)]],
    [this.form_education_yearOfPassing_from]: [null],
    [this.form_education_yearOfPassing_to]: [null],
    [this.form_education_institute]: [null],
    [this.form_education_specialization]: [null],
    [this.form_education_discipline]: [null],
    [this.form_education_backlogs]: [null],
  })
}

patchCheck() {
  this.getEducationArr.clear();
  this.educationDropDownValues.forEach(element => {
    let data = {
      [this.form_education_checked]: false,
      [this.form_education_level]: element,
      [this.form_education_percentage_from]: null,
      [this.form_education_percentage_to]: null,
      [this.form_education_yearOfPassing_from]: null,
      [this.form_education_yearOfPassing_to]: null,
      [this.form_education_institute]: null,
      [this.form_education_specialization]: null,
      [this.form_education_discipline]: null,
      [this.form_education_backlogs]: null,
      }
      this.getEducationArr.push(this.patchEducationArray(data));
  });
}

startTrue(param) {
  return this.regexValidator({notValid: true}, param);
}

PercentageValidator(param) {
  return this.PercentageregexValidator({notValid: true}, param);
}

    // Custom regex validator
    regexValidator(error: ValidationErrors, param): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {
        if (!control.value) {
          return null;
        }
        if (param) {
          let startYearOfPassing = control['_parent']['controls'][this.form_education_yearOfPassing_from].value;
          let EndYearOfPassing = control.value;
          let controls = control['_parent']['controls'][this.form_education_yearOfPassing_to];
          if (startYearOfPassing && EndYearOfPassing) {
            let dateFrom = moment(startYearOfPassing).format();
            let dateTo = moment(EndYearOfPassing).format();
            let isEndDateBeforeStartDate = moment(dateTo).isBefore(dateFrom);
            return isEndDateBeforeStartDate ? {notValid: true} : null;
          } else {
            return null;
          }
        } else {
          let startYearOfPassing = control.value;
          let EndYearOfPassing = control['_parent']['controls'][this.form_education_yearOfPassing_to].value;
          let controls = control['_parent']['controls'][this.form_education_yearOfPassing_to];
          if (startYearOfPassing && EndYearOfPassing) {
            let dateFrom = moment(startYearOfPassing).format();
            let dateTo = moment(EndYearOfPassing).format();
            let isEndDateBeforeStartDate = moment(dateTo).isBefore(dateFrom);
            isEndDateBeforeStartDate ? control['_parent']['controls'][this.form_education_yearOfPassing_to].setErrors({notValid: true}) : control['_parent']['controls'][this.form_education_yearOfPassing_to].setErrors(null);
          } else {
            controls.setErrors(null);
          }
        }
    }
  }

      // Custom regex validator
      PercentageregexValidator(error: ValidationErrors, param): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
          if (!control.value) {
            return null;
          }
          if (param) {
            let percentageFrom = control['_parent']['controls'][this.form_education_percentage_from].value;
            let percentageTo = control.value;
            let controls = control['_parent']['controls'][this.form_education_percentage_to];
            if (percentageFrom && percentageTo) {
              let dateFrom = Number(percentageFrom);
              let dateTo = Number(percentageTo)
              let isPercentageToLesser = dateTo < dateFrom;
              return isPercentageToLesser ? {notValid: true} : null;
            } else {
              return null;
            }
          } else {
            let percentageFrom = control.value;
            let percentageTo = control['_parent']['controls'][this.form_education_percentage_to].value;
            let controls = control['_parent']['controls'][this.form_education_percentage_to];
            if (percentageFrom && percentageTo) {
              let dateFrom = Number(percentageFrom);
              let dateTo = Number(percentageTo)
              let isPercentageToLesser = dateTo < dateFrom;
              if (isPercentageToLesser) {
                control['_parent']['controls'][this.form_education_percentage_to].setErrors({notValid: true})
              } else {
                control['_parent']['controls'][this.form_education_percentage_to].setValidators([RemoveWhitespace.whitespace(), this.globalValidator.percentageNew(), this.globalValidator.percentage(), this.PercentageValidator(true), Validators.maxLength(5)]);
                control['_parent']['controls'][this.form_education_percentage_to].updateValueAndValidity({emitEvent: false});
              }
            } else {
              control['_parent']['controls'][this.form_education_percentage_to].setValidators([RemoveWhitespace.whitespace(), this.globalValidator.percentageNew(), this.globalValidator.percentage(), this.PercentageValidator(true), Validators.maxLength(5)]);
              control['_parent']['controls'][this.form_education_percentage_to].updateValueAndValidity({emitEvent: false});
          }
          }
      }
    }


patchEducationArray(data) {
  return this.fb.group({
    [this.form_education_checked]: [data[this.form_education_checked]],
    [this.form_education_level]: [data[this.form_education_level]],
    [this.form_education_percentage_from]: [data[this.form_education_percentage_from], [RemoveWhitespace.whitespace(), this.globalValidator.percentageNew(), this.globalValidator.percentage(), this.PercentageValidator(false), Validators.maxLength(5)]],
    [this.form_education_percentage_to]: [data[this.form_education_percentage_to], [RemoveWhitespace.whitespace(), this.globalValidator.percentageNew(), this.globalValidator.percentage(), this.PercentageValidator(true), Validators.maxLength(5)]],
    [this.form_education_yearOfPassing_from]: [data[this.form_education_yearOfPassing_from], [this.startTrue(false)]],
    [this.form_education_yearOfPassing_to]: [data[this.form_education_yearOfPassing_to], [this.startTrue(true)]],
    [this.form_education_institute]: [data[this.form_education_institute]],
    [this.form_education_specialization]: [data[this.form_education_specialization]],
    [this.form_education_discipline]: [data[this.form_education_discipline]],
    [this.form_education_backlogs]: [data[this.form_education_backlogs]],
  })
}


educationDropdownValuesAPI() {
  const api = {
    level: '',
    discipline: '',
    specification: ''
  };
  let educationValues = this.appConfig.getLocalData('educationMasterDropdown') ? JSON.parse(this.appConfig.getLocalData('educationMasterDropdown')) : null;
  if (!educationValues) {
 this.getAllEducationFormDropdownListSubscription = this.candidateService.getAllEducationFormDropdownList(api).subscribe((data: any) => {
    this.ugSpecializationList = data && data.ug_specifications ? data.ug_specifications : [];
    this.pgSpecializationList = data && data.pg_specifications ? data.pg_specifications : [];
    this.diplomaDisciplineList = data && data.diploma_disciplines ? data.diploma_disciplines : [];
    this.ugDisciplineList = data && data.ug_disciplines ? data.ug_disciplines : [];
    this.pgDisciplineList = data && data.pg_disciplines ? data.pg_disciplines : [];
    this.diplomaInstitutesList = data && data.diploma_colleges ? data.diploma_colleges : [];
    const list = data && data.ug_pg_colleges ? data.ug_pg_colleges : [];
    this.ugInstitutesList = list;
    const exceptOthers = list.filter((data: any) => data.college_name !== 'Others');
    this.pgInstitutesList = exceptOthers;

    const savetoLocal = {
      ugSpecializationList: this.ugSpecializationList,
      pgSpecializationList: this.pgSpecializationList,
      diplomaDisciplineList: this.diplomaDisciplineList,
      ugDisciplineList: this.ugDisciplineList,
      pgDisciplineList: this.pgDisciplineList,
      diplomaInstitutesList: this.diplomaInstitutesList,
      ugInstitutesList: this.ugInstitutesList,
      pgInstitutesList: this.pgInstitutesList
    }
    this.appConfig.setLocalData('educationMasterDropdown', JSON.stringify(savetoLocal));
  }, (err) => {

  });
} else {
  this.ugSpecializationList = educationValues && educationValues.ugSpecializationList ? educationValues.ugSpecializationList : [];
  this.pgSpecializationList = educationValues && educationValues.pgSpecializationList ? educationValues.pgSpecializationList : [];
  this.diplomaDisciplineList = educationValues && educationValues.diplomaDisciplineList ? educationValues.diplomaDisciplineList : [];
  this.ugDisciplineList = educationValues && educationValues.ugDisciplineList ? educationValues.ugDisciplineList : [];
  this.pgDisciplineList = educationValues && educationValues.pgDisciplineList ? educationValues.pgDisciplineList : [];
  this.diplomaInstitutesList = educationValues && educationValues.diplomaInstitutesList ? educationValues.diplomaInstitutesList : [];
  this.ugInstitutesList = educationValues && educationValues.ugInstitutesList ? educationValues.ugInstitutesList : [];
  this.pgInstitutesList = educationValues && educationValues.pgInstitutesList ? educationValues.pgInstitutesList : [];
}
}

clear(formcontrol) {
  formcontrol.includes('From') ? this.dateFrom.setValue(null) : this.dateTo.setValue(null);
}

extractValidEntries() {
  let extractedValues = [];
  this.getEducationArr.controls.forEach((element: any) => {
    if (element && element.controls) {
      let innerFormGroup = element.controls;
        let pushElement = {
        [this.form_education_checked]: innerFormGroup[this.form_education_checked].valid ? innerFormGroup[this.form_education_checked].value : null,
        [this.form_education_level]: innerFormGroup[this.form_education_level].valid ? innerFormGroup[this.form_education_level].value : null,
        [this.form_education_percentage_from]: innerFormGroup[this.form_education_percentage_from].valid ? innerFormGroup[this.form_education_percentage_from].value : null,
        [this.form_education_percentage_to]: innerFormGroup[this.form_education_percentage_to].valid ? innerFormGroup[this.form_education_percentage_to].value : null,
        [this.form_education_yearOfPassing_from]: innerFormGroup[this.form_education_yearOfPassing_from].valid ? innerFormGroup[this.form_education_yearOfPassing_from].value : null,
        [this.form_education_yearOfPassing_to]: innerFormGroup[this.form_education_yearOfPassing_to].valid ? innerFormGroup[this.form_education_yearOfPassing_to].value : null,
        [this.form_education_institute]: innerFormGroup[this.form_education_institute].valid ? innerFormGroup[this.form_education_institute].value : null,
        [this.form_education_specialization]: innerFormGroup[this.form_education_specialization].valid ? innerFormGroup[this.form_education_specialization].value : null,
        [this.form_education_discipline]: innerFormGroup[this.form_education_discipline].valid ? innerFormGroup[this.form_education_discipline].value : null,
        [this.form_education_backlogs]: innerFormGroup[this.form_education_backlogs].valid ? innerFormGroup[this.form_education_backlogs].value : null
        }
        extractedValues.push(pushElement);
    }
  });
  return extractedValues;
}

ApplyFilter() {
  let educationArrayValues = [];
  if (this.getEducationArr.valid) {
    educationArrayValues = this.getEducationArr.value;
  } else {
    educationArrayValues = this.extractValidEntries();
  }

  const jsonstringifyprofile = JSON.stringify(this.profileDropDownValues);
  const jsonstringifygender = JSON.stringify(this.genderDropDownValues);
  const jsonstringifybacklogs = JSON.stringify(this.backlogsDropDownValues);
  const profileDropDownValues = JSON.parse(jsonstringifyprofile);
  const genderDropDownValues = JSON.parse(jsonstringifygender);
  const backlogsDropDownValues = JSON.parse(jsonstringifybacklogs);
  let previous = this.lastAppliedFilter;
  this.lastAppliedFilter = {
    profileDropDownValues,
    genderDropDownValues,
    dateFrom: this.dateFrom.valid ? this.dateFrom.value : null,
    dateTo: this.dateTo.valid ? this.dateTo.value : null,
    backlogsDropDownValues,
    educationArray: educationArrayValues
  };

  if (JSON.stringify(previous) == JSON.stringify(this.lastAppliedFilter)) {
    this.buttonLoading = false;
  } else {
    this.filterApiBindingCustomizationData(this.lastAppliedFilter);
  }
}

filterApiBindingCustomizationData(appliedFilter) {
  // In range
  let sslcValues = appliedFilter.educationArray.find(data => data.level.value == 'SSLC');
  let hscValues = appliedFilter.educationArray.find(data => data.level.value == 'HSC');
  let diplomaValues = appliedFilter.educationArray.find(data => data.level.value == 'Diploma');
  let ugValues = appliedFilter.educationArray.find(data => data.level.value == 'UG');
  let pgValues = appliedFilter.educationArray.find(data => data.level.value == 'PG');

  const sslc = sslcValues[this.form_education_checked] ? {
    level: sslcValues[this.form_education_checked] ? 'sslc' : null,
    board_university: null,
    specification: null,
    discipline: null,
    institute: null,
    year_of_passing: this.checkYearOfPassingForEducation(sslcValues.yearOfPassingFrom, sslcValues.yearOfPassingTo),
    backlogs: sslcValues.backlogs ? {
      filterType: "set",
      values: sslcValues.backlogs ? sslcValues.backlogs : null
    } : null,
    percentage: (sslcValues.percentage_from || sslcValues.percentage_to) ? {
      filterType: "number",
      type: "In range",
      filter: sslcValues.percentage_from ? sslcValues.percentage_from : null,
      filterTo: sslcValues.percentage_to ? sslcValues.percentage_to : null,
    } : null,
} : null;

const hsc = hscValues[this.form_education_checked] ? {
  level: hscValues[this.form_education_checked] ? 'hsc' : null,
  board_university: null,
  discipline: hscValues.specialization && hscValues.specialization.length > 0 ? {
    filterType: "set",
    values: hscValues.specialization ? hscValues.specialization : null
  } : null,
  specification: null,
  institute: null,
  year_of_passing: this.checkYearOfPassingForEducation(hscValues.yearOfPassingFrom, hscValues.yearOfPassingTo),
  backlogs: hscValues.backlogs ? {
    filterType: "set",
    values: hscValues.backlogs ? hscValues.backlogs : null
  } : null,
  percentage: (hscValues.percentage_from || hscValues.percentage_to) ? {
    filterType: "number",
    type: "In range",
    filter: hscValues.percentage_from ? hscValues.percentage_from : null,
    filterTo: hscValues.percentage_to ? hscValues.percentage_to : null,
  } : null,
} : null;

const diploma = diplomaValues[this.form_education_checked] ? {
  level: diplomaValues[this.form_education_checked] ? 'diploma' : null,
  board_university: null,
  discipline: diplomaValues.specialization && diplomaValues.specialization.length > 0 ? {
    filterType: "set",
    values: diplomaValues.specialization ? diplomaValues.specialization : null
  } : null,
  specification: diplomaValues.discipline && diplomaValues.discipline.length > 0 ? {
    filterType: "set",
    values: diplomaValues.discipline ? diplomaValues.discipline : null
  } : null,
  institute: diplomaValues.institute && diplomaValues.institute.length > 0 ? {
    filterType: "set",
    values: diplomaValues.institute ? diplomaValues.institute : null
  } : null,
  year_of_passing: this.checkYearOfPassingForEducation(diplomaValues.yearOfPassingFrom, diplomaValues.yearOfPassingTo),
  backlogs: diplomaValues.backlogs ? {
    filterType: "set",
    values: diplomaValues.backlogs ? diplomaValues.backlogs : null
  } : null,
  percentage: (diplomaValues.percentage_from || diplomaValues.percentage_to) ? {
    filterType: "number",
    type: "In range",
    filter: diplomaValues.percentage_from ? diplomaValues.percentage_from : null,
    filterTo: diplomaValues.percentage_to ? diplomaValues.percentage_to : null,
  } : null,
} : null;

const ug = ugValues[this.form_education_checked] ? {
  level: ugValues[this.form_education_checked] ? 'ug' : null,
  board_university: null,
  discipline: ugValues.specialization && ugValues.specialization.length > 0 ? {
    filterType: "set",
    values: ugValues.specialization ? ugValues.specialization : null
  } : null,
  specification: ugValues.discipline && ugValues.discipline.length > 0 ? {
    filterType: "set",
    values: ugValues.discipline ? ugValues.discipline : null
  } : null,
  institute: ugValues.institute && ugValues.institute.length > 0 ? {
    filterType: "set",
    values: ugValues.institute ? ugValues.institute : null
  } : null,
  year_of_passing: this.checkYearOfPassingForEducation(ugValues.yearOfPassingFrom, ugValues.yearOfPassingTo),
  backlogs: ugValues.backlogs ? {
    filterType: "set",
    values: ugValues.backlogs ? ugValues.backlogs : null
  } : null,
  percentage: (ugValues.percentage_from || ugValues.percentage_to) ? {
    filterType: "number",
    type: "In range",
    filter: ugValues.percentage_from ? ugValues.percentage_from : null,
    filterTo: ugValues.percentage_to ? ugValues.percentage_to : null,
  } : null,
} : null;

const pg = pgValues[this.form_education_checked] ? {
  level: pgValues[this.form_education_checked] ? 'pg' : null,
  board_university: null,
  discipline: pgValues.specialization && pgValues.specialization.length > 0 ? {
    filterType: "set",
    values: pgValues.specialization ? pgValues.specialization : null
  } : null,
  specification: pgValues.discipline && pgValues.discipline.length > 0 ? {
    filterType: "set",
    values: pgValues.discipline ? pgValues.discipline : null
  } : null,
  institute: pgValues.institute && pgValues.institute.length > 0 ? {
    filterType: "set",
    values: pgValues.institute ? pgValues.institute : null
  } : null,
  year_of_passing: this.checkYearOfPassingForEducation(pgValues.yearOfPassingFrom, pgValues.yearOfPassingTo),
  backlogs: pgValues.backlogs ? {
    filterType: "set",
    values: pgValues.backlogs ? pgValues.backlogs : null
  } : null,
  percentage: (pgValues.percentage_from || pgValues.percentage_to) ? {
    filterType: "number",
    type: "In range",
    filter: pgValues.percentage_from ? pgValues.percentage_from : null,
    filterTo: pgValues.percentage_to ? pgValues.percentage_to : null,
  } : null,
} : null;

const educations = {
  sslc,
  hsc,
  diploma,
  ug,
  pg
}

const profile_list_extractChecked = appliedFilter.profileDropDownValues.filter(data => data.checked);
// const profile_list = profile_list_extractChecked.map(data => data.value);
const total_backlogChecked = appliedFilter.backlogsDropDownValues.filter(data => data.checked);
// const total_backlog = total_backlogChecked.map(data => data.value);

const gender_extractChecked = appliedFilter.genderDropDownValues.filter(data => data.checked);
const gender = {
  filterType: "set",
  values: gender_extractChecked.map(data => data.value)
};

const profile_list = {
  filterType: "set",
  values: profile_list_extractChecked.map(data => data.value)
};

const total_backlog = {
  filterType: "set",
  values: total_backlogChecked.map(data => data.value)
};


const dobCustomized = (appliedFilter.dateFrom || appliedFilter.dateTo) ? {
  from: appliedFilter.dateFrom ? this.dateConvertionForFiltering(appliedFilter.dateFrom) : null,
  to: appliedFilter.dateTo ? this.dateConvertionForFiltering(appliedFilter.dateTo) : null
} : null

const dob = dobCustomized ? this.checkYearOfPassingForEducation(dobCustomized.from, dobCustomized.to) : null;

let filterModel = {
  position_applied_for: profile_list && profile_list.values && profile_list.values.length > 0 ? profile_list : null,
  gender: gender && gender.values && gender.values.length > 0 ? gender : null,
  total_backlog: total_backlog && total_backlog.values && total_backlog.values.length > 0 ? total_backlog : null,
  dob,
  educations
}
this.lastAPICalledFilter = filterModel;

this.cacheBlockSize = 0;
this.gridApi.deselectAll();
this.gridApi.paginationGoToFirstPage();
this.gridApi.refreshServerSideStore({ purge: true });
}

checkYearOfPassingForEducation(from, to) {
  if (from || to) {
    return {
    "filterType": "date",
    "type": "In range",
    "filter": from ? this.dateConvertionForFiltering(from) : null,
    "filterTo": to ? this.dateConvertionForFiltering(to) : null,
    }
  } else {
    return null;
  }
}

dateConvertionForFiltering(date) {
  if (date) {
    const split = moment(date).format('YYYY-MM-DD');
    if (split == 'Invalid date') {
      const ddFormat = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
      return ddFormat == 'Invalid date' ? null : ddFormat;
    }
   return split == 'Invalid date' ? null : split;
  }
}

showNotSelectedLabel(array) {
  const isChecked = array.find(data => data.checked);
  return isChecked ? true : false;
}

showInstitute(institute: string) {
  let count = institute.length;
  let replace = institute.slice(0, 55);
  return count <= 55 ? institute : (replace + '...');
}

checkEducationalFilterAppliedOrNot() {
  let eduValue = this.getEducationArr.getRawValue();
  return eduValue.find(x => x.checked);
}
  // Form getters
  // convenience getters for easy access to form fields
  get getEducationArr() { return this.educationForm.get([this.form_education_array]) as FormArray; }


}
