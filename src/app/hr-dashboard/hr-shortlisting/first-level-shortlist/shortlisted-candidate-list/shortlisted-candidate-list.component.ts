import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { ActivatedRoute } from '@angular/router';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { ModuleRegistry, AllModules, IDatasource, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);
import { GridChartsModule } from '@ag-grid-enterprise/charts';
import { ClickableStatusBarComponent } from './custom-get-selected-rows-count';
import { firstShortlistFilterModel } from './firstShortlist_filtermodel';
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-shortlisted-candidate-list',
  templateUrl: './shortlisted-candidate-list.component.html',
  styleUrls: ['./shortlisted-candidate-list.component.scss']
})
export class ShortlistedCandidateListComponent implements OnInit, AfterViewInit {
  @ViewChild('customFilter', {static: false}) customFilterRef: TemplateRef<any>;

  filterProfileList = 'Profile List';
  filterGenderList = 'Gender';
  filterDOBList = 'Date of Birth';
  filterEducationList = 'Education Level';
  filterBacklogsList = 'Backlogs';

  profileDropDownValues = this.firstShortlistFilterModel.getProfileList();
  genderDropDownValues = this.firstShortlistFilterModel.getGenderList();
  dateOfBirtValues = this.firstShortlistFilterModel.getDateOfBirthRange();
  educationDropDownValues = this.firstShortlistFilterModel.getEducationList();
  backlogsDropDownValues = this.firstShortlistFilterModel.getBacklogsList();

  rootArray = [];
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
    resultsLength:any;
    fres: any;
  selectedCustomFilterListValue: any;

  constructor(
    private appConfig: AppConfigService,
    private firstShortlistFilterModel: firstShortlistFilterModel,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithServerSideAllFuncWithRowGrouping();
    // this.defaultColDef.checkboxSelection = this.isFirstColumn;
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
  }

  checkFilterAppied() {
    let savedFilterModel = this.gridApi.getFilterModel();
    let check = Object.keys(savedFilterModel).length === 0 && savedFilterModel.constructor === Object ? true : false;
    return !check;
  }

