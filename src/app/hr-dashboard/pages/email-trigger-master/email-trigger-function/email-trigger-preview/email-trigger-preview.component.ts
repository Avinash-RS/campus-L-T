import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonKycProfileViewComponent } from 'src/app/shared/common-kyc-profile-view/common-kyc-profile-view.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-email-trigger-preview',
  templateUrl: './email-trigger-preview.component.html',
  styleUrls: ['./email-trigger-preview.component.scss']
})
export class EmailTriggerPreviewComponent implements OnInit, OnChanges {
  @Input() templateComponent: any;
  @Input() stageWiseDetails: any;
  @Input() stepperIndex: any;
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    height: 'auto',
    minHeight: '250px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: false,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
  //   customClasses: [
  //   {
  //     name: 'quote',
  //     class: 'quote',
  //   },
  //   {
  //     name: 'redText',
  //     class: 'redText'
  //   },
  //   {
  //     name: 'titleText',
  //     class: 'titleText',
  //     tag: 'h1',
  //   },
  // ],
  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
    ['insertImage', 'insertVideo'],
    ['strikeThrough',
    'subscript',
    'superscript', 'toggleEditorMode']
    // ['bold', 'italic'],
    // ['fontSize']
  ]
};
  sideBar = {
    toolPanels: [ 
    {id: 'filters',
    labelDefault: 'Filters',
    labelKey: 'filters',
    iconKey: 'filter',
    toolPanel: 'agFiltersToolPanel',
    }
    ], defaultToolPanel: ''
  };
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef: any;
  tooltipShowDelay = 0;
  rowData: any;
  searchBox = false;
  filterValue: string;
  quickSearchValue: any = '';

  selectedValue: any;
  panelOpenState = false;
  htmlContent: any = '';
  selectedSubject: any;
  activeTemplate: any;
  constructor(
    private adminService: AdminServiceService,
    private appConfig: AppConfigService,
    private dialog: MatDialog
  ) { 
  }

  ngOnInit() {
    this.appConfig.agGridWithAllFuncWithSideBar();
  }

  ngOnChanges() {
    if (this.stepperIndex == 2 && this.stageWiseDetails && this.stageWiseDetails.selectedValue) {
      let stageDetail = {
        selectedCandidates: this.stageWiseDetails.gridApi.getSelectedNodes() ? this.stageWiseDetails.gridApi.getSelectedNodes() : [],
        selectedStageValue: this.stageWiseDetails.selectedValue,
        stagesList: this.stageWiseDetails.stagesList
      };
      this.getSelectedStageName(stageDetail.selectedStageValue, stageDetail.stagesList);
      this.tabledef();
    }
  }

  getSelectedStageName(id, data) {
    let selectedLabel = data
      .filter((element) =>
        element.stages.some((subElement) => subElement.stage_id.toString() == id.toString()))
      .map(element => {
        let newElt = Object.assign({}, element); // copies element
        return newElt.stages.filter(subElement => subElement.stage_id.toString() == id.toString());
      });
    this.selectedValue = selectedLabel[0][0].stage_name;
  }


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getUsersList();
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    if (event.colDef.field === 'user_name') {
      const data = {
        candidate_user_id: event['data'] && event['data']['user_id'] ? event['data']['user_id'] : '',
        candidateName: event['data'] && event['data']['user_name'] ? event['data']['user_name'] : '',
      };
      this.openDialog5(CommonKycProfileViewComponent, data);
    }
  }
    // Open dailog
    openDialog5(component, data) {
      let dialogDetails: any;

      /**
       * Dialog modal window
       */
      // tslint:disable-next-line: one-variable-per-declaration
      const dialogRef = this.dialog.open(component, {
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

  getModel(e) {
    this.gridApi.deselectAll();
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
      // this.toast.warning('No reuslts found');
    }
  }
  tabledef() {
    this.columnDefs = [
      {
        headerName: 'Candidate Id', field: 'candidate_id',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_id',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Name', field: 'user_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'user_name',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellStyle: { color: '#1b4e9b' },
        cellRenderer: (params) => {
          return `<span style="cursor: pointer"><span class="profileAvatar"><img src="${params["data"]["profile_image"]}"></span> <span class="ml-1">${params["data"]["user_name"]}</span> </span>`;
        }
      },
      {
        headerName: 'Email', field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Phone', field: 'phone',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'phone',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return params['data']['phone'] ? `${params['data']['phone']}` : '-';
        }
      },
      {
        headerName: 'College', field: 'college',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'college',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return params['data']['college'] ? `${params['data']['college']}` : '-';
        }
      },
      {
        headerName: 'Discipline', field: 'discipline',
        filter: 'agTextColumnFilter',
        minWidth: 120,
        sortable: true,
        tooltipField: 'discipline',
        getQuickFilterText: (params) => {
          return params.value;
        },
        cellRenderer: (params) => {
          return params['data']['discipline'] ? `${params['data']['discipline']}` : '-';
        }
      },
    ];
  }


  // To get all users
  getUsersList() {
    let stagewise = this.templateComponent.stageWiseDetails.gridApi.getSelectedNodes();
    let selectedCandidates = stagewise.map((ele: any) => {
      return ele.data;
    });
    this.rowData = selectedCandidates;
    this.htmlContent = this.templateComponent.htmlContent;
    this.selectedSubject = this.templateComponent.selectedSubject.value;
    this.activeTemplate = this.templateComponent.activeTemplate;
  }


}
