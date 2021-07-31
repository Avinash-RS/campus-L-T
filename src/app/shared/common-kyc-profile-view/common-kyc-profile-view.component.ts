import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalBoxComponent } from '../modal-box/modal-box.component';

@Component({
  selector: 'app-common-kyc-profile-view',
  templateUrl: './common-kyc-profile-view.component.html',
  styleUrls: ['./common-kyc-profile-view.component.scss']
})
export class CommonKycProfileViewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalBoxComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data
  ) {
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
