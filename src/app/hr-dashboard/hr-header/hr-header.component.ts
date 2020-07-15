import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialog } from '@angular/material';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-hr-header',
  templateUrl: './hr-header.component.html',
  styleUrls: ['./hr-header.component.scss']
})
export class HrHeaderComponent implements OnInit {

  username: any;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.username = this.appConfig.getLocalData('username') ? this.appConfig.getLocalData('username') : 'NA';
  }

  goToHome() {
    // this.logOut();
  }

  logOut() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Are you sure you want to Logout?',
        componentData: '',
        type: 'delete',
        identity: 'logout'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    this.openDialog(ModalBoxComponent, data);
  }

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    dialogDetails = {
      iconName: data.iconName,
      showCancel: data.showCancel,
      showConfirm: data.showConfirm,
      showOk: data.showOk,
      dataToBeShared: data.sharedData,
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const token = this.appConfig.getLocalData('logout-token');
        this.apiService.logout(token).subscribe((data: any) => {
          this.appConfig.clearLocalData();
          this.appConfig.hideLoader();
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
        }, (err) => {
        });
        this.appConfig.consoleLog('resultlogout', result);
      }
    });
  }



}
