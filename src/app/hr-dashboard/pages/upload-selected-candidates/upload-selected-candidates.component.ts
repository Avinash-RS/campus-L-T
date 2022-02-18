import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import moment from 'moment';
import { AppConfigService } from 'src/app/config/app-config.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-selected-candidates',
  templateUrl: './upload-selected-candidates.component.html',
  styleUrls: ['./upload-selected-candidates.component.scss']
})
export class UploadSelectedCandidatesComponent implements OnInit {

  @Output() tabChange:EventEmitter<any> =new EventEmitter<any>();
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
  selectedTarget: any;
  SavedData: any;
  eventSaver: any;
  totalCountofCandidates: any;
  uploadedListArray: any = [];
  dateFormatExist: boolean;
  firstForm = 'selectedCandidates';
  secondForm = 'hrMapping';
  thirdForm = 'decliners_upload';
  fourthForm = 'medical_upload';
  fifthForm = 'offer_status_upload';
  errorReportsStatus: any;
  errorReports: any = [];
  ICUploadErrorStatus = 'ICUploadsError';

  templates = [
    {
      value: this.firstForm,
      name: 'Upload Selected Candidates',
      path: `${this.BASE_URL}/sites/default/files/Selected_Candidates_Template.csv`
    },
    {
      value: this.secondForm,
      name: 'HR Details Mapping',
      path: `${this.BASE_URL}/sites/default/files/Joiners_Template.csv`
    },
    {
      value: this.thirdForm,
      name: 'Offer Declined Candidates Upload',
      path: `${this.BASE_URL}/sites/default/files/Decliners_Template.csv`
    },
  ];
  larsenSpecificUploads = [{
    value: this.fourthForm,
    name: 'PEMC Upload',
    path: `${this.BASE_URL}/sites/default/files/PEMC_Template.csv`
  },
  {
    value: this.fifthForm,
    name: 'Offer Acceptance Upload',
    path: `${this.BASE_URL}/sites/default/files/Offer_Template.csv`
  }];

  selectedTemplate = this.templates[0];
  selectedTemplatePath: any = `${this.BASE_URL}/sites/default/files/Selected_Candidates_Template.csv`;
  constructor(
    private appConfig: AppConfigService,
    private adminService: AdminServiceService,
    private matDialog: MatDialog,
  ) {
    if (this.appConfig.getSelectedCustomerCode() == '#LTTS') {
      this.templates = this.templates.concat(this.larsenSpecificUploads);
    }
  }

  ngOnInit() {
  }

  changeTemp(e) {
    this.delete();
  }
  nextTab(index) {
    this.tabChange.emit(index);
  }

  downloadTemplate() {
    const excel = this.selectedTemplate.path;
    window.open(excel, '_blank');
  }

