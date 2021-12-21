import { Component, OnInit, Inject } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalBoxComponent } from '../modal-box.component';
import { AppConfigService } from 'src/app/config/app-config.service';
import { FormControl, Validators } from '@angular/forms';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';

@Component({
  selector: 'app-shortlist-box',
  templateUrl: './shortlist-box.component.html',
  styleUrls: ['./shortlist-box.component.scss']
})
export class ShortlistBoxComponent implements OnInit {
  regexRestriction: RegExp = /^([a-zA-Z0-9_ \-,.:&/\r\n|\r|\n/]){0,255}$/;
  folder = new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.minLength(3), Validators.pattern(this.regexRestriction)]);
  shortlist = new FormControl('', [RemoveWhitespace.whitespace(), Validators.required, Validators.minLength(3), Validators.pattern(this.regexRestriction)]);
  instituteRejection = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100), RemoveWhitespace.whitespace()]);
  reSubmission = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255), RemoveWhitespace.whitespace()]);
  SecondShortlistradioValue = 'yes';
  skipKyc: any;
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

  confirm() {
    if (this.folder.valid && this.shortlist.valid) {
      const apiFolders = {
        folderName: this.folder.value,
        shortlistName: this.shortlist.value,
        type: 'rec'
      };
      this.dialogRef.close(apiFolders);
    } else {
      this.folder.markAsTouched();
      this.shortlist.markAsTouched();
    }
  }

  secondShortlist() {
    const apiFolders = {
      type: this.SecondShortlistradioValue
    };
    this.dialogRef.close(apiFolders);
  }
  bulkConfirm() {
    let result = {value: true, skipKyc: this.skipKyc}
    this.dialogRef.close(result);
  }
  updateAvailable() {
    this.dialogRef.close('update');
  }
  updateCancel() {
    this.dialogRef.close('cancel');
  }
  adminApprove() {
    const data = {
      status: 'approve'
    };
    this.dialogRef.close(data);
  }
  adminReject() {
    if (this.instituteRejection.valid) {
      const data = {
        status: 'reject',
        comments: this.instituteRejection.value
      };
      this.dialogRef.close(data);
    } else {
      this.instituteRejection.markAsTouched();
    }
  }

  reSubmit() {
    if (this.reSubmission.valid) {
      const data = {
        status: 'resubmit',
        comments: this.reSubmission.value
      };
      this.dialogRef.close(data);
    } else {
      this.reSubmission.markAsTouched();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  cancelWithData() {
    this.dialogRef.close(this.data);
  }

  confirmWithData() {
    this.dialogRef.close(this.data);
  }

}
