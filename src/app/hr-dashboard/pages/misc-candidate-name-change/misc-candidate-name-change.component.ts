import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-misc-candidate-name-change',
  templateUrl: './misc-candidate-name-change.component.html',
  styleUrls: ['./misc-candidate-name-change.component.scss']
})
export class MiscCandidateNameChangeComponent implements OnInit {


  candidateEmail = new FormControl(null, [RemoveWhitespace.whitespace(), Validators.required, this.gv.email()]);
  candidateName = new FormControl({value: null, disabled: true}, [RemoveWhitespace.whitespace(), Validators.required, this.gv.alphaNum100()]);
  addedCollegesList: any;
  buttonLabel = true;
  quickSearchValue: any;
  paginationPageSize = 500;
  cacheBlockSize: any = 500;
  gridApi: any;
  columnDefs = [];
  defaultColDef : any;
  tooltipShowDelay = 0;
  rowData: any = [];
  filterValue: string;
  miscCheckEmailSubscription: Subscription;
  selectedEmailIdDetails: any;
  miscChangeCandidateNameSubscription: Subscription;

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
    // this.getAddedCandidateNameList();
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

  candidateEmailSubmit(type: any) {
    if (type == 'Reset') {
     this.candidateName.disable();
     this.candidateEmail.enable();
     return this.candidateName.reset();
    }
    this.candidateEmailCheck();
  }

  candidateEmailCheck() {
    const apiData = {
      email : this.candidateEmail.value,
    };
    this.miscCheckEmailSubscription = this.adminService.miscCheckEmail(apiData).subscribe((res: any)=> {
      this.candidateName.enable();
      this.candidateEmail.disable();
      this.selectedEmailIdDetails = res ? res : null;
      this.candidateName.patchValue(this.selectedEmailIdDetails?.field_user_name_value);
      console.log('res', res);
    }, (err)=> {

    });
  }

  candidateUpdatedNameSubmit() {
    const apiData = {
      user_id : this.selectedEmailIdDetails?.uid,
      user_name: this.candidateName.value
    };
    this.miscChangeCandidateNameSubscription = this.adminService.miscChangeCandidateName(apiData).subscribe((res: any)=> {
      this.appConfig.success('Candidate Name Updated Successfully');
      this.candidateName.reset();
      this.candidateEmail.reset();
      this.selectedEmailIdDetails = null;
      this.buttonLabel = !this.buttonLabel;
      this.candidateEmail.enable();
      this.candidateName.disable();
      console.log('res', res);
    }, (err)=> {

    });
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
