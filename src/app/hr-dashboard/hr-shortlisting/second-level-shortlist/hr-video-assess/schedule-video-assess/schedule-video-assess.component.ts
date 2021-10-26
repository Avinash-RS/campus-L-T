import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AppConfigService } from 'src/app/config/app-config.service';
import { RemoveWhitespace } from 'src/app/custom-form-validators/removewhitespace';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
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
  interviewerDetailsList: any = [];
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
  getInterviewersBasedOnShortlistNameSubscription: Subscription;
  getQuestionsForVideoSchedulingSubscription: Subscription;
  refreshSubscription: Subscription;
  hideForm: boolean;
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
    this.getQuestionsForVideoScheduling();
    if (this.TabIndex == '2') {
      this.getCandidatesListBasedOnShortlistName();
    }
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
    this.getInterviewersBasedOnShortlistNameSubscription ? this.getInterviewersBasedOnShortlistNameSubscription.unsubscribe() : '';
    this.getQuestionsForVideoSchedulingSubscription ? this.getQuestionsForVideoSchedulingSubscription.unsubscribe() : '';
  }

  tabChanged(event) {
    this.TabIndex = event.index;
    this.appConfig.setLocalData('tabIndex', this.TabIndex);
    if (this.TabIndex == '2') {
      this.getCandidatesListBasedOnShortlistName();
    }
  }

  tabChange(i) {
    this.TabIndex = i;
    this.appConfig.setLocalData('tabIndex', this.TabIndex);
    if (this.TabIndex == '2') {
      this.getCandidatesListBasedOnShortlistName();
    }
  }

  editRouteParam() {
    // Get url Param to view Edit user page
   this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['shortlist_name']) {
        this.shortlist_name = params['shortlist_name'];
        this.getInterviewerDetails();
      }
      if (params && params['status'] == '1') {
        this.hideForm = true;
        this.tabChange('2');
      }
      else {
      }
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

 getInterviewerDetails() {
   this.getInterviewersBasedOnShortlistNameSubscription = this.adminService.getInterviewersBasedOnShortlistName(this.shortlist_name).subscribe((data:any)=> {
      this.interviewerDetailsList = data ? data : [];
    }, (err)=> {

    });
  }

  labelForInterviewerDropdown(inv) {
    return `${inv.email} (${inv.discipline})`;
  }

  getQuestionsForVideoScheduling() {
    this.questionLoading = true;
   this.getQuestionsForVideoSchedulingSubscription = this.adminService.getQuestionsForVideoScheduling().subscribe((response: any)=> {
      this.questionLoading = false;
      if (response && response.success) {
        this.questionList = response && response.data ? response.data : [];
      } else {
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
      interviewerDetails: [null, [Validators.required]]
    });
  }

  interviewerFormGroup() {
    return this.fb.group({
      user_id: [null],
      full_name: [null, [RemoveWhitespace.whitespace(), Validators.required, this.glovbal_validators.address255()]],
      email: [null],
      discipline: [null],
      })
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
      let apiInterviewArray = [];
      let selectedInterviewers = this.scheduleForm.value.interviewerDetails ? this.scheduleForm.value.interviewerDetails : [];
      let InterviewArray = this.interviewerDetailsList.filter((array1: any)=> {
        return selectedInterviewers.some((array2: any)=> {
          return array1.user_id == array2;
        });
      });
      apiInterviewArray = InterviewArray.map(element => {
        let api = {
        id: element.user_id,
        name: element.full_name,
        email: element.email,
        descipline: element.discipline
      };
      return api;
      });

    let apiQuestionIds = this.selectedQuestionsArray.map((data) => data._id);
    let duration = 0;
    let candidateQuestionIds = this.selectedQuestionsArray.map((data) => {
      duration = duration + (data && data.duration ? data.duration : 0);
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
        driveId: this.appConfig.getLocalData('driveId'),
        is_proctor:"1",
        shortListName: this.shortlist_name,
        orgId: 1,
        title: this.scheduleForm.value.title,
        description: this.scheduleForm.value.description,
        startDateTime: this.scheduleForm.value.startTime,
        EndDateTime: this.scheduleForm.value.endTime,
        duration : duration,
        interviewer: apiInterviewArray ? apiInterviewArray : [],
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
    this.adminService.VideoSchedulingSubmit(apiData).subscribe((response: any)=> {
      if (response && response.success) {
        this.appConfig.success('Schedule Created Successfully');
        this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING);
      } else {
        this.appConfig.warningWithTitle('Something went wrong...', 'Please try again later');
      }
    }, (err)=> {

    });
  }

  addQuestionstoArray() {
    this.selectedQuestionsArray = this.questionList.filter(element => element.checked);
  }

  openDialog(templateRef) {
    this.dialog.open(templateRef, {
      panelClass: 'scheduleVideoPopup',
      width: "60%",
      height: "100%",
      closeOnNavigation: true,
      disableClose: true,
    });
  }

  closedialogbox() {
    this.dialog.closeAll();
  }

  remove(index, currentarray, parentArray) {
    if (parentArray) {
      currentarray[index].checked = false;
      parentArray[index].checked = false;
      currentarray.splice(index, 1);
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
      const split = moment(date).format('DD/MM/YYYY hh:mm:ss a');
     return split;
    }
  }

  interviewersListArray() {
    let selectedInterviewers = this.scheduleForm.value.interviewerDetails;
    let InterviewArray = this.interviewerDetailsList.filter((array1: any)=> {
      return selectedInterviewers.some((array2: any)=> {
        return array1.user_id == array2;
      });
    });
    return InterviewArray ? InterviewArray : [];
  }

  removeInterviewer(i, uid) {
    let selectedInterviewers = this.scheduleForm.value.interviewerDetails.filter((data => data != uid));
      this.scheduleForm.patchValue({
        interviewerDetails: selectedInterviewers
    });
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
  get interviewerDetails() {
    return this.scheduleForm.get('interviewerDetails');
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