  tableDef() {
   let table_headers = [
    //  {
    //        headerName: "Candidate ID",
    //        field: "candidate_id",
    //        filter: "agNumberColumnFilter",
    //        tooltipField: 'candidate_id',
    //        getQuickFilterText: (params) => {
    //        return params.value;
    //       },
    //     },
    {
    headerName: 'Candidate Information',
    children: [
         {
           headerName: "Candidate Name",
           field: "candidate_name",
           filter: "agTextColumnFilter",
           columnGroupShow: 'closed',
           sortable: true,
           rowGroup: false,
           tooltipField: 'candidate_name',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
           headerName: "Email Id",
           field: "email",
           filter: "agTextColumnFilter",
           tooltipField: 'email',
           columnGroupShow: 'open',
           rowGroup: true,
           enableRowGroup: true,
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
           headerName: "Gender",
           field: "gender",
           filter: "agSetColumnFilter",
           columnGroupShow: 'open',
           tooltipField: 'gender',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
           headerName: "Date of Birth",
           field: "dob",
           filter: "agDateColumnFilter",
           columnGroupShow: 'open',
           tooltipField: 'dob',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
           headerName: "Tag Name",
           field: "tag_name",
           filter: "agSetColumnFilter",
           columnGroupShow: 'open',
           tooltipField: 'tag_name',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
          headerName: "Profile List",
          field: "selected_position_for",
          columnGroupShow: 'open',
          filter: "agSetColumnFilter",
          tooltipField: 'selected_position_for',
          getQuickFilterText: (params) => {
          return params.value;
         },
         },
         {
          headerName: "Total Backlogs",
          field: "total_backlog",
          filter: "agNumberColumnFilter",
          columnGroupShow: 'open',
          tooltipField: 'total_backlog',
          getQuickFilterText: (params) => {
          return params.value;
         },
        },
      ]},
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
        headerName: "Backlogs",
        field: "education.backlogs",
        filter: false,
        sortable: false,
        tooltipField: 'education.backlogs',
        getQuickFilterText: (params) => {
        return params.value;
        },
      },
      ]}
   ];

    // // this.columnDefs = this.agGridDefinition.candidateList();
    // let header: any = {
    //   tooltipField: 'candidate_id',
    //   getQuickFilterText: (params) => {
    //     return params.value;
    //   },
    // }
    this.columnDefs = table_headers;
    this.autoGroupColumnDef = {
      field: 'candidate_id',
      filter: false,
      sortable: false,
      tooltipField: 'candidate_id',
      getQuickFilterText: (params) => {
      return params.value;
    },
    cellRendererParams: {
      innerRenderer: function (params) {
        return params.data.candidate_id;
      },
      checkbox: true
    }
    };
    this.serverSideStoreType = 'partial';
    this.rowModelType = 'serverSide';
    this.rowSelection = 'multiple';
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
    return thisIsFirstColumn;
  }

  onGroupOpened(event){
  }

  callApiForGetShortlistingCandidates() {
    return {
      getRows: (params) => {
        console.log('params', params);

      // let apiData: any = params;
      if (params.request && params.request.groupKeys && params.request.groupKeys.length == 0) {
        this.adminService.getCandidateListForShortlist(params.request).subscribe((data1: any) => {
          this.userList = data1 && data1['data'] ? data1['data'] : [];
          this.userList.forEach(element => {
            if (element && element.educations) {
              element.educations.forEach(ele => {
                element.education = ele;
              });
            }
          });
          if (this.userList.length > 0) {
          let count = params.startRow;
          this.userList.forEach((element, i) => {
            count = count + 1;
            element['counter'] = count;
          });
          this.pageRowCount = data1 && data1['total_count'] ? data1['total_count'] : 0;
          params.success({
            rowData: this.userList,
            rowCount: this.pageRowCount
          }
          );
        } else {
          params.fail();
        }
        }, (err) => {
          params.fail();
        });
      } else {
        const subArray = this.userList.find(data => {
          if (data.email == params.request.groupKeys[0].toString()) {
            return data.email == params.request.groupKeys[0].toString()
          }
        });
        let customize = [];
        if (subArray.educations && subArray.educations.length > 0) {
          subArray.educations.pop();
          subArray.educations.forEach(element => {
            let main: any = {
              candidate_id: subArray.candidate_id ? '' : '',
              candidate_name: subArray.candidate_name ? '' : '',
              email: subArray.email ? '' : '',
              gender: subArray.gender ? '' : '',
              dob: subArray.dob ? '' : '',
              selected_position_for: subArray.selected_position_for ? '' : '',
              tag_name: subArray.tag_name ? '' : '',
              total_backlog: subArray.total_backlog ? '' : ''
            };
            main.education = element;
            customize.push(main);
          });
        }
        // subArray.educations.pop();
        let newSubUserList = customize && customize.length > 0 ? customize : [];
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
  }

  onCellClicked(event) {
    // event['data']
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
    // let apiData;
    // apiData = {
    //   user_id: [],
    //   folder_name: apiDatas && apiDatas['folderName'] ? apiDatas['folderName'] : '',
    //   shortlist_name: apiDatas && apiDatas['shortlistName'] ? apiDatas['shortlistName'] : '',
    //   field_assement_type: apiDatas && apiDatas['type'] ? apiDatas['type'] : 'rec',
    //   shortlistby: this.appConfig.getLocalData('username'),
    //   // select: this.overallSelect ? this.queryObject : ''
    // };
    // this.adminService.submitShortlistedCandidates(apiData).subscribe((data: any) => {


    //   const datas = {
    //     first_level_shortlist_success: 'first_level_shortlist_success'
    //   };
    //   this.openDialog1(ShortlistBoxComponent, datas);
    // }, (err) => {

    // });
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
      this.callApiForGetShortlistingCandidates();
      if (result) {
      }
    });
  }

  clearAllFilters() {
    this.profileDropDownValues = this.firstShortlistFilterModel.getProfileList();
    this.genderDropDownValues = this.firstShortlistFilterModel.getGenderList();
    this.dateOfBirtValues = this.firstShortlistFilterModel.getDateOfBirthRange();
    this.educationDropDownValues = this.firstShortlistFilterModel.getEducationList();
    this.backlogsDropDownValues = this.firstShortlistFilterModel.getBacklogsList();
  }

  selectedCustomFilterList(selectedFilterList) {
    this.selectedCustomFilterListValue = selectedFilterList;
  }

  customFilterOpen() {
    this.selectedCustomFilterListValue = this.selectedCustomFilterListValue ? this.selectedCustomFilterListValue : this.filterProfileList;
    const dialogRef = this.dialog.open(this.customFilterRef, {
      width: '400px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForcustomFilter'
    });
  }

}
/*
   let table_headers = [
     {
       headerName: "Candidate Information",
       children: [
         {
           headerName: "Candidate ID",
           field: "candidate_id",
           filter: "agNumberColumnFilter",
           tooltipField: 'candidate_id',
           getQuickFilterText: (params) => {
           return params.value;
          },
        },
         {
           headerName: "Candidate Name",
           field: "candidate_name",
           filter: "agTextColumnFilter",
           tooltipField: 'candidate_name',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
           headerName: "Email Id",
           field: "email",
           filter: "agTextColumnFilter",
           tooltipField: 'email',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
           headerName: "Gender",
           field: "gender",
           filter: "agSetColumnFilter",
           tooltipField: 'gender',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
           headerName: "Date of Birth",
           field: "dob",
           filter: "agDateColumnFilter",
           tooltipField: 'dob',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
           headerName: "Tag Name",
           field: "tag_name",
           filter: "agSetColumnFilter",
           tooltipField: 'tag_name',
           getQuickFilterText: (params) => {
           return params.value;
          },
         },
         {
          headerName: "Profile List",
          field: "profile_list",
          filter: "agSetColumnFilter",
          tooltipField: 'profile_list',
          getQuickFilterText: (params) => {
          return params.value;
         },
         },
       ],
     },
     {
       headerName: "Education Information",
       children: [
         {
           headerName: "SSLC",
           children: [
             {
               headerName: "Institute Name",
               field: "sslc_institute_name",
               filter: "agSetColumnFilter",
               tooltipField: 'sslc_institute_name',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Discipline",
               field: "sslc_discipline",
               filter: "agSetColumnFilter",
               tooltipField: 'sslc_discipline',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Specialization",
               field: "sslc_specialization",
               filter: "agSetColumnFilter",
               tooltipField: 'sslc_specialization',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "No. of Backlogs",
               field: "sslc_backlog",
               filter: "agSetColumnFilter",
               tooltipField: 'sslc_backlog',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Percentage",
               field: "sslc_percentage",
               filter: "agNumberColumnFilter",
               tooltipField: 'sslc_percentage',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Year of Passing",
               field: "sslc_yop",
               filter: "agDateColumnFilter",
               tooltipField: 'sslc_yop',
               getQuickFilterText: (params) => {
               return params.value;
              },
            },
           ],
         },
         {
           headerName: "HSC",
           children: [
             {
               headerName: "Institute Name",
               field: "hsc_institute_name",
               filter: "agSetColumnFilter",
               tooltipField: 'hsc_institute_name',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Discipline",
               field: "hsc_discipline",
               filter: "agSetColumnFilter",
               tooltipField: 'hsc_discipline',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Specialization",
               field: "hsc_specialization",
               filter: "agSetColumnFilter",
               tooltipField: 'hsc_specialization',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "No. of Backlogs",
               field: "hsc_backlog",
               filter: "agSetColumnFilter",
               tooltipField: 'hsc_backlog',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Percentage",
               field: "hsc_percentage",
               filter: "agNumberColumnFilter",
               tooltipField: 'hsc_percentage',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Year of Passing",
               field: "hsc_yop",
               filter: "agDateColumnFilter",
               tooltipField: 'hsc_yop',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
           ],
         },
         {
           headerName: "Diploma",
           children: [
             {
               headerName: "Institute Name",
               field: "dip_institute_name",
               filter: "agSetColumnFilter",
               tooltipField: 'dip_institute_name',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Discipline",
               field: "dip_discipline",
               filter: "agSetColumnFilter",
               tooltipField: 'dip_discipline',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Specialization",
               field: "dip_specialization",
               filter: "agSetColumnFilter",
               tooltipField: 'dip_specialization',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "No. of Backlogs",
               field: "dip_backlog",
               filter: "agSetColumnFilter",
               tooltipField: 'dip_backlog',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Percentage",
               field: "dip_percentage",
               filter: "agNumberColumnFilter",
               tooltipField: 'dip_percentage',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Year of Passing",
               field: "dip_yop",
               filter: "agDateColumnFilter",
               tooltipField: 'dip_yop',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
           ],
         },
         {
           headerName: "Undergraduate",
           children: [
             {
               headerName: "Institute Name",
               field: "ug_institute_name",
               filter: "agSetColumnFilter",
               tooltipField: 'ug_institute_name',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Discipline",
               field: "ug_discipline",
               filter: "agSetColumnFilter",
               tooltipField: 'ug_discipline',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Specialization",
               field: "ug_specialization",
               filter: "agSetColumnFilter",
               tooltipField: 'ug_specialization',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "No. of Backlogs",
               field: "ug_backlog",
               filter: "agSetColumnFilter",
               tooltipField: 'ug_backlog',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Percentage",
               field: "ug_percentage",
               filter: "agNumberColumnFilter",
               tooltipField: 'ug_percentage',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Year of Passing",
               field: "ug_yop",
               filter: "agDateColumnFilter",
               tooltipField: 'ug_yop',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
           ],
         },
         {
           headerName: "Postgraduate",
           children: [
             {
               headerName: "Institute Name",
               field: "pg_institute_name",
               filter: "agSetColumnFilter",
               tooltipField: 'pg_institute_name',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Discipline",
               field: "pg_discipline",
               filter: "agSetColumnFilter",
               tooltipField: 'pg_discipline',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Specialization",
               field: "pg_specialization",
               filter: "agSetColumnFilter",
               tooltipField: 'pg_specialization',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "No. of Backlogs",
               field: "pg_backlog",
               filter: "agSetColumnFilter",
               tooltipField: 'pg_backlog',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Percentage",
               field: "pg_percentage",
               filter: "agNumberColumnFilter",
               tooltipField: 'pg_percentage',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
             {
               headerName: "Year of Passing",
               field: "pg_yop",
               filter: "agDateColumnFilter",
               tooltipField: 'pg_yop',
               getQuickFilterText: (params) => {
               return params.value;
              },
             },
           ],
         },
       ],
     },
     {
       headerName: "Total Backlogs",
       field: "total_backlog",
       filter: "agNumberColumnFilter",
       tooltipField: 'total_backlog',
       getQuickFilterText: (params) => {
       return params.value;
      },
     },
   ];

*/
