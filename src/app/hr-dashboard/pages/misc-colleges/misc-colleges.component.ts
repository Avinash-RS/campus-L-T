import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-misc-colleges',
  templateUrl: './misc-colleges.component.html',
  styleUrls: ['./misc-colleges.component.scss']
})
export class MiscCollegesComponent implements OnInit {

  collegeTypeList = [
    {
      name: 'UG/PG',
      value: 'ug_pg'
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
  miscCollegeListSubscription: Subscription;
  miscAddCollegeSubscription: Subscription;

  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService,
    private gv: GlobalValidatorService
  ) { }

  ngOnInit() {
    this.defaultColDef = this.appConfig.agGridWithAllFunc();
    this.tabledef();
  }

  miscCollegesList() {
    const apiData = {
      "college_type" : ""
    }
    this.miscCollegeListSubscription = this.adminService.miscCollegeList(apiData).subscribe((res: any)=> {
      this.rowData = res ? res : [];
      this.addedCollegesList = this.rowData;
      console.log(res)
    }, (err)=> {

    });
  }

  miscAddCollege(college, type) {
    const apiData = {
      college_type : type,
      college_name : college
    };
    this.miscAddCollegeSubscription = this.adminService.miscAddCollege(apiData).subscribe((res: any)=> {
      this.gridApi.applyTransaction({
        add: [apiData],
        addIndex: 0,
      })!;
      this.collegeName.reset();
      this.collegeType.reset();
      this.appConfig.success('College Added Successfully');
    }, (err)=> {

    });
  }

  addCollege(collegeName: any, collegeType: any) {
    this.miscAddCollege(collegeName, collegeType);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.miscCollegesList();
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

}
