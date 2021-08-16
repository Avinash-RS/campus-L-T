import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalBoxComponent } from '../modal-box/modal-box.component';

@Component({
  selector: 'app-common-joining-form',
  templateUrl: './common-joining-form.component.html',
  styleUrls: ['./common-joining-form.component.scss']
})
export class CommonJoiningFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalBoxComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data
  ) {
    this.data.documents = false;
    this.data.isSelected = true;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
