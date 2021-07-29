import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { FormBuilder } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import moment from 'moment';
import { CONSTANT } from 'src/app/constants/app-constants.service';

@Component({
  selector: 'app-upload-test-results',
  templateUrl: './upload-test-results.component.html',
  styleUrls: ['./upload-test-results.component.scss']
})
export class UploadTestResultsComponent implements OnInit {

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

  downloadTemplate() {
    const excel = `${this.BASE_URL}/sites/default/files/sample.csv`;
    window.open(excel, '_blank');
  }
  submit() {
    if(this.dateFormatExist == false){
      const data = {
        bulk_upload: 'test-results'
      };
      this.openDialog(ShortlistBoxComponent, data);
    }
    // const data = {
    //   bulk_upload: 'test-results'
    // };
    // this.openDialog(ShortlistBoxComponent, data);
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
    this.adminService.testResultsUpload(this.uploadedListArray).subscribe((data: any) => {

      const datas = {
        test_results: 'candidate-bulk',
        totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
        errorLength: data ? data.length : 0,
      };
      this.openDialog1(ShortlistBoxComponent, datas);
    }, (err) => {

    });
  }
  upload() {

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

      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length >= 19 && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'Email') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][3] && this.SavedData[0][3].trim() === 'Assessment Name') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][4] && this.SavedData[0][4].trim() === 'Assessment Date & Time') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][5] && this.SavedData[0][5].trim() === 'Shortlist Name') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][6] && this.SavedData[0][6].trim() === 'Total Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][7] && this.SavedData[0][7].trim() === 'Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][8] && this.SavedData[0][8].trim() === 'Percentage') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][9] && this.SavedData[0][9].trim() === 'Total Domain Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][10] && this.SavedData[0][10].trim() === 'Domain Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][11] && this.SavedData[0][11].trim() === 'Domain Percentage') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][12] && this.SavedData[0][12].trim() === 'Total Verbal Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][13] && this.SavedData[0][13].trim() === 'Verbal Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][14] && this.SavedData[0][14].trim() === 'Verbal Percentage') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][15] && this.SavedData[0][15].trim() === 'Total Analytical Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][16] && this.SavedData[0][16].trim() === 'Analytical Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][17] && this.SavedData[0][17].trim() === 'Analytical Percentage') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][18] && this.SavedData[0][18].trim() === 'Total Quantitative Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][19] && this.SavedData[0][19].trim() === 'Quantitative Marks') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][20] && this.SavedData[0][20].trim() === 'Quantitative Percentage')
      ) {

        this.totalCount(this.SavedData);
      } else {
        this.validFile = true;

      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  totalCount(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      // tslint:disable-next-line: variable-name
      let email; let date_times; let assement_name; let shortlist_name; let total_marks; let marks; let percentage;
      let total_domain_marks; let domain_marks; let domain_percentage; let total_verbal_marks; let verbal_marks; let verbal_percentage; let total_analytical_mark;
      let analytical_mark; let analytical_percentage; let total_quantitive_mark; let quantitive_mark; let quantitative_percentage;

      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 21) {
            if (index == 2) {
              email = element ? element : '';
            }
            if (index == 3) {
              assement_name = element ? element : '';
            }
            if (index == 4) {
              date_times = element ? element : '';
            }
            if (index == 5) {

              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                shortlist_name = element ? element : '';
              }
            }
            if (index == 6) {
              total_marks = element ? element : '';
            }
            if (index == 7) {
              marks = element ? element : '';
            }
            if (index == 8) {
              percentage = element ? element : '';
            }
            if (index == 9) {
              total_domain_marks = element ? element : '';
            }
            if (index == 10) {
              domain_marks = element ? element : '';
            }
            if (index == 11) {
              domain_percentage = element ? element : '';
            }
            if (index == 12) {
              total_verbal_marks = element ? element : '';
            }
            if (index == 13) {
              verbal_marks = element ? element : '';
            }
            if (index == 14) {
              verbal_percentage = element ? element : '';
            }
            if (index == 15) {
              total_analytical_mark = element ? element : '';
            }
            if (index == 16) {
              analytical_mark = element ? element : '';
            }
            if (index == 17) {
              analytical_percentage = element ? element : '';
            }
            if (index == 18) {
              total_quantitive_mark = element ? element : '';
            }
            if (index == 19) {
              quantitive_mark = element ? element : '';
            }
            if (index == 20) {
              quantitative_percentage = element ? element : '';
            }
          }
        });
        const value = {
          email: email ? email.toString().trim() : '',
          assement_name: assement_name ? assement_name.toString().trim() : '',
          date_times: date_times ? date_times.toString().trim() : '',
          shortlist_name: shortlist_name ? shortlist_name.toString().trim() : '',
          total_marks: total_marks ? total_marks.toString().trim() : 0,
          marks: marks ? marks.toString().trim() : 0,
          percentage: percentage ? percentage.toString().trim() : 0,
          total_domain_marks: total_domain_marks ? total_domain_marks : 0,
          domain_marks: domain_marks ? domain_marks : 0,
          domain_percentage: domain_percentage ? domain_percentage : 0,
          total_verbal_marks: total_verbal_marks ? total_verbal_marks : 0,
          verbal_marks: verbal_marks ? verbal_marks : 0,
          verbal_percentage: verbal_percentage ? verbal_percentage : 0,
          total_analytical_mark: total_analytical_mark ? total_analytical_mark : 0,
          analytical_mark: analytical_mark ? analytical_mark : 0,
          analytical_percentage: analytical_percentage ? analytical_percentage : 0,
          total_quantitive_mark: total_quantitive_mark ? total_quantitive_mark : 0,
          quantitive_mark: quantitive_mark ? quantitive_mark : 0,
          quantitative_percentage: quantitative_percentage ? quantitative_percentage : 0
        };
        if ((email && email.toString().trim()) || (assement_name && assement_name.toString().trim()) || (date_times && date_times.toString().trim()) || (shortlist_name && shortlist_name.toString().trim()) || (total_marks && total_marks.toString().trim()) || (marks && marks.toString().trim()) || (percentage && percentage.toString().trim())) {
          listArray.push(value);
        }
      }
    });
    this.uploadedListArray = listArray;
    this.submit();
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

    if (event.target.files && (event.target.files[0].name.includes('.csv') || event.target.files[0].type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || event.target.files[0].type.includes('application/vnd.ms-excel'))) {
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
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.SECONDSHORTLISTING);
      if (result) {
      }
    });
  }

}
