import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';

@Component({
  selector: 'app-misc-colleges',
  templateUrl: './misc-colleges.component.html',
  styleUrls: ['./misc-colleges.component.scss']
})
export class MiscCollegesComponent implements OnInit {

  collegeTypeList = [
    {
      name: 'UG/PG',
      value: 'ugpg'
    },
    {
      name: 'Diploma',
      value: 'diploma'
    }
  ];

  collegeType = new FormControl(null, [Validators.required]);
  collegeName = new FormControl(null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.alphaNum100()]);
  addedCollegesList: any;

  quickSearchValue: any;
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef : any;
  tooltipShowDelay = 0;
  rowData: any;
  filterValue: string;

  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService,
    private gv: GlobalValidatorService
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getAddedCollegesList();
  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
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
      this.appConfig.warning('No search results found');
    }
  }
  tabledef() {

    this.columnDefs = [
      {
        headerName: 'S no',
        minWidth: 80,
        maxWidth: 120,
        sortable: true,
        resizable:true,
        filter: 'agNumberColumnFilter',
        valueGetter: (params) => {
          const i = +params.node.id + 1;
          return i ? i : 'Loading...';
        },
      },
      {
        headerName: 'College Name', field: 'college_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'college_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'College Type', field: 'college_type',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'college_type',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
    ];
  }


  // To get all users
  getAddedCollegesList() {
    this.rowData = [
      {
        college_name: 'SRM Institute of Technology',
        college_type: 'UG/PG'
      },
      {
        college_name: 'Seshasayee Institute of Technology',
        college_type: 'Diploma'
      }
    ]
  }

}
