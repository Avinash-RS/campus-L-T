import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

@Component({
  selector: 'app-schedule-video-assess',
  templateUrl: './schedule-video-assess.component.html',
  styleUrls: ['./schedule-video-assess.component.scss']
})
export class ScheduleVideoAssessComponent implements OnInit, AfterViewInit, OnDestroy {
  color = '#BE2423';
  disabled = false;
  scheduleForm: FormGroup;
  minDate;
  maxDate;
  shortlist_name: any;
  questionList: any = [];
  questionLoading: boolean;
  selectAll: boolean;
  selectedQuestionsArray: any = [];
  TabIndex: any = this.appConfig.getLocalData('tabIndex') ? '0' : '0';
  candidateDetailsList: any = [];
  candidateListLoading: boolean;
  candidateFetchAllList: any = [];
  activatedRouteSubscription: Subscription;
  getCandidatesBasedOnShortlistNameSubscription: Subscription;
  getQuestionsForVideoSchedulingSubscription: Subscription;
  refreshSubscription: Subscription;
  VideoSchedulingSubmitSubscription: Subscription;
  ViewSchedulingDetailsSubscription: Subscription;
  viewScheduleDetailsSubscription: Subscription;
  hideForm: boolean;
  viewScheduleApiResponse: any;
  scheduledquestionDetailsArray: any;
  ScheduleDetailsObj: any;
  scheduledQuestionsArray: any;
  viewStatus: boolean;
  categoryList: any;
  selectedCategory: any;
  selectedCategoryItem: any;
  questionListApiResponse: any;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private glovbal_validators: GlobalValidatorService,
    private adminService: AdminServiceService,
    public appConfig: AppConfigService,
    public sharedService: SharedServiceService
    ) {
      this.editRouteParam();
     }

  ngOnInit() {
    this.scheduleformInitialize();
    this.refreshOndriveChangeRXJS();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.VIDEO_ASSESSMENT_SCHEDULE)) {
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING);
      }
    });
  }

  ngOnDestroy() {
    this.appConfig.clearLocalDataOne('tabIndex');
    this.activatedRouteSubscription ? this.activatedRouteSubscription.unsubscribe() : '';
    this.getCandidatesBasedOnShortlistNameSubscription ? this.getCandidatesBasedOnShortlistNameSubscription.unsubscribe() : '';
    this.getQuestionsForVideoSchedulingSubscription ? this.getQuestionsForVideoSchedulingSubscription.unsubscribe() : '';
    this.VideoSchedulingSubmitSubscription ? this.VideoSchedulingSubmitSubscription.unsubscribe() : ''
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
    this.ViewSchedulingDetailsSubscription ? this.ViewSchedulingDetailsSubscription.unsubscribe() : '';
    this.viewScheduleDetailsSubscription ? this.viewScheduleDetailsSubscription.unsubscribe() : '';
  }

  tabChanged(event) {
    this.TabIndex = event.index;
    this.appConfig.setLocalData('tabIndex', this.TabIndex);
    if (this.TabIndex == '2' && !this.hideForm) {
      this.getCandidatesListBasedOnShortlistName();
    }
  }

  tabChange(i) {
    this.TabIndex = i;
    this.appConfig.setLocalData('tabIndex', this.TabIndex);
    if (this.TabIndex == '2' && !this.hideForm) {
      this.getCandidatesListBasedOnShortlistName();
    }
  }

  editRouteParam() {
    // Get url Param to view Edit user page
   this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['shortlist_name'] && params['status'] != '1') {
        this.shortlist_name = params['shortlist_name'];
        this.getQuestionsForVideoScheduling();
      }
      if (params && params['status'] == '1') {
        this.hideForm = true;
        this.viewStatus = true;
        this.shortlist_name = params['shortlist_name'];
        this.tabChange('2');
        this.getScheduleDetails();
        this.getScheduledQuestionDetails(params['schedule_id']);
      }
      else {
      }
    });
 }

 reschedule() {
  this.hideForm = false;
  this.getQuestionsForVideoScheduling();
  setTimeout(() => {
    this.tabChange('0');
  }, 500);
}
 getScheduledQuestionDetails(data) {
  let apiData = {
    "scheduleId": data ? data.toString() : ''
  }
 this.ViewSchedulingDetailsSubscription = this.adminService.ViewSchedulingDetails(apiData).subscribe((response: any)=> {
    if (response && response.success) {
    this.scheduledQuestionsArray = response && response.data && response.data[0] && response.data[0].questionDetailsArray ? response.data[0].questionDetailsArray : [];
    this.ScheduleDetailsObj = response && response.data && response.data[0] && response.data[0].scheduleDetailsArray && response.data[0].scheduleDetailsArray[0] ? response.data[0].scheduleDetailsArray[0] : null;
    this.patchScheduleForm();
    } else {
    response && response.message ? this.appConfig.warning(response.message) : '';
    this.scheduledQuestionsArray = [];
    this.ScheduleDetailsObj = null;
    }
  }, (err)=> {

  });
}

