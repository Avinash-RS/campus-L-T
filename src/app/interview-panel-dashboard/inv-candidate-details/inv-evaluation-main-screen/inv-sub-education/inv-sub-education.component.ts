import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';

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
  selector: 'app-inv-sub-education',
  templateUrl: './inv-sub-education.component.html',
  styleUrls: ['./inv-sub-education.component.scss'],
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
export class InvSubEducationComponent implements OnInit {

  @ViewChild('matDialogDocViewer', { static: false }) matDialogRefDocViewer: TemplateRef<any>;
  appConstant = CONSTANT.ENDPOINTS;
  nameOfAssessment: any;
  candidateId: any;
  certificateArr: any;
  uid:any;
  documentDetails: any;
  formSubmitted = true;
  queryParams: { data: any; id: any; name: any; status: any; tag: any; uid: any; email: any; form: any; };

  // Documents
    // Upload
    form_file_id = 'file_id';
    form_id = 'id';
    form_file_path = 'file_path';
    form_file_type = 'filetype';
    form_file_size = 'file_size';
    form_file_name = 'filename';
    form_name_document = 'name';
    form_label = 'label';
    form_description = 'description';
    form_Not_Submitted_Description = 'not_submitted_description';
    form_expectedDate = 'expected_date';
    form_semesterArray = 'sub_documents';
    form_noofSemester = 'no_of_semester';
    form_education_level = 'Education_Level';
    form_bankArray = 'bank';
    form_acc_no = 'account_no';
    form_ifsc_code = 'ifsc_code';
    form_branch = 'branch';

    pdfsrc: any;

  constructor(
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
    this.editRouteParamGetter();
  }

  ngOnInit() {
  }

  // Get url param for edit route
  editRouteParamGetter() {
    // Get url Param to view Edit user page
    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParams = {
        data: params['data'],
        id: params['id'],
        name: params['name'] ? params['name'] : '',
        status: params['status'],
        tag: params['tag'],
        uid: params['uid'],
        email: params['email'],
        form: params['form']
      };
      this.nameOfAssessment = params['data'];
      this.candidateId = params['id'];
      this.uid = params['uid'];
      // this.userlist(params['uid']);
      this.getPreviewData(this.uid);
    });
  }

  getPreviewData(uid) {
    this.candidateService.joiningFormGetPreviewDetailsCommon(uid).subscribe((data: any) => {

      this.documentDetails = data && data.documents ? data.documents : null;
      if (this.documentDetails && this.documentDetails.Joining_Details && this.documentDetails.Joining_Details.length > 0) {
        let joinCheck = [];
        this.documentDetails.Joining_Details.forEach(element => {
          if (element) {
            joinCheck.push(element);
          }
        });
        this.documentDetails.Joining_Details = joinCheck;
      }

    });
  }

  openMatDialog(src, type) {
    if (!type.includes('application/pdf')) {
      return window.open(src, '_blank');
    }
    this.pdfsrc = src;
    // this.pdfsrc = 'http://campus-qa.lntedutech.com/d8cintana2/sites/default/files/Templates/BGV_Declaration.pdf';
    const dialogRef = this.dialog.open(this.matDialogRefDocViewer, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'popupModalContainerForPDFViewer'
    });
  }
  closeBox() {
    this.dialog.closeAll();
  }

  dateConvertion(date) {
    if (date) {
      const split = moment(date).format('DD MMM YYYY');
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format('DD MMM YYYY');
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  dateConvertionMonth(date) {
    if (date) {
      const split = moment(date).format('MMM YYYY');
      if (split == 'Invalid date') {
        const ddFormat = moment(date, 'DD-MM-YYYY').format('MMM YYYY');
        return ddFormat == 'Invalid date' ? null : ddFormat;
      }
      return split == 'Invalid date' ? null : split;
    }
  }

  customEducationLabel(label) {
    if (label == 'SSLC') {
      return 'SSLC/10th';
    }
    if (label == 'HSC') {
      return 'HSC/12th';
    }
    if (label == 'UG') {
      return 'Undergraduate';
    }
    if (label == 'PG') {
      return 'Postgraduate';
    }
    return label;
  }


  viewCerificates(path) {
    // const excel = element && element.download ? element.download : '';
    window.open(path, '_blank');
  }


  next() {
    this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.INTERVIEW_PANEL_DASHBOARD.UNIFIEDREPORTS, this.queryParams);
  }

}