  submitOfferStatus() {
    const data = {
      bulk_upload: 'offer-Details-bulk-hr-mapping'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  submitPMEC() {
    const data = {
      bulk_upload: 'PMEC-Details-bulk-hr-mapping'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  submit() {
    const data = {
      bulk_upload: 'selected-candidate-bulk'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  submitHR() {
    const data = {
      bulk_upload: 'selected-candidate-bulk-hr-mapping'
    };
    this.openDialog(ShortlistBoxComponent, data);
  }

  submitDecliners() {
    const data = {
      bulk_upload: 'selected-candidate-bulk-declined-upload'
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
    this.uploadedListArray.forEach(element => {
      let minutes;
      if (date.getMinutes().toString().length === 1) {
        minutes = '0' + date.getMinutes().toString();
      } else {
        minutes = date.getMinutes();
      }
      element['date'] = this.getDateFormat1(date);
      element['field_user_created_by'] = this.appConfig.getLocalData('userId');
      element['time'] = this.tConvert(`${date.getHours()}:${minutes}`);
    });

    if (this.selectedTemplate.value == this.firstForm) {
      this.adminService.SelectedCandidatesBulkUpload(this.uploadedListArray).subscribe((data: any) => {

        const datas = {
          bulk_upload_ic: 'ic-bulk',
          totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
          errorLength: data ? data?.length : 0,
        };
        if(datas['errorLength'] == 0) {
          this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Candidates have been successfully uploaded.' : '', 'Bulk Upload Success');
          this.nextTab('0');
        } else {
          this.openDialog1(ShortlistBoxComponent, datas);
          this.passNotUploadedListToPreview(data, this.ICUploadErrorStatus);
        }
      }, (err) => {

      });
    }
    else if (this.selectedTemplate.value == this.secondForm) {
      this.adminService.SelectedCandidatesHRMappingBulkUpload(this.uploadedListArray).subscribe((data: any) => {

        const datas = {
          bulk_upload_ic: 'ic-bulk',
          totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
          errorLength: data ? data?.length : 0,
        };
        if(datas['errorLength'] == 0) {
          this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Candidates have been successfully uploaded.' : '', 'Bulk Upload Success');
          this.nextTab('0');
        } else {
          this.openDialog1(ShortlistBoxComponent, datas);
          this.passNotUploadedListToPreview(data, this.ICUploadErrorStatus);
        }
      }, (err) => {

      });
    }
    else if (this.selectedTemplate.value == this.thirdForm) {
      this.adminService.declinedCandidatesUpload(this.uploadedListArray).subscribe((data: any) => {

        const datas = {
          bulk_upload_ic: 'ic-bulk',
          totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
          errorLength: data ? data?.length : 0,
        };
        if(datas['errorLength'] == 0) {
          this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Declined Candidates have been successfully uploaded.' : '', 'Bulk Upload Success');
          this.nextTab('0');
        } else {
          this.openDialog1(ShortlistBoxComponent, datas);
          this.passNotUploadedListToPreview(data, this.ICUploadErrorStatus);
        }
      }, (err) => {

      });
    }
    else if (this.selectedTemplate.value == this.fourthForm) {
      this.adminService.PMECDetailsBulkUpload(this.uploadedListArray).subscribe((data: any) => {

        const datas = {
          bulk_upload_ic: 'ic-bulk',
          totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
          errorLength: data ? data?.length : 0,
        };
        if(datas['errorLength'] == 0) {
          this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' PMEC details have been successfully uploaded.' : '', 'Bulk Upload Success');
          this.nextTab('0');
        } else {
          this.openDialog1(ShortlistBoxComponent, datas);
          this.passNotUploadedListToPreview(data, this.ICUploadErrorStatus);
        }
      }, (err) => {

      });
    }
    else if (this.selectedTemplate.value == this.fifthForm) {
      this.adminService.OfferDetailsBulkUpload(this.uploadedListArray).subscribe((data: any) => {

        const datas = {
          bulk_upload_ic: 'ic-bulk',
          totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
          errorLength: data ? data?.length : 0,
        };
        if(datas['errorLength'] == 0) {
          this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Offer details have been successfully uploaded.' : '', 'Bulk Upload Success');
          this.nextTab('0');
        } else {
          this.openDialog1(ShortlistBoxComponent, datas);
          this.passNotUploadedListToPreview(data, this.ICUploadErrorStatus);
        }
      }, (err) => {

      });
    } else { }
  }

  passNotUploadedListToPreview(data, form) {
    if (data && data.length > 0) {
      this.uploadedListArray = [];
      this.errorReportsStatus = form;
      this.errorReports = data;
    } else {
      this.delete();
    }
  }

  upload() {
    this.validFile = false;
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

      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 5 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'Candidate Email Id') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'Business Name')) {
        this.totalCount(this.SavedData);
      } else {
        this.validFile = true;
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  uploadHRDetails() {
    this.validFile = false;
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

      if ((this.SavedData && this.SavedData[0] && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'Email') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'Cadre') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'Designation') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][3] && this.SavedData[0][3].trim() === 'DOJ') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][4] && this.SavedData[0][4].trim() === 'Job_Code') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][5] && this.SavedData[0][5].trim() === 'Function') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][6] && this.SavedData[0][6].trim() === 'Sub_Function') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][7] && this.SavedData[0][7].trim() === 'IS_PS NO.') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][8] && this.SavedData[0][8].trim() === 'DH_PSNO') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][9] && this.SavedData[0][9].trim() === 'HR_PSNO')
        ) {
        this.totalCountHR(this.SavedData);
      } else {
        this.validFile = true;
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  uploadDeclinersDetails() {
    this.validFile = false;
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
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'Remarks') && (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'Declined_date')) {
        this.totalCountDeclinersDetails(this.SavedData);
      } else {
        this.validFile = true;
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  uploadPMECDetails() /*Fourth Form*/ {
    this.validFile = false;
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
      if ((this.SavedData && this.SavedData[1] && this.SavedData[1].length === 5) &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][0] && this.SavedData[1][0].trim() === 'Email ID') &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][1] && this.SavedData[1][1].trim() === 'Medical Test Date') &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][2] && this.SavedData[1][2].trim() === 'Fitness Status') &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][3] && this.SavedData[1][3].trim() === 'Description') &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][4] && this.SavedData[1][4].trim() === 'Filename')
        ) {
        this.totalCountPMECDetails(this.SavedData);
      } else {
        this.validFile = true;
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  uploadOfferAcceptanceDetails() /*Fourth Form*/ {
    this.validFile = false;
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
      if ((this.SavedData && this.SavedData[1] && this.SavedData[1].length === 4) &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][0] && this.SavedData[1][0].trim() === 'Email ID') &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][1] && this.SavedData[1][1].trim() === 'Offer Sent Date') &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][2] && this.SavedData[1][2].trim() === 'Offer Status') &&
        (this.SavedData && this.SavedData[1] && this.SavedData[1][3] && this.SavedData[1][3].trim() === 'Filename')
        ) {
        this.totalCountOfferStatusDetails(this.SavedData);
      } else {
        this.validFile = true;
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  totalCountOfferStatusDetails(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let email; let offerSentDate; let offerStatus; let filepath;
      if (i > 1 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 4) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                offerSentDate = element ? this.momentForm(element) : '';
              } else {
                offerSentDate = element ? element : '';
              }
            }
            if (index == 2) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                offerStatus = element ? element : '';
              }
            }
            if (index == 3) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                filepath = element ? element : '';
              }
            }
          }
        });
        const value = {
          email: email ? email.toString().trim() : '',
          offersent_date: offerSentDate ? offerSentDate.toString().trim() : '',
          offer_status: offerStatus ? offerStatus.toString().trim() : '',
          file_path: filepath ? filepath.toString().trim() : '',
        };

        if (email && email.toString().trim()) {
          listArray.push(value);
        }
      }
    });

    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }

  totalCountPMECDetails(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let email; let examination_date; let fitnessStatus; let description; let filepath;
      if (i > 1 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 5) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                examination_date = element ? this.momentForm(element) : '';
              } else {
                examination_date = element ? element : '';
              }
            }
            if (index == 2) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                fitnessStatus = element ? element : '';
              }
            }
            if (index == 3) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                description = element ? element : '';
              }
            }
            if (index == 4) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                filepath = element ? element : '';
              }
            }
          }
        });
        const value = {
          email: email ? email.toString().trim() : '',
          examination_date: examination_date ? examination_date.toString().trim() : '',
          fitness_status: fitnessStatus ? fitnessStatus.toString().trim() : '',
          description: description ? description : '',
          file_path: filepath ? filepath.toString().trim() : '',
        };

        if (email && email.toString().trim()) {
          listArray.push(value);
        }
      }
    });

    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }

  totalCountHR(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let email; let cadre; let designation; let doj; let job_code; let function1; let sub_function; let is_ps_no; let dh_ps_no; let hr_ps_no;
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 10) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                cadre = element ? element : '';
              }
            }
            if (index == 2) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                designation = element ? element : '';
              }
            }
            if (index == 3) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                doj = element ? this.momentForm(element) : '';
              } else {
                doj = element ? element : '';
              }
            }
            if (index == 4) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                job_code = element ? element : '';
              }
            }
            if (index == 5) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                function1 = element ? element : '';
              }
            }
            if (index == 6) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                sub_function = element ? element : '';
              }
            }
            if (index == 7) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                is_ps_no = element ? element : '';
              }
            }
            if (index == 8) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                dh_ps_no = element ? element : '';
              }
            }
            if (index == 9) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                hr_ps_no = element ? element : '';
              }
            }
          }
        });
        const value = {
          email: email ? email.toString().trim() : '',
          cadre: cadre ? cadre.toString().trim() : '',
          designation: designation ? designation.toString().trim() : '',
          doj: doj ? doj : '',
          job_code: job_code ? job_code.toString().trim() : '',
          function1: function1 ? function1.toString().trim() : '',
          sub_function: sub_function ? sub_function.toString().trim() : '',
          is_ps_no: is_ps_no ? is_ps_no.toString().trim() : '',
          dh_ps_no: dh_ps_no ? dh_ps_no.toString().trim() : '',
          hr_ps_no: hr_ps_no ? hr_ps_no.toString().trim() : ''
        };


        if (email && email.toString().trim()) {
          listArray.push(value);
        }
      }
    });

    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }


  totalCountDeclinersDetails(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let email; let remarks; let decline_date;
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 3) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                remarks = element ? element : '';
              }
            }
            if (index == 2) {
                if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                decline_date = element ? this.momentForm(element) : '';
              } else {
                decline_date = element ? element : '';
              }
            }
          }
        });
        const value = {
          email: email ? email.toString().trim() : '',
          remarks : remarks ? remarks.toString().trim() : '',
          decline_date: decline_date ? decline_date : '',
        };


        if ((email && email.toString().trim())) {
          listArray.push(value);
        }
      }
    });

    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }

  momentForm(date) {
    if (date) {
      const split = moment(date).format('DD-MM-YYYY');
     return split;
    }
    }


  totalCount(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let businessName; let email; let hr_offer_reference; let hr_offer_date; let offer_validity;
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 5) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                businessName = element ? element : '';
              }
            }
            if (index == 2) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                hr_offer_reference = element ? element : '';
              }
            }
            if (index == 3) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                hr_offer_date = element ? this.momentForm(element) : '';
              } else {
                hr_offer_date = element ? element : '';
              }
            }
            if (index == 4) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                offer_validity = element ? this.momentForm(element) : '';
              } else {
                offer_validity = element ? element : '';
              }
            }
          }
        });
        const value = {
          company: businessName ? businessName.toString().trim() : '',
          email: email ? email.toString().trim() : '',
          hr_offer_reference : hr_offer_reference ? hr_offer_reference.toString().trim() : '',
          hr_offer_date: hr_offer_date ? hr_offer_date : '',
          offer_validity: offer_validity ? offer_validity : ''
        };


        if ((businessName && businessName.toString().trim()) || (email && email.toString().trim())) {
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
    this.validFile = false;
  }

  uploadType() {
    if (this.selectedTemplate.value == this.firstForm) {
      this.upload();
    }
    if (this.selectedTemplate.value == this.secondForm) {
      this.uploadHRDetails();
    }
    if (this.selectedTemplate.value == this.thirdForm) {
      this.uploadDeclinersDetails();
    }
    if (this.selectedTemplate.value == this.fourthForm) {
      this.uploadPMECDetails();
    }
    if (this.selectedTemplate.value == this.fifthForm) {
      this.uploadOfferAcceptanceDetails();
    }
  }

  submitType() {
    if (this.selectedTemplate.value == this.firstForm) {
      this.submit();
    } else if (this.selectedTemplate.value == this.secondForm) {
      this.submitHR();
    } else if (this.selectedTemplate.value == this.thirdForm) {
      this.submitDecliners();
    } else if (this.selectedTemplate.value == this.fourthForm) {
      this.submitPMEC();
    } else if (this.selectedTemplate.value == this.fifthForm) {
      this.submitOfferStatus();
    } else { }
  }
  // Open dailog
  openDialog(component, data) {
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
    this.errorReports = [];
    this.uploadedListArray = [];
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
      if (result) {
      }
    });
  }

}
