import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-modal-box',
  templateUrl: './modal-box.component.html',
  styleUrls: ['./modal-box.component.scss']
})
export class ModalBoxComponent implements OnInit {

  constructor(
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
    if (dataToBeShared.identity === 'user-list-delete') {
      this.appConfig.error('User Deleted', '');
      this.dialogRef.close();
    }
    if (dataToBeShared.identity === 'user-add') {
      this.appConfig.success('User Added Successfully', '');
      this.dialogRef.close();
    }

  }

  cancel(dataToBeShared) {
    this.dialogRef.close();
  }

  ok() {

  }


}
