import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import moment from 'moment';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
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
  enableList: boolean;
  selectedTarget: any;
  SavedData: any;
  eventSaver: any;
  totalCountofCandidates: any;
  uploadedListArray: any;
  dateFormatExist: boolean;
  firstForm = 'selectedCandidates';
  secondForm = 'hrMapping';
  thirdForm = 'decliners_upload'
  selectedTemplate = this.firstForm;
  templates = [
    {
      value: this.firstForm,
      name: 'Upload Selected Candidates'
    },
    {
      value: this.secondForm,
      name: 'HR Details Mapping'
    },
    {
      value: this.thirdForm,
      name: 'Offer Declined Candidates Upload'
    }
  ]
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

  changeTemp(e) {
    this.delete();
    if (e.value == this.firstForm) {
      this.selectedTemplate = this.firstForm;
    }
    if (e.value == this.secondForm) {
      this.selectedTemplate = this.secondForm;
    }
    if (e.value == this.thirdForm) {
      this.selectedTemplate = this.thirdForm;
    }    
  }
  nextTab(index) {
    this.tabChange.emit(index);
  }

  downloadTemplate() {
    if (this.selectedTemplate == this.firstForm) {
      const excel = `${this.BASE_URL}/sites/default/files/Selected_Candidates_Template.csv`;
      window.open(excel, '_blank');  
    } else if (this.selectedTemplate == this.secondForm) {
      const excel = `${this.BASE_URL}/sites/default/files/Joiners_Template.csv`;
      window.open(excel, '_blank');  
    } else {
      const excel = `${this.BASE_URL}/sites/default/files/Decliners_Template.csv`;
      window.open(excel, '_blank');
    }
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
    const currentDate = this.getDateFormat1(date);
    // const time = this.tConvert(`${date.getHours()}:${minutes}`);

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
    // let data;
    
    if (this.selectedTemplate == this.firstForm) {
      this.adminService.SelectedCandidatesBulkUpload(this.uploadedListArray).subscribe((data: any) => {
        this.appConfig.hideLoader();
        const datas = {
          bulk_upload_ic: 'ic-bulk',
          totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
          errorLength: data ? data?.length : 0,
        };
        this.openDialog1(ShortlistBoxComponent, datas);
      }, (err) => {
  
      });  
    } 
    else if (this.selectedTemplate == this.secondForm) {
      this.adminService.SelectedCandidatesHRMappingBulkUpload(this.uploadedListArray).subscribe((data: any) => {
        this.appConfig.hideLoader();
        const datas = {
          bulk_upload_ic: 'ic-bulk',
          totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
          errorLength: data ? data?.length : 0,
        };
        this.openDialog1(ShortlistBoxComponent, datas);
      }, (err) => {
  
      });  
    } 
    else {
      this.adminService.declinedCandidatesUpload(this.uploadedListArray).subscribe((data: any) => {
        this.appConfig.hideLoader();
        const datas = {
          bulk_upload_ic: 'ic-bulk',
          totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
          errorLength: data ? data?.length : 0,
        };
        this.openDialog1(ShortlistBoxComponent, datas);
      }, (err) => {
  
      });  
    }
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
      
      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 5 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'Candidate Email Id') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'Business Name')) {
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

  uploadHRDetails() {
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
        // this.enableList = true;
        this.appConfig.hideLoader();
        this.totalCountHR(this.SavedData);
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

  uploadDeclinersDetails() {
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
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'Remarks') && (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'Declined_date')) {
        // this.enableList = true;
        this.appConfig.hideLoader();
        this.totalCountDeclinersDetails(this.SavedData);
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

  totalCountHR(data) {
    this.dateFormatExist = false;
    this.enableList = true;
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
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                cadre = element ? element : '';
              }
            }
            if (index == 2) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                designation = element ? element : '';
              }
            }
            if (index == 3) {
              // if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
              //   this.enableList = false;
              //   this.dateFormatExist = true;
              // } else {
                doj = element ? element : '';
              // }
            }
            if (index == 4) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                job_code = element ? element : '';
              }
            }
            if (index == 5) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                function1 = element ? element : '';
              }
            }
            if (index == 6) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                sub_function = element ? element : '';
              }
            }
            if (index == 7) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                is_ps_no = element ? element : '';
              }
            }
            if (index == 8) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                dh_ps_no = element ? element : '';
              }
            }
            if (index == 9) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
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
    this.enableList = true;
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
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                remarks = element ? element : '';
              }
            }
            if (index == 2) {
              // if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
              //   this.enableList = false;
              //   this.dateFormatExist = true;
              // } else {
                decline_date = element ? element : '';
              // }
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


  totalCount(data) {
    this.dateFormatExist = false;
    this.enableList = true;
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
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                businessName = element ? element : '';
              }
            }
            if (index == 2) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.enableList = false;
                this.dateFormatExist = true;
              } else {
                hr_offer_reference = element ? element : '';
              }
            }
            if (index == 3) {
              // if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
              //   this.enableList = false;
              //   this.dateFormatExist = true;
              // } else {
                hr_offer_date = element ? element : '';
              // }
            }
            if (index == 4) {
              // if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
              //   this.enableList = false;
              //   this.dateFormatExist = true;
              // } else {
                offer_validity = element ? element : '';
              // }
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
    this.enableList = false;
  }

  uploadType() {
    if (this.selectedTemplate == this.firstForm) {
      this.upload();
    }
    if (this.selectedTemplate == this.firstForm) {
      this.uploadHRDetails();
    } else {
      this.uploadDeclinersDetails();
    }
  }

  submitType() {
    if (this.selectedTemplate == this.firstForm) {
      this.submit();
    } else if (this.selectedTemplate == this.secondForm) {
      this.submitHR();
    } else {
      this.submitDecliners();
    }
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
      if (result) {
        const success = result?.totalLength - result?.errorLength;
        const redirect = success > result?.errorLength;
        if (success >= result?.errorLength) {
          this.nextTab('0');
        } else {
          this.nextTab('2');
        }
      }
    });
  }

}
