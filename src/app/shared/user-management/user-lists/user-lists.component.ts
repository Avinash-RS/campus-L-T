import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import moment from 'moment';
// import all Enterprise modules
import { ModuleRegistry, AllModules, IDatasource, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
ModuleRegistry.registerModules(AllModules);
import { GridChartsModule } from '@ag-grid-enterprise/charts';
import { userListDefinition } from './userlist.aggrid-definition';
ModuleRegistry.registerModules([GridChartsModule]);

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.scss']
})

export class UserListsComponent implements OnInit, AfterViewInit {
  selectedUserlist: any = 'candidate';
  currentRole: any;
  userList: any = [];
  // serverSide Things
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
  protected rowModelType;
  protected serverSideStoreType;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private agGridDefinition: userListDefinition
  ) {
    this.currentRole = this.appConfig.getLocalData('roles');
    this.serverSideStoreType = 'partial';
    this.rowModelType = 'infinite';
  }

  ngOnInit() {
    this.commonRefresh();
  }

  AssignTypesBasesOnRole() {
    if (this.selectedUserlist == 'invPanel') {
      this.paginationPageSize = 500;
      this.cacheBlockSize = 500;
      this.defaultColDef = this.appConfig.agGridWithAllFunc();
      this.gridApi.setColumnDefs(this.agGridDefinition.panelList())
      // this.columnDefs = this.agGridDefinition.panelList();
      this.getInterviewPanelUsersList();
    }
    if (this.selectedUserlist == 'institute') {
      this.paginationPageSize = 500;
      this.cacheBlockSize = 500;
      this.defaultColDef = this.appConfig.agGridWithAllFunc();
      this.gridApi.setColumnDefs(this.agGridDefinition.instituteList());
      // this.columnDefs = this.agGridDefinition.instituteList();
      this.getInstituteList();
    }
    if (this.selectedUserlist == 'hr') {
      this.paginationPageSize = 500;
      this.cacheBlockSize = 500;
      this.defaultColDef = this.appConfig.agGridWithAllFunc();
      this.gridApi.setColumnDefs(this.agGridDefinition.hrList());
      // this.columnDefs = this.agGridDefinition.hrList();
      this.getAdminHrAndInvUsersList();
    }
    if (this.selectedUserlist == 'candidate') {
      this.paginationPageSize = 100;
      this.cacheBlockSize = 100;
      this.defaultColDef = this.appConfig.agGridWithServerSideAllFunc();
      this.gridApi.setColumnDefs(this.agGridDefinition.candidateList());
      // this.columnDefs = this.agGridDefinition.candidateList();
    }

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.AssignTypesBasesOnRole();
    if (this.selectedUserlist == 'candidate') {
      this.gridColumnApi = params.gridColumnApi;
      var datasource = {
        getRows: (params: IGetRowsParams) => {
        console.log('fetching', params);
        console.log('json', JSON.stringify(params));

        // console.log('ad', this.gridApi);
      // if (params.sortModel.length === 0 && Object.keys(params.filterModel).length == 0) {

        const apiData = {
          startRow: params.startRow,
          endRow: params.endRow,
          isTpo: false
        };

        this.gridApi.showLoadingOverlay();
        this.adminService.getCandidatesList(apiData).subscribe((data1: any) => {
          this.gridApi.hideOverlay();
          // console.log('data', data1);

          this.userList = data1 && data1['data'] ? data1['data'] : [];
          let count = params.startRow;
          this.userList.forEach((element, i) => {
            count = count + 1;
            element['counter'] = count;
            element['created_date'] = element['created_date'] ? element['created_date'] : '';
          });
          this.pageRowCount = data1 && data1['total_count'] ? data1['total_count'] : 0;
          params.successCallback(
            this.userList, this.pageRowCount
          );
        }, (err) => {
          this.gridApi.hideOverlay();
          params.failCallback();
          params.successCallback(
            this.userList, this.pageRowCount
          );
          this.gridApi.showNoRowsOverlay();
        });
      // } else {
      //   this.gridApi.setFilterModel(null);
      //   this.gridApi.setSortModel(null);
      // }

        }
      }
      this.gridApi.setDatasource(datasource);
    }
  }

  paginationChanged(e) {

  }

  sortevent(e) {
  }

  customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }

  onCellClicked(event) {
    // event['data']
    if (this.selectedUserlist == 'invPanel' || this.selectedUserlist == 'hr') {
      if (event.colDef.field === 'user_id') {
        let selectedUserDetail = event['data'] ? event['data'] : '';
        this.agGridDefinition.removeUser(selectedUserDetail);

      }
    }
  }


  getModel(e) {
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {

    }
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickSearchValue);
    const filteredArray = this.gridApi.getModel().rootNode.childrenAfterFilter;
    if (filteredArray && filteredArray.length === 0) {
      this.appConfig.warning('No search results found');
      // this.toast.warning('No reuslts found');
    }
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('LLL');
      return split;
    }
  }
  selectedListChange(e) {
      this.userList = [];
      this.rowData = [];
      // this.AssignTypesBasesOnRole();
  }

  // Interview panel start
  getInterviewPanelUsersList() {
    this.adminService.hruserList().subscribe((data: any) => {
      this.userList = data ? data : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
        element.uid = element.user_id;
        element.checked = false;
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  // Institute list start
  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      const output = split;
      return output;

    } else {
      return '-';
    }
  }
  // To get all users
  getInstituteList() {
    this.adminService.instituteListAfterBulkUpload().subscribe((data1: any) => {
      this.userList = data1 ? data1 : [];
      let count = 0;
      this.userList.forEach(element => {
        count = count + 1;
        element['counter'] = count;
        element['time'] = element && element['time'] ? element['time'] : '';
        const fn = element && element.field_first_name ? element.field_first_name : '';
        const ln = element && element.field_institute_last_name ? element.field_institute_last_name : '';
        element.field_first_name = fn + ' ' + ln;
        element['field_date'] = element && element['field_date'] ? this.getDateFormat(element['field_date']) : '-';
      });
      this.rowData = this.userList;
    }, (err) => {
    });
  }

  // Admin Hr list view
    // To get all users
    getAdminHrAndInvUsersList() {
      this.adminService.userList().subscribe((data: any) => {

        this.userList = data ? data : [];
        let count = 0;
        this.userList.forEach(element => {
          count = count + 1;
          element['counter'] = count;
          element.checked = false;
          element['user_id'] = element['uid'];
        });
        this.rowData = this.userList;
      }, (err) => {
      });
    }



  commonRefresh() {
    this.sharedService.commonUserListRefresh.subscribe((res)=> {
      this.AssignTypesBasesOnRole();
    });
  }

  ngAfterViewInit() {
    // // Hack: Scrolls to top of Page after page view initialized
    // let top = document.getElementById('top');
    // if (top !== null) {
    //   top.scrollIntoView();
    //   top = null;
    // }
  }


}

