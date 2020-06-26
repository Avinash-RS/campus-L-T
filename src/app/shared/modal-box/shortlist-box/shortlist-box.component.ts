import { Component, OnInit, Inject } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalBoxComponent } from '../modal-box.component';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-shortlist-box',
  templateUrl: './shortlist-box.component.html',
  styleUrls: ['./shortlist-box.component.scss']
})
export class ShortlistBoxComponent implements OnInit {

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
  }

}
