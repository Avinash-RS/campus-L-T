import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { CONSTANT } from 'src/app/constants/app-constants.service';

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
    private sharedService: SharedServiceService
  ) {
  }

  ngOnInit() {
    this.getUsersList();
  }

  applyCriteria() {
    // this.enableCriteriaComponent.emit(true);
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.FIRSTSHORTLISTING_CRITERIA);
  }

  // To get all users
  getUsersList() {
    // this.adminService.getCandidateListForShortlist().subscribe((datas: any) => {
    //   this.appConfig.hideLoader();
    //   console.log('api', datas);
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
      this.userList = data;
      // this.userList.forEach(element => {
      //   element.checked = false;
      // });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    // }, (err) => {
    // });
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



}
