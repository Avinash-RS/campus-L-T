import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import moment from 'moment';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-tpo-add-candidate',
  templateUrl: './tpo-add-candidate.component.html',
  styleUrls: ['./tpo-add-candidate.component.scss']
})
export class TpoAddCandidateComponent implements OnInit {

  emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255), RemoveWhitespace.whitespace()]);
  email = new FormControl('', [Validators.required, Validators.pattern(this.emailregex), Validators.maxLength(255), RemoveWhitespace.whitespace()]);
  tag = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255), RemoveWhitespace.whitespace()]);

  constructor(
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.name.setValue('');
    this.email.setValue('');
    this.tag.setValue('');
  }

  submit() {

    if (this.name.valid && this.email.valid && this.tag.valid) {
      // Data to be shared for modal box components
      const data = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Are you sure you want to add this user?`,
          type: 'add-tpo',
          identity: 'user-add'
        },
        showConfirm: 'Confirm',
        showCancel: 'Cancel',
        showOk: ''
      };

      this.openDialog(ModalBoxComponent, data);
    } else {
      this.name.markAsTouched();
      this.email.markAsTouched();
      this.tag.markAsTouched();
    }
  }

  uploadListToAPI() {
    const date = new Date();
    let minutes;
    if (date.getMinutes().toString().length === 1) {
      minutes = '0' + date.getMinutes().toString();
    } else {
      minutes = date.getMinutes();
    }

    const currentDate = this.getDateFormat1(date);
    // const time = this.tConvert(`${date.getHours()}:${minutes}`);
    const apiData = [
      {
        tag: this.tag.value,
        name: this.name.value,
        email: this.email.value,
        date: this.getDateFormat1(date),
        field_user_created_by: this.appConfig.getLocalData('userId'),
        time: this.tConvert(`${date.getHours()}:${minutes}`)
      }
    ];
    this.adminService.bulkUploadCandidates(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.appConfig.success('Candidate added successfully', '');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.TPO_DASHBOARD.USER_MANAGEMENT_UPLOADED_LIST);
    }, (err) => {

    });
  }


  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  getDateFormat1(date) {
    if (date) {
      const split = moment(date).format('YYYY-MM-DD');
      const output = split.toUpperCase();
      return output;

    } else {
      return '-';
    }
  }
  getDateFormat(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
      const output = split.toUpperCase();
      return output;

    } else {
      return '-';
    }
  }

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;


    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uploadListToAPI();
      }
    });
  }

}
