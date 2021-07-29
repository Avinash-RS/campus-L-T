import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inv-sub-assessments',
  templateUrl: './inv-sub-assessments.component.html',
  styleUrls: ['./inv-sub-assessments.component.scss']
})
export class InvSubAssessmentsComponent implements OnInit, AfterViewInit {

  appConstant = CONSTANT.ENDPOINTS;
  BIS = this.appConfig.getLocalData('BIS');

  displayedColumns: any[] = ['name', 'percentage', 'question'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  queryParams: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  userList: any;
  assessmentName: any;
  nameOfAssessment: any;
  candidateId: any;
  uid:any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.nameOfAssessment = params['data'];
      this.candidateId = params['id'];
      this.uid = params['uid'];
      this.queryParams = {
        data: params['data'],
        id: params['id'],
        name: params['name'] ? params['name'] : '',
        status: params['status'],
        tag: params['tag'],
        uid: params['uid'],
        email: params['email'],
        form: params['form']
      };

    });
  }


  // To get all users
  getUsersList(name, id) {

    const apiData = {
      assement_name: name,
      uid: id
    };
    this.adminService.hrEvaluationSectionMarks(apiData).subscribe((datas: any) => {


      let arr = [];
      if (datas && this.BIS != 'true') {
        arr = [
          {
            name: 'Domain',
            percentage: datas['domain_percentage'] ? datas['domain_percentage'] : ''
          },
          {
            name: 'Verbal',
            percentage: datas['verbal_percentage'] ? datas['verbal_percentage'] : ''
          },
          {
            name: 'Analytical',
            percentage: datas['analytical_percentage'] ? datas['analytical_percentage'] : ''
          },
          {
            name: 'Quantitative',
            percentage: datas['quantitative_percentage'] ? datas['quantitative_percentage'] : ''
          },
          {
            name: 'Total percentage',
            percentage: datas['percentage'] ? datas['percentage'] : ''
          },
        ];
      }
      if (datas && this.BIS == 'true') {
        arr = [
          {
            name: 'Domain',
            percentage: datas['domain_percentage'] ? datas['domain_percentage'] : ''
          },
          {
            name: 'Aptitude',
            percentage: datas['analytical_percentage'] ? datas['analytical_percentage'] : ''
          },
          {
            name: 'Total percentage',
            percentage: datas['percentage'] ? datas['percentage'] : ''
          },
        ];
      }
      this.userList = arr ? arr : [];
      let counting = 0;
      this.userList.forEach(element => {
        counting = counting + 1;
        element['count'] = counting;
      });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (err) => {
    });
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

  view(cid) {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.INTERVIEW_PANEL_EVALUATION, { data: this.nameOfAssessment, id: cid });
  }

  viewQus(templateRef: TemplateRef<any>) {
    this.matDialog.open(templateRef, {
      width: '80%',
      height: '70%',
      closeOnNavigation: true,
      disableClose: true,
    });
  }

  closedialogbox() {
    this.matDialog.closeAll();
  }

  next() {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.SUB_EDUCATION, this.queryParams);
  }

}

