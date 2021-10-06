import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-interviewpanel-results-upload',
  templateUrl: './new-interviewpanel-results-upload.component.html',
  styleUrls: ['./new-interviewpanel-results-upload.component.scss']
})
export class NewInterviewpanelResultsUploadComponent implements OnInit, AfterViewInit {

  isAssignCandidateToInterviewPanel: any = true;
  BASE_URL = environment.API_BASE_URL;

  constructor(
    private sharedService: SharedServiceService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
   }

}
