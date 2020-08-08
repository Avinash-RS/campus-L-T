import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shortlisted-candidate-list-second-level',
  templateUrl: './shortlisted-candidate-list-second-level.component.html',
  styleUrls: ['./shortlisted-candidate-list-second-level.component.scss']
})
export class ShortlistedCandidateListSecondLevelComponent implements OnInit, AfterViewInit, OnChanges {

  BASE_URL = environment.API_BASE_URL;

  displayedColumns: any[] = ['uid', 'user_name', 'candidate_id', 'insitute', 'pdf'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  showShortlisted = true;
  @Output() disableShowList = new EventEmitter<boolean>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Input() shortlistedCandidates;

  selectedUserDetail: any;
  userListing: any;
  radioCheck;
  selectAllCheck;
  nameOfAssessment: any;
  staticList: any;

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
  }

  ngOnChanges() {
    console.log('on', this.shortlistedCandidates);
    if (this.shortlistedCandidates) {
      this.staticList = this.shortlistedCandidates;
      this.appConfig.setLocalData('tempSecond', JSON.stringify(this.staticList));
      this.userListing = this.shortlistedCandidates;
    } else {
      this.userListing = [];
    }
    this.getUsersList();
  }
  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
    });
  }


  backToShortlist() {
    this.shortlistedCandidates = [];
    this.userListing = [];
    this.disableShowList.emit(JSON.parse(this.appConfig.getLocalData('tempSecond')));
  }

  submit() {
    const data = {
      shortlist: 'second'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }
  afterSubmit(result) {
    const apiData = {
      id: [],
      uid: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '',
      emai_sent: result['type'] === 'yes' ? '1' : '0',
      assement_name: this.nameOfAssessment,
      shortlist_mark: this.appConfig.getLocalData('secondLevelFilter') ? this.appConfig.getLocalData('secondLevelFilter') : ''
    };
    this.userListing.forEach(element => {
      if (element['candidate_id']) {
        apiData['id'].push(element['candidate_id']);
      }
    });
    console.log(apiData);
    this.adminService.secondShortlistAPI(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      console.log('data', data);
      const datas = {
        success_second: result['type']
      };
      this.openDialog1(ShortlistBoxComponent, datas);
    }, (err) => {

    });
  }
  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split.toUpperCase();
      return output;

    } else {
      return '-';
    }
  }

  // To get all users
  getUsersList() {
    if (this.shortlistedCandidates) {
      this.userListing = this.shortlistedCandidates;
    } else {
      this.userListing = [];
    }
    this.dataSource = new MatTableDataSource(this.userListing);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // }, (err) => {
    // });
  }

  selectedUser(userDetail) {
    console.log(userDetail);
  }
  removeSelectedCandidate(i) {
    this.userListing.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.userListing);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    // dialogDetails = {
    //   iconName: data.iconName,
    //   showCancel: data.showCancel,
    //   showConfirm: data.showConfirm,
    //   showOk: data.showOk,
    //   dataToBeShared: data.sharedData,
    // };

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
        this.afterSubmit(result);
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
      this.appConfig.clearLocalDataOne('secondLevelFilter');
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTED_CANDIDATE_REPORT, {data: this.nameOfAssessment ? this.nameOfAssessment : 'none'});
      if (result) {
      }
    });
  }

}