patchScheduleForm() {
  this.scheduleForm.patchValue({
    title: this.ScheduleDetailsObj && this.ScheduleDetailsObj.title ? this.ScheduleDetailsObj.title : 'NA',
    description: this.ScheduleDetailsObj && this.ScheduleDetailsObj.description ? this.ScheduleDetailsObj.description : 'NA',
    startTime: this.ScheduleDetailsObj && this.ScheduleDetailsObj.startDateTime ? this.ScheduleDetailsObj.startDateTime : 'NA',
    endTime: this.ScheduleDetailsObj && this.ScheduleDetailsObj.EndDateTime ? this.ScheduleDetailsObj.EndDateTime : 'NA',
    type: this.ScheduleDetailsObj && this.ScheduleDetailsObj.sendNotification ? this.ScheduleDetailsObj.sendNotification : 'NA',
  })
}

 getScheduleDetails() {
   const apiData = {
    "shortlist_name": this.shortlist_name
  };
  this.candidateListLoading = true;
 this.viewScheduleDetailsSubscription = this.adminService.viewScheduleDetails(apiData).subscribe((response: any)=> {
    this.candidateListLoading = false;
    this.candidateDetailsList = response && response.candidates ? response.candidates : [];
    this.viewScheduleApiResponse = response;
  }, (err)=> {
    this.candidateListLoading = false;
  });
 }

 getCandidatesListBasedOnShortlistName() {
   if (!this.candidateDetailsList || (this.candidateDetailsList && this.candidateDetailsList.length < 1)) {
    this.candidateListLoading = true;
   this.getCandidatesBasedOnShortlistNameSubscription = this.adminService.getCandidatesBasedOnShortlistName(this.shortlist_name).subscribe((data:any)=> {
    this.candidateListLoading = false;
    this.candidateFetchAllList = data ? data : [];
    this.candidateDetailsList = data ? data : [];
  }, (err)=> {
    this.candidateListLoading = false;
  });
  }
 }

 fetchAllCandidates() {
  this.candidateDetailsList = [];
  this.getCandidatesListBasedOnShortlistName();
 }

 removeCandidate(i) {
   this.candidateDetailsList.splice(i, 1);
 }

 firstLetterUpperCase(text) {
  return text ? text.replace(text[0], text[0].toUpperCase()) : '';
 }

 CategoryChanged(e) {
  this.selectAll = false;
  this.selectedCategory = e;
  let cat = this.questionListApiResponse.find(data=> data.categoryName == this.selectedCategory);
  this.questionList = cat ? cat.questionDetails : [];
 }

  getQuestionsForVideoScheduling() {
    this.questionLoading = true;
   this.getQuestionsForVideoSchedulingSubscription = this.adminService.getQuestionsForVideoScheduling().subscribe((response: any)=> {
      this.questionLoading = false;
      if (response && response.success) {
        this.questionListApiResponse = response && response.data ? response.data : [];
       this.selectedCategory = response && response.data && response.data[0] ? response.data[0].categoryName : '';
       this.selectedCategoryItem = response && response.data && response.data[0] ? response.data[0] : '';
       this.questionList = response && response.data && response.data[0] && response.data[0].questionDetails ? response.data[0].questionDetails : [];
       this.categoryList = response && response.data ? response.data : [];
        if (this.scheduledQuestionsArray && this.scheduledQuestionsArray.length > 0) {
          this.scheduledQuestionsArray.forEach((element, i) => {
            let findIndex = this.questionList.findIndex(ele => ele._id == element.questionDetails._id);
            this.questionList && this.questionList.length > 0 ? this.questionList[findIndex].checked = true : '';
          });
          this.addQuestionstoArray();
        }
      } else {
        response && response.message ? this.appConfig.warning(response.message) : '';
        this.questionList = [];
      }
    }, (err)=> {
      this.questionLoading = false;
    });
  }

  scheduleformInitialize() {
    this.scheduleForm = this.fb.group({
      title: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      description: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      type: [null],
    });
  }

  selectAllCheckbox() {
    if (this.selectAll) {
      this.questionList.forEach(element => {
        element.checked = true;
      });
    } else {
      this.questionList.forEach(element => {
        element.checked = false;
      });
    }
  }

  dateChange(){
    this.minDate = new Date();
  }

  checkIsValidDate() {
    if (moment(this.scheduleForm.value.endTime).isSameOrBefore(this.scheduleForm.value.startTime)) {
      this.tabChange('2');
      this.appConfig.warning('End Date Time should not go beyond State Date Time')
      return false;
    }
    if (moment(this.scheduleForm.value.startTime).isSameOrAfter(this.scheduleForm.value.endTime)) {
      this.tabChange('2');
      this.appConfig.warning('Start Date Time should not go beyond End Date Time')
      return false;
    }
    return true;
  }

  scheduleSubmit() {
    if (this.selectedQuestionsArray.length < 1) {
      this.tabChange('0');
      return this.appConfig.warning('No Questions were Selected...')
    }
    if (this.scheduleForm.invalid) {
      this.tabChange('1');
      this.glovbal_validators.validateAllFields(this.scheduleForm);
      return this.appConfig.warning('Please fill the all red highlighted fields in schedule form.')
    }
    if (this.candidateDetailsList.length < 1) {
      this.tabChange('2');
      return this.appConfig.warning('No Candidates were Selected...')
    }
    if (this.checkIsValidDate()) {
      let duration = 0;
      let apiQuestionIds = [];
      this.selectedQuestionsArray.map((data) => {
        data.questionDetails.map((ele)=> {
          duration = duration + (ele && ele.duration ? ele.duration : 0);
          apiQuestionIds.push(ele._id);
        });
      });
    let candidateQuestionIds = this.selectedQuestionsArray.map((data) => {
      return {questionId: data._id, startAt: '', EndAt: ''};
    });
    let candidateDetails = this.candidateDetailsList.map((data)=> {
      return {
          id: data.candidate_user_id,
          firstName: data.full_name,
          lastName: '',
          emailId: data.email,
          shortListStatus: '',
          emailStatus: false,
          isHRprocess: false,
          feedback: '',
          evaluatedBy: '',
          questionWiseVideoTime: candidateQuestionIds
      }
    });
    const apiData = {
        driveId: this.appConfig.getDriveId(),
        is_proctor:"1",
        shortListName: this.shortlist_name,
        orgId: 1,
        createdBy: this.appConfig.getLocalData('userId'),
        title: this.scheduleForm.value.title,
        description: this.scheduleForm.value.description,
        startDateTime: this.scheduleForm.value.startTime,
        EndDateTime: this.scheduleForm.value.endTime,
        duration : duration,
        sendNotification: this.scheduleForm.value.type ? true : false,
        questionIds: apiQuestionIds ? apiQuestionIds : [],
        candidates: candidateDetails
      };
      const data = {
        videoschedule: 'videoschedule',
        returnData: apiData
      };
      this.openDialogBox(ShortlistBoxComponent, data);
    }
  }

  apiVideoScheduling(apiData) {
   this.VideoSchedulingSubmitSubscription = this.adminService.VideoSchedulingSubmit(apiData).subscribe((response: any)=> {
      if (response && response.success) {
        this.appConfig.success('Schedule Created Successfully');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING);
      } else {
        response && response.message ? this.appConfig.warning(response.message) : this.appConfig.warningWithTitle('Something went wrong...', 'Please try again later');
      }
    }, (err)=> {

    });
  }

  addQuestionstoArray() {
    this.selectedQuestionsArray = [];
    this.questionListApiResponse.forEach(element => {
      if (element && element.questionDetails && element.questionDetails.length > 0) {
        let cate = element.questionDetails.filter(elem => elem.checked);
        let category = {
          categoryName: element.categoryName,
          categoryId: element.categoryId ? element.categoryId : null,
          questionDetails: cate && cate.length > 0 ? cate : null
        }
        category.questionDetails ? this.selectedQuestionsArray.push(category) : '';
      }
    });
    this.matDialog.closeAll();
  }

  openDialog(templateRef) {
    this.dialog.open(templateRef, {
      panelClass: 'scheduleVideoPopup',
      width: "60%",
      height: "100%",
      closeOnNavigation: true,
      disableClose: false,
    });
  }

  closedialogbox() {
    this.dialog.closeAll();
  }

  remove(parentIndex, index, currentarray, parentArray) {
    if (parentArray) {
      currentarray[parentIndex]['questionDetails'][index].checked = false;
      currentarray[parentIndex]['questionDetails'].splice(index, 1);
      currentarray[parentIndex]['questionDetails'].length > 0 ? '' : currentarray.splice(parentIndex, 1);
    }

  }
  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
     return split;
    }
  }

  momentFormDateTime(date) {
    if (date) {
      const split = moment(date).format('DD/MM/YYYY hh:mm A');
     return split;
    }
  }

  // FormControls
  get title() {
    return this.scheduleForm.get('title');
  }
  get description() {
    return this.scheduleForm.get('description');
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

    // Open dailog
    openDialogBox(component, data) {
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
          this.apiVideoScheduling(data.returnData);
        }
      });
    }

}
