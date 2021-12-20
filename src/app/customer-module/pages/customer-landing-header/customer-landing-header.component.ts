import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { MatDialog } from '@angular/material';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-customer-landing-header',
  templateUrl: './customer-landing-header.component.html',
  styleUrls: ['./customer-landing-header.component.scss']
})
export class CustomerLandingHeaderComponent implements OnInit {

  username = this.appConfig.getLocalData('username');

  constructor(
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private apiService: ApiServiceService
  ) { }

  ngOnInit() {
  }

  logOut() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Are you sure you want to logout?',
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

            this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HOME);
          }, (err) => {
          });
          // this.appConfig.consoleLog('resultlogout', result);
        }
      });
    }

}
