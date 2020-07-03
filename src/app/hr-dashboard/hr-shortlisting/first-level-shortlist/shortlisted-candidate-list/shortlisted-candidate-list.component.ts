import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

@Component({
  selector: 'app-shortlisted-candidate-list',
  templateUrl: './shortlisted-candidate-list.component.html',
  styleUrls: ['./shortlisted-candidate-list.component.scss']
})
export class ShortlistedCandidateListComponent implements OnInit, AfterViewInit {


  // displayedColumns: any[] = ['uid', 'name', 'mail', 'roles_target_id', 'checked'];
  displayedColumns: any[] = ['uid', 'name', 'gender', 'dob', 'institute', 'level', 'percentage', 'backlog', 'dateofpassing', 'checked'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Output() enableCriteriaComponent = new EventEmitter<boolean>();
  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  notShowReject: boolean = true;
  notShowShortlist: boolean = true;
  totalCandidates: any;
  selectedCandidates: number;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getUsersList();
  }

  applyCriteria() {
    console.log(this.userList);
    const apiData = {
      user_id: []
    };
    this.userList.forEach(element => {
      if (element['checked']) {
        apiData['user_id'].push(element['uid']);
      }
    });
    console.log(apiData);

    this.adminService.submitAllFilters(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.appConfig.setLocalData('shortListCheckedCandidates', JSON.stringify(apiData['user_id']));
      this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRSTSHORTLISTING_CRITERIA, { data: apiData['user_id'].length });
    }, (err) => {

    });
  }
  tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice(1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}
shortlist() {
  const data = {
    shortlist: 'first'
  };
  this.openDialog(ShortlistBoxComponent, data);
}
apiShortlistSubmit(apiDatas) {
  const date = new Date();
  const currentDate = this.getDateFormat1(date);
  const time =  this.tConvert(`${date.getHours()}:${date.getMinutes()}`);
  const apiUserList = [];
  console.log(currentDate);

  this.userList.forEach(element => {
    if (element['checked']) {
      apiUserList.push(element['uid']);
    }
  });
  const apiData = {
    user_id: apiUserList,
    folder_name: apiDatas && apiDatas['folderName'] ? apiDatas['folderName'] : '',
    shortlist_name: apiDatas && apiDatas['shortlistName'] ? apiDatas['shortlistName'] : '',
    dates: currentDate,
    times: time,
    shortlistby: this.appConfig.getLocalData('username')
  };
  this.adminService.submitShortlistedCandidates(apiData).subscribe((data: any) => {
    console.log(data);

    this.appConfig.hideLoader();
    const datas = {
      first_level_shortlist_success: 'first_level_shortlist_success'
    };
    this.openDialog1(ShortlistBoxComponent, datas);
    this.appConfig.clearLocalDataOne('shortListCheckedCandidates');
    this.getUsersList();

  }, (err) => {

  });
}

getDateFormat(date) {
  if (date) {
    const split = moment(date).format('DD MMM YYYY');
    const output = split;
    return output;

  } else {
    return '-';
  }
}
getDateFormat1(date) {
  if (date) {
    const split = moment(date).format('YYYY-MM-DD');
    const output = split.toUpperCase();
    return output;

  } else {
    return '-';
  }
}

