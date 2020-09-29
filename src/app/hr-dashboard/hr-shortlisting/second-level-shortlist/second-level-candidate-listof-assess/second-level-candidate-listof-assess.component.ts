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
  validInput1 = new FormControl('', Validators.pattern(this.percentageDecimals));
  validInput2 = new FormControl('', Validators.pattern(this.percentageDecimals));
  validInput3 = new FormControl('', Validators.pattern(this.percentageDecimals));
  validInput4 = new FormControl('', Validators.pattern(this.percentageDecimals));
  visible = false;
  enableFilter = false;
  showApply = false;
  showShortlisted = false;
  displayedColumns1: any[] = ['filter'];
  displayedColumns: any[] = ['uid', 'candidate_new_id', 'user_name',
    'domain_marks',
    'domain_percentage',
    'verbal_marks',
    'verbal_percentage',
    'analytical_mark',
    'analytical_percentage',
    'quantitive_mark',
    'quantitative_percentage',
    'marks',
    'percentage',
    // 'heading',
    // 'checked'
  ];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  selectedUserDetail: any;
  userList: any;
  totalMarks: any;
  total_domain_marks: any;
  total_verbal_marks: any;
  total_analytical_mark: any;
  total_quantitive_mark: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  viewDetails: any;
  assessmentName: any;
  nameOfAssessment: any;
  selectedCandidates: any;
  previewList: any;
  changedList: any;
  displayNoRecords = false;

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

    }, (err) => {

    });
  }

  customFilterApply() {
    if (this.validInput.valid && this.validInput1.valid && this.validInput2.valid && this.validInput3.valid && this.validInput4.valid) {
      this.getUsersList(this.nameOfAssessment);
    } else {
      this.validInput.markAsTouched();
      this.validInput1.markAsTouched();
      this.validInput2.markAsTouched();
      this.validInput3.markAsTouched();
      this.validInput4.markAsTouched();
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
    this.validInput1.valueChanges.subscribe(val => {
      if (val) {
        this.enableFilter = true;
      } else {
        this.enableFilter = true;
      }
    });
    this.validInput2.valueChanges.subscribe(val => {
      if (val) {
        this.enableFilter = true;
      } else {
        this.enableFilter = true;
      }
    });
    this.validInput3.valueChanges.subscribe(val => {
      if (val) {
        this.enableFilter = true;
      } else {
        this.enableFilter = true;
      }
    });
    this.validInput4.valueChanges.subscribe(val => {
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

    const apiData = {
      assement_name: name,
      domain_percentage: this.validInput.value ? this.validInput.value : '',
      verbal_percentage: this.validInput1.value ? this.validInput1.value : '',
      analytical_percentage: this.validInput2.value ? this.validInput2.value : '',
      quantitative_percentage: this.validInput3.value ? this.validInput3.value : '',
      marks_valid: this.validInput4.value ? this.validInput4.value : ''
    };
    this.adminService.filterSecondLevel(apiData).subscribe((datas: any) => {
      this.appConfig.setLocalData('secondLevelFilter', this.validInput.value ? this.validInput.value : '');
      this.appConfig.setLocalData('secondLevelFilter1', this.validInput1.value ? this.validInput1.value : '');
      this.appConfig.setLocalData('secondLevelFilter2', this.validInput2.value ? this.validInput2.value : '');
      this.appConfig.setLocalData('secondLevelFilter3', this.validInput3.value ? this.validInput3.value : '');
      this.appConfig.setLocalData('secondLevelFilter4', this.validInput4.value ? this.validInput4.value : '');
      const align = [];
      const data = [
        {
          candidate_id: '2131313',
          marks: '23',
          percentage: '20',
          domain_marks: '90',
          domain_percentage: '95',
          verbal_marks: '30',
          verbal_percentage: '45',
          analytical_mark: '30',
          analytical_percentage: '45',
          quantitive_mark: '84',
          quantitative_percentage: '75',
          total_marks: '50',
          total_domain_marks: '100',
          total_verbal_marks: '90',
          total_analytical_mark: '50',
          total_quantitive_mark: '75'
        },
        {
          candidate_id: '2131313',
          marks: '23',
          percentage: '20',
          domain_marks: '90',
          domain_percentage: '95',
          verbal_marks: '30',
          verbal_percentage: '45',
          analytical_mark: '30',
          analytical_percentage: '45',
          quantitive_mark: '84',
          quantitative_percentage: '75',
          total_marks: '50',
          total_domain_marks: '100',
          total_verbal_marks: '90',
          total_analytical_mark: '50',
          total_quantitive_mark: '75'
        },
        {
          candidate_id: '2131313',
          marks: '23',
          percentage: '20',
          domain_marks: '90',
          domain_percentage: '95',
          verbal_marks: '30',
          verbal_percentage: '45',
          analytical_mark: '30',
          analytical_percentage: '45',
          quantitive_mark: '84',
          quantitative_percentage: '75',
          total_marks: '50',
          total_domain_marks: '100',
          total_verbal_marks: '90',
          total_analytical_mark: '50',
          total_quantitive_mark: '75'
        }
      ];

      this.userList = datas ? datas : [];
      let count = 0;
      this.userList.forEach((element, i) => {
        count = count + 1;
        element['uid'] = count;
        if (element && i == 0) {
          this.totalMarks = element['total_marks'] ? element['total_marks'] : '';
          this.total_domain_marks = element['total_domain_marks'] ? element['total_domain_marks'] : '';
          this.total_verbal_marks = element['total_verbal_marks'] ? element['total_verbal_marks'] : '';
          this.total_analytical_mark = element['total_analytical_mark'] ? element['total_analytical_mark'] : '';
          this.total_quantitive_mark = element['total_quantitive_mark'] ? element['total_quantitive_mark'] : '';
        }
      });
      this.selectedCandidates = this.userList.length;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.appConfig.hideLoader();
    }, (err) => {
    });
  }


  selectedUser(userDetail) {
    
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

    // check search data is available or not
    if(this.dataSource.filteredData.length==0){
      this.displayNoRecords=true;
    }else{
      this.displayNoRecords=false;

    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
