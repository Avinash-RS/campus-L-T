import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { GlobalValidatorService } from 'src/app/custom-form-validators/globalvalidators/global-validator.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { LoaderService } from 'src/app/services/loader-service.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    // dateInput: 'DD MMM YYYY', // output ->  01 May 1995
    dateInput: 'DD-MM-YYYY', // output ->  01-10-1995
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-joining-preview',
  templateUrl: './joining-preview.component.html',
  styleUrls: ['./joining-preview.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class JoiningPreviewComponent implements OnInit, AfterViewInit {

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private loadingService: LoaderService,
    private sharedService: SharedServiceService,
    public candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private glovbal_validators: GlobalValidatorService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.showStepper();
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  showStepper() {
    this.sharedService.joiningFormActiveSelector.next('preview');
  }

}