// To get all users
getUsersList() {
  this.adminService.getCandidateListForShortlist().subscribe((datas: any) => {
    console.log('api', datas);
    const align = [];
    let ApiCummulativeBacklog = 0;
    datas.forEach(element => {
      const uid = element && element['uuid'] ? element['uuid'] : '-';
      const name = element && element['name'] ? element['name'] : '-';
      const gender = element && element['field_gender'] ? element['field_gender'] : '-';
      const dob = element && element['field_dob'] ? this.getDateFormat(element['field_dob']) : '-';
      let institute = '-';
      let level = '-';
      let percentage = '-';
      let backlog = '-';
      let dateofpassing = '-';
      const checked = false;
      if (element && element['education'] && element['education'].length > 0) {
        let cummulativeBacklog = 0;
        element['education'].forEach(ele => {
          if (ele && ele['field_level'] === 'Other' && (level !== 'SSLC' && level !== 'HSC' && level !== 'Diplomo' && level !== 'Under Graduation' && level !== 'Post Graduation')) {
            institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
            level = ele && ele['field_level'] ? ele['field_level'] : '-';
            percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
            backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
            dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
          }
          if (ele && ele['field_level'] === 'SSLC' && (level !== 'HSC' && level !== 'Diplomo' && level !== 'Under Graduation' && level !== 'Post Graduation')) {
            institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
            level = ele && ele['field_level'] ? ele['field_level'] : '-';
            percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
            backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
            dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
          }
          if (ele && ele['field_level'] === 'HSC' && (level !== 'Diplomo' && level !== 'Under Graduation' && level !== 'Post Graduation')) {
            institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
            level = ele && ele['field_level'] ? ele['field_level'] : '-';
            percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
            backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
            dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
          }
          if (ele && ele['field_level'] === 'Diplomo' && (level !== 'Under Graduation' && level !== 'Post Graduation')) {
            institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
            level = ele && ele['field_level'] ? ele['field_level'] : '-';
            percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
            backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
            dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
          }
          if (ele && ele['field_level'] === 'Under Graduation' && (level !== 'Post Graduation')) {
            institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
            level = ele && ele['field_level'] ? ele['field_level'] : '-';
            percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
            backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
            dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
          }
          if (ele && ele['field_level'] === 'Post Graduation') {
            institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
            level = ele && ele['field_level'] ? ele['field_level'] : '-';
            percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
            backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
            dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            cummulativeBacklog += (ele && ele['field_backlogs'] && ele['field_backlogs'] !== 'Nil' ? Number(ele['field_backlogs']) : 0);
          }
        });
        ApiCummulativeBacklog = cummulativeBacklog;
      }

      align.push(
        {
          uid,
          name,
          gender,
          dob,
          institute,
          level,
          percentage,
          backlog: ApiCummulativeBacklog,
          dateofpassing,
          checked
        }
      );
    });
    if (this.appConfig.getLocalData('shortListCheckedCandidates')) {
      const localUID = JSON.parse(this.appConfig.getLocalData('shortListCheckedCandidates'));
      if (localUID && localUID.length > 0) {
        align.forEach(element => {
          localUID.forEach(ele => {
            if (element && element['uid'] === ele) {
              element['checked'] = true;
            }
          });
        });
      }
    }
    this.userList = align;
    this.totalCandidates = this.userList.length;
    this.toShoworNotShowFilter();
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.appConfig.hideLoader();
  }, (err) => {
  });
}

selectAllCheckbox(checked) {
  console.log(this.dataSource);

  if (checked['checked']) {
    this.userList.forEach(element => {
      this.dataSource.filteredData.forEach(ele => {
        if (element.uid === ele.uid) {
          element.checked = true;
        }
      });
    });
  } else {
    this.userList.forEach(element => {
      this.dataSource.filteredData.forEach(ele => {
        if (element.uid === ele.uid) {
          element.checked = false;
        }
      });
    });
  }
  console.log(this.userList);
  this.toShoworNotShowFilter();
}

toShoworNotShowFilter() {
  let runElse = true;
  let selectedCount = 0;
  this.userList.forEach(element => {
    if (element.checked) {
      selectedCount += 1;
      this.notShowReject = false;
      this.notShowShortlist = false;
      runElse = false;
    } else {
      if (runElse) {
        this.notShowReject = true;
        this.notShowShortlist = true;
      }
    }
  });
  this.selectedCandidates = selectedCount;
}

unselectSelectALL() {
  console.log(this.userList);

  this.selectAllCheck = false;
  const pushChecked = [];
  const pushNotChecked = [];
  this.userList.forEach(element => {
    if (element.checked) {
      pushChecked.push(element);
    } else {
      pushNotChecked.push(element);
    }
  });

  if (this.userList.length === pushChecked.length) {
    this.selectAllCheck = true;
  }
  // if (this.userList.length === pushNotChecked.length) {
  //   this.selectAllCheck = false;
  // }
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

selectedUser(userDetail) {

  this.userList.forEach(element => {
    if (element.uid === userDetail.uid) {
      element.checked = !element.checked;
    }
  });
  this.selectedUserDetail = userDetail;
  this.toShoworNotShowFilter();
  console.log(userDetail);
  this.unselectSelectALL();
}



// Mat table select all functions below
/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach((row) => {
      this.selection.select(row);
      console.log(this.selection.select(row));

    });
  console.log(this.userList);

}

/** The label for the checkbox on the passed row */
checkboxLabel(row ?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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
      this.apiShortlistSubmit(result);
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
    if (result) {
    }
  });
}

}
