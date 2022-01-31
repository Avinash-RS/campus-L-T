import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';

@Component({
  selector: 'app-schedule-interview-popup',
  templateUrl: './schedule-interview-popup.component.html',
  styleUrls: ['./schedule-interview-popup.component.scss']
})
export class ScheduleInterviewPopupComponent implements OnInit, OnDestroy {

  scheduleForm: FormGroup;
  minDate;
  maxDate;
  scheduleRoomsSubscription: Subscription;
  attendeesList = [];
  objList: any;
  toggleVisibility = true;
  buttonLoading = false;
  customerCode = this.appConfig.getSelectedCustomerCode();
  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private glovbal_validators: GlobalValidatorService,
    private adminService: AdminServiceService,
    public appConfig: AppConfigService,
    public dialogRef: MatDialogRef<ScheduleInterviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data
  ) { }

  ngOnInit() {
    this.scheduleformInitialize();
  }

  ngOnDestroy() {
    this.scheduleRoomsSubscription ? this.scheduleRoomsSubscription.unsubscribe() : '';
  }

  scheduleformInitialize() {
    this.attendeesList = this.data;

    if(this.customerCode == '#LTTS'){
      this.scheduleForm = this.fb.group({
        title: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
        password: [null, [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(1000)]],
        startTime: [null, [Validators.required]],
        endTime: [null, [Validators.required]],
        type: ['1', [Validators.required]]
      })
    }else{
      this.scheduleForm = this.fb.group({
        title: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
        password: [null, [RemoveWhitespace.whitespace(), Validators.required, Validators.maxLength(1000)]],
        startTime: [null, [Validators.required]],
        endTime: [null, [Validators.required]],
        type: ['2', [Validators.required]]
      })
    }

  }

  dateChange(){
    this.minDate = new Date();
  }
  closePopup(){
    this.matDialog.closeAll();
  }

  checkIsValidDate() {
    if (moment(this.scheduleForm.value.endTime).isSameOrBefore(this.scheduleForm.value.startTime)) {
      this.appConfig.warning('End Date Time should not go beyond State Date Time')
      return false;
    }
    if (moment(this.scheduleForm.value.startTime).isSameOrAfter(this.scheduleForm.value.endTime)) {
      this.appConfig.warning('Start Date Time should not go beyond End Date Time')
      return false;
    }
    return true;
  }

  scheduleRoom(){
    if (this.scheduleForm.valid && this.checkIsValidDate()) {
      let userDetails = [];
      this.attendeesList.forEach((value)=>{
        const vl = {
          'emailId': value.email,
          'userFullName':value?.name ? value.name : value.employee_name,
          'type':value.type,
        }
        userDetails.push(vl)
      })
      var obj = {
        'roomId':Math.floor(Math.random() * 10000000).toString(),
        'password': this.scheduleForm.value.password,
        'roomName':this.scheduleForm.value.title,
        'startTime': this.scheduleForm.value.startTime,
        'endTime': this.scheduleForm.value.endTime,
        'emailStartTime': this.momentFormCustomizedDateString(this.scheduleForm.value.startTime),
        'emailEndTime': this.momentFormCustomizedDateString(this.scheduleForm.value.endTime),
        "userDtl": userDetails,
        "createdByID" : this.appConfig.getLocalData('userEmail'),
        "createdByName": this.appConfig.getLocalData('username'),
        "type": this.scheduleForm.value.type == '1' ? 'webrtc' : 'teams',
        "status": 'Yet to Start'
      };
    this.objList = obj;
    this.buttonLoading = true;
     this.scheduleRoomsSubscription =  this.adminService.scheduleRooms(this.objList).subscribe((result:any)=>{
      this.buttonLoading = false;
        if(result.success){
          // this.scheduleHirerachy();
          this.dialogRef.close({processAssign: true});
        } else {
          this.appConfig.warningWithTitle('Something went wrong','');
        }
      }, (err)=> {
        this.buttonLoading = false;
      })
    } else {
      this.scheduleForm.valid ? '' : this.appConfig.warning('Form is Invalid');
      this.glovbal_validators.validateAllFields(this.scheduleForm);
    }
  }

  momentFormCustomizedDateString(date) {
    if (date) {
      const split = moment(date).format("LLL");
      return split;
    }
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
     return split;
    }
  }

  // FormControls
  get title() {
    return this.scheduleForm.get('title');
  }
  get password1() {
    return this.scheduleForm.get('password');
  }
  get startTime() {
    return this.scheduleForm.get('startTime');
  }
  get endTime() {
    return this.scheduleForm.get('endTime');
  }
  get type() {
    return this.scheduleForm.get('type');
  }


}
