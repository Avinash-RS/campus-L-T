import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import moment from 'moment';

@Component({
  selector: 'app-new-interviewpanel-results-upload',
  templateUrl: './new-interviewpanel-results-upload.component.html',
  styleUrls: ['./new-interviewpanel-results-upload.component.scss']
})
export class NewInterviewpanelResultsUploadComponent implements OnInit {

  BASE_URL = environment.API_BASE_URL;
  url = null;
  validFile = false;
  showSizeError = {
    image: false,
    size: false
  };
  signatureData: any;
  selectedImage: any;
  fileName: any;
  fileSize: any;
  enableList: boolean;
  selectedTarget: any;
  SavedData: any;
  eventSaver: any;
  totalCountofCandidates: any;
  uploadedListArray: any;
  dateFormatExist: boolean;

  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    // Sub-Navigation menus. This will be retrieved in Admin master component
    const subWrapperMenus = [
    //   {
    //     icon: '002-cv.svg',
    //     name: 'Candidate details',
    //     router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_CANDIDATE_DETAILS
    //   },
    //   {
    //     icon: '002-cv.svg',
    //     name: 'Interview panel',
    //     router: CONSTANT.ENDPOINTS.HR_DASHBOARD.EVALUATION_INTERVIEW_PANEL,
    //     active: true
    //   },
    {
      icon: '002-cv.svg',
      name: 'Interview Panel Assign',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNMENT
    },
    {
      icon: '002-cv.svg',
      name: 'Assigned Details',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED
    },
    {
      icon: '002-group-1.svg',
      name: 'Bulk Assign',
      router: CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_RESULTS_UPLOAD
    }

    ];
    this.sharedService.subMenuSubject.next(subWrapperMenus);
  }

  ngOnInit() {
  }

  downloadTemplate() {
    const excel = `${this.BASE_URL}/sites/default/files/Results_upload.csv`;
    window.open(excel, '_blank');
  }
  submit() {
    const data = {
      bulk_upload: 'resultsUpload'
    };
    this.openDialog(ShortlistBoxComponent, data);
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

  uploadListToAPI() {
    this.uploadedListArray.forEach(element => {
      if (element) {
        element['field_user_created_by'] = this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '';
      }
    });
    
    this.adminService.bulkUploadInvAssign(this.uploadedListArray).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const datas = {
        inv_assign_bulk_upload_ok: 'candidate-bulk',
        totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
        errorLength: data ? data.length : 0,
      };
      this.openDialog1(ShortlistBoxComponent, datas);
    }, (err) => {

    });
  }
  upload() {
    this.appConfig.showLoader();
    this.validFile = false;
    const apiData = {
      source_file: this.url ? this.url.replace('data:text/csv;base64,', '').toString() : ''
    };
    /* wire up file reader */
    const target: DataTransfer = (this.selectedTarget) as DataTransfer;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.SavedData = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 3 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'Email') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'College') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'Interviewer Email')) {
        // this.enableList = true;
        this.appConfig.hideLoader();
        this.totalCount(this.SavedData);
      } else {
        this.validFile = true;
        this.appConfig.hideLoader();
      }
    };
    reader.readAsBinaryString(target.files[0]);
    // this.adminService.uploadCSV(apiData).subscribe((datas: any) => {
    //   console.log(datas);
    //   this.appConfig.hideLoader();

    // }, (err) => {

    // });
  }

  totalCount(data) {
    this.dateFormatExist = false;
    this.enableList = true;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let user_email; let college; let hr_email;
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 3) {
            if (index == 0) {
              user_email = element ? element : '';
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                college = element ? element : '';
              }
            }
            if (index == 2) {
              hr_email = element ? element : '';
            }
          }
        });
        const value = {
          user_email: user_email ? user_email : '',
          college: college ? college : '',
          hr_email: hr_email ? hr_email : ''
        };


        if ((user_email && user_email.toString().trim()) || (college && college.toString().trim()) || (hr_email && hr_email.toString().trim())) {
          listArray.push(value);
        }
      }
    });
    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }

  removeSelectedCandidate(i) {
    this.uploadedListArray.splice(i, 1);
  }

  backToUpload() {
    this.enableList = false;
  }



  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    // dialogDetails = {
    //   iconName: data.iconName,
    //   showCancel: data.showCancel,
    //   showConfirm: data.showConfirm,
    //   showOk: data.showOk,
    //   dataToBeShared: data.sharedData,
    // };

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

  async onSelectFile(event) {
    this.validFile = false;

    if (event.target.files && event.target.files[0].name.includes('.csv')) {
      this.showSizeError.size = false;
      if (event.target.files[0].size < 2000000) {
        this.showSizeError.image = false;
        this.fileName = event.target.files[0]['name'];
        this.fileSize = (Number(event.target.files[0]['size']) / 1024).toFixed(2);
        this.selectedImage = event.target.files[0];
        this.selectedTarget = event.target;
        this.eventSaver = event;

        const fd = new FormData();
        fd.append('file', this.selectedImage);
        const file = event.target.files[0].lastModified.toString() + event.target.files[0].name;
        const reader = new FileReader();
        let urls;

        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event: any) => { // called once readAsDataURL is completed
          urls = event.target.result;
          this.url = event.target.result;
        };
      } else {
        this.showSizeError.image = false;
        this.showSizeError.size = true;
        // this.url = null;
      }
    } else {
      this.showSizeError.size = false;
      this.showSizeError.image = true;
      // this.url = null;
    }
  }

  public delete() {
    this.showSizeError.image = false;
    this.showSizeError.size = false;
    this.validFile = false;
    this.dateFormatExist = false;
    this.url = null;
  }

  // Open dailog
  openDialog1(component, data) {
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
      this.enableList = false;
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED);
      if (result) {
      }
    });
  }



}
