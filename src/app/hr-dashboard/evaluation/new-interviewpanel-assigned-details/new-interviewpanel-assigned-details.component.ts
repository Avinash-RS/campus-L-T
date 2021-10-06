import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SharedServiceService } from 'src/app/services/shared-service.service';


@Component({
  selector: 'app-new-interviewpanel-assigned-details',
  templateUrl: './new-interviewpanel-assigned-details.component.html',
  styleUrls: ['./new-interviewpanel-assigned-details.component.scss']
})
export class NewInterviewpanelAssignedDetailsComponent implements OnInit, OnDestroy {


  refreshSubscription: Subscription;

  constructor(
    private router: Router,
    private sharedService: SharedServiceService,
    private activatedRoute: ActivatedRoute
  ) {
   }

  ngOnInit() {
    this.refreshOndriveChangeRXJS();
  }

  refreshOndriveChangeRXJS() {
    this.refreshSubscription = this.sharedService.screenRefreshOnDriveChange
    .pipe(
    finalize(()=> {
      }))
      .subscribe((data: any)=> {
      if (data.includes(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED)) {
      }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription ? this.refreshSubscription.unsubscribe() : '';
  }

}
