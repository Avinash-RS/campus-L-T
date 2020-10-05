import { Component, OnInit, Inject } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-screenresolution-box',
  templateUrl: './screenresolution-box.component.html',
  styleUrls: ['./screenresolution-box.component.scss']
})
export class ScreenresolutionBoxComponent implements OnInit {

  constructor(
    private sharedService: SharedServiceService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    public dialogRef: MatDialogRef<ScreenresolutionBoxComponent>,
    private appConfig: AppConfigService,
    @Inject(MAT_DIALOG_DATA)
    public data
  ) { }

  ngOnInit() {
    if (!this.data) {
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  logout() {
        window.close();
  }

}
