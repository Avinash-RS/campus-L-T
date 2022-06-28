import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';

@Component({
  selector: 'app-misc-candidate-name-change',
  templateUrl: './misc-candidate-name-change.component.html',
  styleUrls: ['./misc-candidate-name-change.component.scss']
})
export class MiscCandidateNameChangeComponent implements OnInit {


  candidateEmail = new FormControl(null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.email()]);
  candidateName = new FormControl(null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.alphaNum100()]);
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
    this.getAddedCandidateNameList();
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
        headerName: 'Candidate Name', field: 'candidate_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Candidate Email ID', field: 'candidate_email',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'candidate_email',
        getQuickFilterText: (params) => {
          return params.value;
        }
      },
      {
        headerName: 'Old Candidate Name', field: 'old_name',
        filter: 'agTextColumnFilter',
        minWidth: 140,
        sortable: true,
        tooltipField: 'old_name',
        getQuickFilterText: (params) => {
          return params.value;
        }
      }
    ];
  }

  candidateEmailSubmit() {
    this.candidateName.patchValue('Avinash');
  }

  candidateUpdatedNameSubmit() {
    console.log('coming');
  }

  // To get all users
  getAddedCandidateNameList() {
    this.rowData = [
      {
        candidate_name: 'Avinash Updated',
        candidate_email: 'Avinash@gmail.com',
        old_name: 'Avinash'
      },
      {
        candidate_name: 'Abv Updated',
        candidate_email: 'Abv@gmail.com',
        old_name: 'Abv old'
      }
    ]
  }

}
