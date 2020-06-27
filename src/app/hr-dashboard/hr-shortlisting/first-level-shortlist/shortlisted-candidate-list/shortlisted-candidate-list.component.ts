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
    // this.enableCriteriaComponent.emit(true);
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRSTSHORTLISTING_CRITERIA);
  }

  shortlist() {
    const data = {
      shortlist: 'first'
    };
    this.openDialog(ShortlistBoxComponent, data);
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
    this.adminService.getCandidateListForShortlist().subscribe((datas: any) => {
      this.appConfig.hideLoader();
      console.log('api', datas);
      const data = [
        {
          uid: '1',
          name: 'Avinash',
          gender: 'male',
          dob: '29-10-1995',
          institute: 'Sathyabama University',
          level: 'Post Graduate',
          percentage: '70%',
          backlog: 'Nil',
          dateofpassing: 'may 2019',
          checked: false
        },
        {
          uid: '2',
          name: 'Prem',
          gender: 'male',
          dob: '29-10-1995',
          institute: 'Srm University',
          level: 'Post Graduate',
          percentage: '70%',
          backlog: 'Nil',
          dateofpassing: 'may 2019',
          checked: false
        },
        {
          uid: '3',
          name: 'Hari',
          gender: 'male',
          dob: '29-10-1995',
          institute: 'Panimalar University',
          level: 'Post Graduate',
          percentage: '70%',
          backlog: 'Nil',
          dateofpassing: 'may 2019',
          checked: true
        },
        {
          uid: '4',
          name: 'Pradeep',
          gender: 'male',
          dob: '29-10-1995',
          institute: 'Anna University',
          level: 'UG',
          percentage: '70%',
          backlog: 'Nil',
          dateofpassing: 'may 2019',
          checked: false
        },
      ];
      const align = [];
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
          element['education'].forEach(ele => {
            if (ele && ele['field_level'] === 'Other') {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            }
            if (ele && ele['field_level'] === 'sslc') {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            }
            if (ele && ele['field_level'] === 'hsc') {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            }
            if (ele && ele['field_level'] === 'sadsad') {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            }
            if (ele && ele['field_level'] === 'Under Graduation') {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            }
            if (ele && ele['field_level'] === 'Post Graduation') {
              institute = ele && ele['field_institute'] ? ele['field_institute'] : '-';
              level = ele && ele['field_level'] ? ele['field_level'] : '-';
              percentage = ele && ele['field_percentage'] ? ele['field_percentage'] : '-';
              backlog = ele && ele['field_backlogs'] ? ele['field_backlogs'] : '-';
              dateofpassing = ele && ele['field_year_of_passing'] ? this.getDateFormat(ele['field_year_of_passing']) : '-';
            }
          });
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
            backlog,
            dateofpassing,
            checked
          }
        );
      });
      this.userList = align;
      // this.userList.forEach(element => {
      //   element.checked = false;
      // });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    console.log(userDetail);
    this.userList.forEach(element => {
      if (element.uid === userDetail.uid) {
        element.checked = !element.checked;
      }
    });
    this.selectedUserDetail = userDetail;
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
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
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
      }
    });
  }


}
