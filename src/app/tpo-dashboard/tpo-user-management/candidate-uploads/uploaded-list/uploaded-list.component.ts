import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

@Component({
  selector: 'app-uploaded-list',
  templateUrl: './uploaded-list.component.html',
  styleUrls: ['./uploaded-list.component.scss']
})
export class UploadedListComponent implements OnInit, AfterViewInit {
  showPage = true;
  displayedColumns: any[] = ['counter', 'tag', 'name', 'new_candidate_id', 'email', 'uploaded_by', 'uploader_role', 'date', 'time', 'email_sent', 'checked'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedUserDetail: any;
  userList: any;
  radioCheck;
  selectAllCheck;
  enableSend;

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

  sendEmailPop() {
    const data = {
      bulk_upload: 'tpo-candidate-bulk'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  sendEmail() {
    const apiData = {
      id: []
    };
    this.userList.forEach(element => {
      if (element['checked']) {
        apiData['id'].push(element['id']);
      }
    });
    console.log(apiData);

    this.adminService.tpoBulkMailSent(apiData).subscribe((datas: any) => {
      console.log(datas);

      this.appConfig.hideLoader();
      const data = {
        tpo_bulk_upload_ok: 'ok'
      };
      this.openDialog1(ShortlistBoxComponent, data);
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

  // To get all users
  getUsersList() {
    const apiData = {
      uploaded_id: this.appConfig.getLocalData('userId')
    };
    this.adminService.tpoCandidateListAfterBulkUpload(apiData).subscribe((data1: any) => {
      this.appConfig.hideLoader();
      console.log('data1', data1);
      this.userList = data1 ? data1 : [];
      this.userList.forEach((element, i) => {
        element['time'] = element && element['time'] ? element['time'] : '';
        element['sno'] = i + 1;
        element['checked'] = false;
      });
      this.selectAllCheck = false;
      this.enableSend = false;
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

  selectedUser(userDetail) {
    this.userList.forEach(element => {
      if (element.id === userDetail.id) {
        element.checked = !element.checked;
      }
    });
    this.selectedUserDetail = userDetail;
    console.log(userDetail);
    const en = this.userList.filter((item) => {
      return item.checked;
    });
    if (en.length > 0) {
      this.enableSend = true;
    } else {
      this.enableSend = false;
    }
    console.log(en);

    this.unselectSelectALL();
  }

  selectAllCheckbox(checked) {
    console.log(this.dataSource);

    if (checked['checked']) {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.id === ele.id) {
            // if (element && element['email_sent'] !== 'yes') {
              element.checked = true;
              this.enableSend = true;
            // }
          }
        });
      });
    } else {
      this.userList.forEach(element => {
        this.dataSource.filteredData.forEach(ele => {
          if (element.id === ele.id) {
            element.checked = false;
            this.enableSend = false;
          }
        });
      });
    }
    console.log(this.userList);
  }

  unselectSelectALL() {
    this.selectAllCheck = false;
    const pushChecked = [];
    const pushNotChecked = [];
    let count = 0;
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
  }

  // Open dailog
  openDialog(component, data) {
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
        this.sendEmail();
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
      this.ngOnInit();
      if (result) {
      }
    });
  }

}
