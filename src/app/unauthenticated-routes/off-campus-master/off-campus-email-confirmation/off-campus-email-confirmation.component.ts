import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';

@Component({
  selector: 'app-off-campus-email-confirmation',
  templateUrl: './off-campus-email-confirmation.component.html',
  styleUrls: ['./off-campus-email-confirmation.component.scss']
})
export class OffCampusEmailConfirmationComponent implements OnInit {
  TempToken: any;
  emailId: any;
  driveName: any;
  emailVerificationInprogress: boolean = true;
  emailVerificationSuccess: boolean;
  driveMessage: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService
  ) { }

  ngOnInit() {
    this.verifyToken();
  }

  verifyToken() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['mail'] && params['temp-token']) {
        this.TempToken = params['temp-token'];
        this.emailId = params['mail'];
        this.verifyApiCall(this.TempToken ? this.TempToken : '');
      } else {
        this.emailVerificationInprogress = false;
        this.emailVerificationSuccess = false;
      }
    });
  }

  verifyApiCall(token) {
    const apiData = {
      token
    };
    this.candidateService.offCampusEmailVerification(apiData).subscribe((success: any) => {
      this.driveName = success?.drive_name;
      this.driveMessage = success?.message?.message;
      this.emailVerificationSuccess = true;
      this.emailVerificationInprogress = false;
    }, (error) => {
      this.emailVerificationSuccess = false;
      this.emailVerificationInprogress = false;
    });
  }
}
