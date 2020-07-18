import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-modal-box',
  templateUrl: './modal-box.component.html',
  styleUrls: ['./modal-box.component.scss']
})
export class ModalBoxComponent implements OnInit {

  constructor(
    private sharedService: SharedServiceService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    public dialogRef: MatDialogRef<ModalBoxComponent>,
    private appConfig: AppConfigService,
    @Inject(MAT_DIALOG_DATA)
    public data

  ) { }

  ngOnInit() {
    // console.log(this.dialogRef);
    // console.log(this.data);

  }

  submit(dataToBeShared) {
    // To Delete User
    if (dataToBeShared.identity === 'user-list-delete') {
      this.adminService.deleteUser(dataToBeShared.componentData.uid).subscribe((data) => {
        this.sharedService.updateUserlist.next();
        this.appConfig.error('User Deleted', '');
      }, (err) => {

      });
      this.dialogRef.close();
    }
    // To Add User
    if (dataToBeShared.identity === 'user-add') {
      this.adminService.addUser(dataToBeShared.componentData).subscribe((success: any) => {
        const mail = {
          mail: dataToBeShared.componentData.mail[0].value
        };
        this.adminService.forgotPassword(mail).subscribe((Emailsuccess) => {

        }, (err) => {

        }, () => {
          this.appConfig.hideLoader();
          this.appConfig.success('Email with verification link has sent successfully', '');
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST);
        });
      }, (error) => {
      });
      this.dialogRef.close();
    }

    // To Edit User
    if (dataToBeShared.identity === 'user-update') {
      this.adminService.editUser(dataToBeShared.componentData, dataToBeShared.userId).subscribe((success: any) => {
        this.appConfig.hideLoader();
        this.appConfig.success('User updated successfully', '');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST);
      }, (error) => {
      });
      this.dialogRef.close();
    }

    // To logout User
    if (dataToBeShared.identity === 'logout') {
      this.dialogRef.close(true);
    }

    // To Submit KYC Forms
    if (dataToBeShared.identity === 'kycSubmit') {
      this.dialogRef.close(true);
    }

  }

  cancel(dataToBeShared) {
    this.dialogRef.close(false);
  }

  submitTPOADDCandidate() {
    this.dialogRef.close(true);
  }

  ok() {

  }


}
