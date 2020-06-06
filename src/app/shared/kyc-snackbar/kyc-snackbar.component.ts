import { Component, OnInit, Inject } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalBoxComponent } from '../modal-box/modal-box.component';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-kyc-snackbar',
  templateUrl: './kyc-snackbar.component.html',
  styleUrls: ['./kyc-snackbar.component.scss']
})
export class KycSnackbarComponent implements OnInit {

  constructor(
    private sharedService: SharedServiceService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    public dialogRef: MatDialogRef<KycSnackbarComponent>,
    private appConfig: AppConfigService,
    @Inject(MAT_DIALOG_DATA)
    public data

  ) { }

  ngOnInit() {
  }

  cancel(data) {

    this.dialogRef.close(false);
  }

  submit(data) {
    this.dialogRef.close(true);

  }
}
