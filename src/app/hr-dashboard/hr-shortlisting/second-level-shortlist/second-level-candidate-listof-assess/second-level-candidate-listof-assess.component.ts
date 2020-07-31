import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-second-level-candidate-listof-assess',
  templateUrl: './second-level-candidate-listof-assess.component.html',
  styleUrls: ['./second-level-candidate-listof-assess.component.scss']
})
export class SecondLevelCandidateListofAssessComponent implements OnInit, AfterViewInit {
  percentageDecimals = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
  validInput = new FormControl('', Validators.pattern(this.percentageDecimals));
  visible = false;
  enableFilter = false;
  showApply = false;
  showShortlisted = false;
  displayedColumns1: any[] = ['filter'];
  displayedColumns: any[] = ['uid', 'candidate_id',
    // 'Section_1',
    // 'filter',
    'marks',
    'percentage',
    // 'heading',
    // 'checked'
  ];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  selectedUserDetail: any;
  userList: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  viewDetails: any;
  assessmentName: any;
  nameOfAssessment: any;
  selectedCandidates: any;
  previewList: any;
  changedList: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.editRouteParamGetter();
  }

  ngOnInit() {
    this.onChanges();
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params['data']);
      this.nameOfAssessment = params['data'];
      this.assessmentDetails(params['data']);
      this.getUsersList(params['data']);
    });
  }

  assessmentDetails(name) {
    const apidata = {
      assement_name: name
    };
    this.adminService.assessmentDetailsOfSecond(apidata).subscribe((data: any) => {
      // this.appConfig.hideLoader();
      this.assessmentName = data;
      console.log('details', data);

    }, (err) => {

    });
  }

  customFilterApply() {
    if (this.validInput.valid) {
      this.getUsersList(this.nameOfAssessment);
    } else {
      this.validInput.markAsTouched();
    }
  }

  onChanges(): void {
    this.validInput.valueChanges.subscribe(val => {
      if (val) {
        this.enableFilter = true;
      } else {
        this.enableFilter = true;
      }
    });
  }
  enableFilterMethod() {
    this.showApply = !this.showApply;
  }

  submit() {
    this.changedList = this.userList;
    this.previewList = this.changedList;
    console.log('this.previewList', this.previewList);

    this.showShortlisted = true;
  }
  disableListView(event) {
    this.userList = event;
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changedList = [];
    this.previewList = [];
    this.showShortlisted = false;
    this.appConfig.clearLocalDataOne('tempSecond');
  }
  // To get all users
  getUsersList(name) {
    console.log('val', this.validInput.value);

    const apiData = {
      assement_name: name,
      marks: this.validInput.value ? this.validInput.value : ''
    };
    this.adminService.filterSecondLevel(apiData).subscribe((datas: any) => {
      console.log('apiFilter', datas);
      this.appConfig.setLocalData('secondLevelFilter', this.validInput.value ? this.validInput.value : '');
      const align = [];
      this.userList = datas ? datas : [];
      this.selectedCandidates = this.userList.length;
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['uid'] = count;
      });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.appConfig.hideLoader();
    }, (err) => {
    });
  }


  selectedUser(userDetail) {
    console.log(userDetail);
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
