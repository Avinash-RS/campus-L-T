import { Component, OnInit } from '@angular/core';
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
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-invpanel-bulkupload',
  templateUrl: './invpanel-bulkupload.component.html',
  styleUrls: ['./invpanel-bulkupload.component.scss']
})
export class InvpanelBulkuploadComponent implements OnInit {


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
    // const excel = `${this.BASE_URL}/sites/default/files/sample.csv`;
    const excel = `assets/files/sample_inv.csv`;
    window.open(excel, '_blank');
  }
  submit() {
    const data = {
      bulk_upload: 'invPanel-bulk'
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
    const date = new Date();
    const apiData = [];
    this.uploadedListArray.forEach(element => {
      let minutes;
      if (date.getMinutes().toString().length === 1) {
        minutes = '0' + date.getMinutes().toString();
      } else {
        minutes = date.getMinutes();
      }
      const ele = {
        name: element['name'] ? element['name'] : '',
        email: element['email'] ? element['email'] : '',
        employee_id: element['employeeId'] ? element['employeeId'] : '',
        panel_discipline: element['discipline'] ? element['discipline'] : '',
        field_user_created_by: this.appConfig.getLocalData('userId'),
        date: this.getDateFormat1(date),
        time: this.tConvert(`${date.getHours()}:${minutes}`)
      };
      apiData.push(ele);
    });
    this.adminService.invBulk(apiData).subscribe((data: any) => {
      this.appConfig.hideLoader();
      const datas = {
        invpanel_bulk_upload_ok: 'candidate-bulk',
        totalLength: apiData ? apiData.length : 0,
        errorLength: data && data.length > 0 ? data.length : 0,
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
      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 4 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'name') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'employee id') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'email') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][3] && this.SavedData[0][3].trim() === 'discipline')) {
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
      let name; let employeeId; let email; let discipline;
      // if (i > 0 && dup && dup.length >= 3) {
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          // if (index < 3 && element.length > 2) {
          if (index < 4) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                // name = element ? this.getDateFormat(element).toString() : '';
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                name = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                // employeeId = element ? this.getDateFormat(element).toString() : '';
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                employeeId = element ? element : '';
              }
            }
            if (index == 2) {
              email = element ? element : '';
            }
            if (index == 3) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                // discipline = element ? this.getDateFormat(element).toString() : '';
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                discipline = element ? element : '';
              }
            }
          }
        });
        const value = {
          name: name ? name : '',
          employeeId: employeeId ? employeeId : '',
          email: email ? email : '',
          discipline: discipline ? discipline : '',
        };

        if ((name && name.toString().trim()) || (employeeId && employeeId.toString().trim()) || (email && email.toString().trim()) || (discipline && discipline.toString().trim())) {
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
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST);
      if (result) {
      }
    });
  }

}
