import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ModalBoxComponent } from '../modal-box/modal-box.component';

@Component({
  selector: 'app-common-kyc-profile-view',
  templateUrl: './common-kyc-profile-view.component.html',
  styleUrls: ['./common-kyc-profile-view.component.scss']
})
export class CommonKycProfileViewComponent implements OnInit {
  customerCode = this.appConfig.getSelectedCustomerCode();
  constructor(
    public dialogRef: MatDialogRef<ModalBoxComponent>,
    private appConfig: AppConfigService,
    @Inject(MAT_DIALOG_DATA)
    public data
  ) {
    this.data.documents = false;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
