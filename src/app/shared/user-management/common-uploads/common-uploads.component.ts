import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { FormBuilder } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { MatDialog } from '@angular/material';
import { ShortlistBoxComponent } from '../../modal-box/shortlist-box/shortlist-box.component';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-uploads',
  templateUrl: './common-uploads.component.html',
  styleUrls: ['./common-uploads.component.scss']
})

export class CommonUploadsComponent implements OnInit, AfterViewInit {

  @Input() isAssignCandidateToInterviewPanel;
  BASE_URL = environment.API_BASE_URL;
  currentRole: any;
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

  Upload_Candidates = 'candidate';
  Upload_Institutes = 'institute';
  Upload_InterviewPanel = 'interview';
  Upload_CandidateAssigntoInterviewPanel = 'bulkAssign';
  Upload_CandidateAssigneeRemoval = 'removalofPanelist';
  errorReports: any = [];
  candidateErrorStatus = 'candidateError';
  instituteErrorStatus = 'instituteError';
  invPanelErrorStatus = 'invPanelError';
  candidateAssigntoInterviewPanelErrorStatus = 'bulkAssignError';
  Upload_CandidateAssigneeRemovalErrorStatus = 'removalofPanelistError';
  errorReportsStatus: any;
  selectedTemplate = this.Upload_Candidates;
  templates = [
    {
      value: this.Upload_Candidates,
      name: 'Upload Candidates'
    },
    {
      value: this.Upload_Institutes,
      name: 'Upload Institutes'
    },
    {
      value: this.Upload_InterviewPanel,
      name: 'Upload Interview Panel'
    }
  ]
  skipKyc: any;

  constructor(
    private candidateService: CandidateMappersService,
    private fb: FormBuilder,
    private appConfig: AppConfigService,
    private router: Router,
    private adminService: AdminServiceService,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog,
  ) {
    this.currentRole = this.appConfig.getLocalData('roles');
  }

  ngOnInit() {
    this.isBulkAssign();
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  isBulkAssign() {
    if (this.isAssignCandidateToInterviewPanel) {
      this.selectedTemplate = this.Upload_CandidateAssigntoInterviewPanel;
      this.templates = [
        {
          value: this.Upload_CandidateAssigntoInterviewPanel,
          name: 'Bulk Assign'
        },
        {
          value: this.Upload_CandidateAssigneeRemoval,
          name: 'Unassign Interview Panelist'
        }
      ];
      if (this.appConfig.getSelectedCustomerCode() == "#LTTS") {
        this.templates.pop();
      }
    }

  }

  changeTemplate(e) {
    this.delete();
  }
  downloadTemplate() {
    if (this.selectedTemplate == this.Upload_Candidates) {
      const excel = `${this.BASE_URL}/sites/default/files/sample.csv`;
      window.open(excel, '_blank');
    }

    if (this.selectedTemplate == this.Upload_InterviewPanel) {
      const excel = `assets/files/sample_inv.csv`;
      window.open(excel, '_blank');
    }

    if (this.selectedTemplate == this.Upload_Institutes) {
      const excel = `assets/files/Institute_template.csv`;
      window.open(excel, '_blank');
    }

    if (this.selectedTemplate == this.Upload_CandidateAssigntoInterviewPanel) {
      const excel = `${this.BASE_URL}/sites/default/files/HR_Bulk_Assign_Template.csv`;
      window.open(excel, '_blank');
    }

    if (this.selectedTemplate == this.Upload_CandidateAssigneeRemoval) {
      const excel = `${this.BASE_URL}/sites/default/files/HR_Bulk_Unassign_Template.csv`;
      window.open(excel, '_blank');
    }


  }
  submit() {
    if (this.selectedTemplate == this.Upload_Candidates) {
      const data = {
        bulk_upload: 'candidate-bulk-skip-kyc',
        role: this.currentRole,
        drive: this.appConfig.getDriveName()
      };
      this.openDialog(ShortlistBoxComponent, data);
    }

    if (this.selectedTemplate == this.Upload_Institutes) {
      const data = {
        bulk_upload: 'institute-bulk'
      };
      this.openDialog(ShortlistBoxComponent, data);
    }

    if (this.selectedTemplate == this.Upload_InterviewPanel) {
      const data = {
        bulk_upload: 'invPanel-bulk'
      };
      this.openDialog(ShortlistBoxComponent, data);
    }

    if (this.selectedTemplate == this.Upload_CandidateAssigntoInterviewPanel) {
      const data = {
        bulk_upload: 'resultsUpload'
      };
      this.openDialog(ShortlistBoxComponent, data);
    }

    if (this.selectedTemplate == this.Upload_CandidateAssigneeRemoval) {
      const data = {
        bulk_upload: 'unassign'
      };
      this.openDialog(ShortlistBoxComponent, data);
    }

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

  upload() {
    this.uploadedListArray = [];
    this.errorReports = [];
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
      this.checkAndCallRepectiveFormatter(this.SavedData);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  checkAndCallRepectiveFormatter(SavedData) {
    if (this.selectedTemplate == this.Upload_Candidates) {
      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 3 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'Tag') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'name') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && (this.SavedData[0][2].trim() === 'Email ID' || this.SavedData[0][2].trim() === 'email'))) {
        this.candidateExceltoJsonFormatter(this.SavedData);
      } else {
        this.validFile = true;
      }
    }

    if (this.selectedTemplate == this.Upload_Institutes) {
      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 8 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'Institute Name')
        &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'Institute Email Id')
        &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'State')
        &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][3] && this.SavedData[0][3].trim() === 'City')
        &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][4] && this.SavedData[0][4].trim() === 'Contact Person First Name')
        &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][5] && this.SavedData[0][5].trim() === 'Contact Person Last Name')
        &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][6] && this.SavedData[0][6].trim() === 'Contact Person Title')
        &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][7] && this.SavedData[0][7].trim() === 'Contact Person Mobile Number')) {
        this.insitituteExceltoJsonFormatter(this.SavedData);
      } else {
        this.validFile = true;
      }
    }

    if (this.selectedTemplate == this.Upload_InterviewPanel) {
      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 4 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'name') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'employee id') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'email') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][3] && this.SavedData[0][3].trim() === 'discipline')) {
        this.invPanelExceltoJsonFormatter(this.SavedData);
      } else {
        this.validFile = true;
      }
    }

    if (this.selectedTemplate == this.Upload_CandidateAssigntoInterviewPanel) {
      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 3 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'Shortlist Name') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'Candidate Email ID') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'Interview Panel Email ID')) {
        this.assignCandidatetoInvpanelExceltoJsonFormatter(this.SavedData);
      } else {
        this.validFile = true;
      }
    }

    if (this.selectedTemplate == this.Upload_CandidateAssigneeRemoval) {
      if ((this.SavedData && this.SavedData[0] && this.SavedData[0].length === 3 && this.SavedData[0][0] && this.SavedData[0][0].trim() === 'Shortlist Name') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][1] && this.SavedData[0][1].trim() === 'Candidate Email ID') &&
        (this.SavedData && this.SavedData[0] && this.SavedData[0][2] && this.SavedData[0][2].trim() === 'Interview Panel Email ID')) {
        this.removalOfInvpanelExceltoJsonFormatter(this.SavedData);
      } else {
        this.validFile = true;
      }
    }


  }

  removalOfInvpanelExceltoJsonFormatter(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let Shortlist_Name; let candidate_email_id; let inv_panel_email_id;
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 3) {
            if (index == 0) {
              Shortlist_Name = element ? element : '';
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                candidate_email_id = element ? element : '';
              }
            }
            if (index == 2) {
              inv_panel_email_id = element ? element : '';
            }
          }
        });
        const value = {
          shortlist_name: Shortlist_Name ? Shortlist_Name.toString().trim() : '',
          user_email: candidate_email_id ? candidate_email_id.toString().trim() : '',
          hr_email: inv_panel_email_id ? inv_panel_email_id.toString().trim() : ''
        };


        if ((Shortlist_Name && Shortlist_Name.toString().trim()) || (candidate_email_id && candidate_email_id.toString().trim()) || (inv_panel_email_id && inv_panel_email_id.toString().trim())) {
          listArray.push(value);
        }
      }
    });
    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }

  assignCandidatetoInvpanelExceltoJsonFormatter(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let Shortlist_Name; let candidate_email_id; let inv_panel_email_id;
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 3) {
            if (index == 0) {
              Shortlist_Name = element ? element : '';
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                candidate_email_id = element ? element : '';
              }
            }
            if (index == 2) {
              inv_panel_email_id = element ? element : '';
            }
          }
        });
        const value = {
          shortlist_name: Shortlist_Name ? Shortlist_Name.toString().trim() : '',
          user_email: candidate_email_id ? candidate_email_id.toString().trim() : '',
          hr_email: inv_panel_email_id ? inv_panel_email_id.toString().trim() : ''
        };


        if ((Shortlist_Name && Shortlist_Name.toString().trim()) || (candidate_email_id && candidate_email_id.toString().trim()) || (inv_panel_email_id && inv_panel_email_id.toString().trim())) {
          listArray.push(value);
        }
      }
    });
    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }

  invPanelExceltoJsonFormatter(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let name; let employee_id; let email; let discipline;
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 4) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                name = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                employee_id = element ? element : '';
              }
            }
            if (index == 2) {
              email = element ? element : '';
            }
            if (index == 3) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                discipline = element ? element : '';
              }
            }
          }
        });
        const value = {
          name: name ? name.toString().trim() : '',
          employee_id: employee_id ? employee_id.toString().trim() : '',
          email: email ? email.toString().trim() : '',
          discipline: discipline ? discipline.toString().trim() : '',
        };

        if ((name && name.toString().trim()) || (employee_id && employee_id.toString().trim()) || (email && email.toString().trim()) || (discipline && discipline.toString().trim())) {
          listArray.push(value);
        }
      }
    });
    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }

  insitituteExceltoJsonFormatter(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let name; let email; let field_institute_state; let field_institute_city;
      let field_institute_name; let field_institute_last_name; let field_institute_title; let field_institute_mobile_number;
      // if (i > 0 && dup && dup.length >= 3) {
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          // if (index < 3 && element.length > 2) {
          if (index < 8) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                field_institute_name = element ? element : '';
              }
            }
            if (index == 1) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                email = element ? element : '';
              }
            }
            if (index == 2) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                field_institute_state = element ? element : '';
              }
            }
            if (index == 3) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                field_institute_city = element ? element : '';
              }
            }
            if (index == 4) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                name = element ? element : '';
              }
            }
            if (index == 5) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                field_institute_last_name = element ? element : '';
              }
            }
            if (index == 6) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                field_institute_title = element ? element : '';
              }
            }
            if (index == 7) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                field_institute_mobile_number = element ? element : '';
              }
            }

          }
        });
        const value = {
          name: name ? name.toString().trim() : '',
          email: email ? email.toString().trim() : '',
          field_institute_state: field_institute_state ? field_institute_state.toString().trim() : '',
          field_institute_city: field_institute_city ? field_institute_city.toString().trim() : '',
          field_institute_name: field_institute_name ? field_institute_name.toString().trim() : '',
          field_institute_last_name: field_institute_last_name ? field_institute_last_name.toString().trim() : '',
          field_institute_title: field_institute_title ? field_institute_title.toString().trim() : '',
          field_institute_mobile_number: field_institute_mobile_number ? field_institute_mobile_number.toString().trim() : '',
        };


        if ((name && name.toString().trim()) || (email && email.toString().trim()) || (field_institute_mobile_number && field_institute_mobile_number.toString().trim())) {
          listArray.push(value);
        }
      }
    });
    this.uploadedListArray = listArray;

    this.totalCountofCandidates = count - 1;
  }

  candidateExceltoJsonFormatter(data) {
    this.dateFormatExist = false;
    let count = 0;
    const listArray = [];
    data.forEach((dup, i) => {
      let tag; let name; let email;
      if (i > 0 && dup) {
        count += 1;
        dup.forEach((element, index) => {
          if (index < 3) {
            if (index == 0) {
              if (element && typeof element == 'object' && element.toString().endsWith('(India Standard Time)')) {
                this.dateFormatExist = true;
              } else {
                tag = element ? element : '';
              }
            }
            if (index == 1) {
              name = element ? element : '';
            }
            if (index == 2) {
              email = element ? element : '';
            }
          }
        });
        const value = {
          tag: tag ? tag.toString().trim() : '',
          name: name ? name.toString().trim() : '',
          email: email ? email.toString().trim() : ''
        };
        if ((tag && tag.toString().trim()) || (name && name.toString().trim()) || (email && email.toString().trim())) {
          listArray.push(value);
        }
      }
    });
    this.uploadedListArray = listArray;
    this.totalCountofCandidates = count - 1;
  }

  callRespectiveBulkUploadAPI() {
    if (this.selectedTemplate == this.Upload_Candidates) {
      this.candidateBulkUploadAPI();
    }

    if (this.selectedTemplate == this.Upload_Institutes) {
      this.instituteBulkUploadAPI();
    }

    if (this.selectedTemplate == this.Upload_InterviewPanel) {
      this.invPanelBulkUploadAPI();
    }

    if (this.selectedTemplate == this.Upload_CandidateAssigntoInterviewPanel) {
      this.assignCandidatetoInvpanelBulkUploadAPI();
    }

    if (this.selectedTemplate == this.Upload_CandidateAssigneeRemoval) {
      this.removalOfInvpanelBulkUploadAPI();
    }

  }

  removalOfInvpanelBulkUploadAPI() {
    const apiData = {
      field_user_created_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '',
      remove_feedback_only: 0,
      entries: this.uploadedListArray
    }

    this.adminService.AssignedPanelistRemoval(apiData).subscribe((data: any) => {
      const datas = {
        inv_assign_bulk_upload_removal: 'removal',
        totalLength: apiData && apiData.entries ? apiData.entries.length : 0,
        errorLength: data ? data.length : 0,
      };
      if (datas['errorLength'] == 0) {
        this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Interview Panelist has been successfully unassigned.' : '', 'Unassign Success');
        if (this.appConfig.getLocalData('roles') == 'hr') {
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED);
        }
      } else {
        this.openDialog1(ShortlistBoxComponent, datas);
        this.passNotUploadedListToPreview(data, this.Upload_CandidateAssigneeRemovalErrorStatus);
      }
    }, (err) => {

    });
  }

  assignCandidatetoInvpanelBulkUploadAPI() {
    const apiData = {
      field_user_created_by: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '',
      entries: this.uploadedListArray
    }

    this.adminService.bulkUploadInvAssign(apiData).subscribe((data: any) => {
      const datas = {
        inv_assign_bulk_upload_ok: 'candidate-bulk',
        totalLength: apiData && apiData.entries ? apiData.entries.length : 0,
        errorLength: data ? data.length : 0,
      };
      if (datas['errorLength'] == 0) {
        this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Candidates have been successfully assigned.' : '', 'Bulk Upload Success');
        if (this.appConfig.getLocalData('roles') == 'hr') {
          this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.HR_DASHBOARD.NEW_INTERVIEW_PANEL_ASSIGNED);
        }
      } else {
        this.openDialog1(ShortlistBoxComponent, datas);
        this.passNotUploadedListToPreview(data, this.candidateAssigntoInterviewPanelErrorStatus);
      }
    }, (err) => {

    });
  }

  invPanelBulkUploadAPI() {
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
        employee_id: element['employee_id'] ? element['employee_id'] : '',
        panel_discipline: element['discipline'] ? element['discipline'] : '',
        field_user_created_by: this.appConfig.getLocalData('userId'),
        date: this.getDateFormat1(date),
        time: this.tConvert(`${date.getHours()}:${minutes}`)
      };
      apiData.push(ele);
    });
    this.adminService.invBulk(apiData).subscribe((data: any) => {

      const datas = {
        invpanel_bulk_upload_ok: 'candidate-bulk',
        totalLength: apiData ? apiData.length : 0,
        errorLength: data && data.length > 0 ? data.length : 0,
      };

      if (datas['errorLength'] == 0) {
        this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Interview panel has been successfully uploaded.' : '', 'Bulk Upload Success');
        if (this.appConfig.getLocalData('roles') == 'hr') {
          this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST, { id: 3 });
        }
        if (this.appConfig.getLocalData('roles') == 'administrator') {
          this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST, { id: 3 });
        }
      } else {
        this.openDialog1(ShortlistBoxComponent, datas);
        this.passNotUploadedListToPreview(data, this.invPanelErrorStatus);
      }
    }, (err) => {

    });
  }

  instituteBulkUploadAPI() {
    const date = new Date();
    this.uploadedListArray.forEach(element => {
      let minutes;
      if (date.getMinutes().toString().length === 1) {
        minutes = '0' + date.getMinutes().toString();
      } else {
        minutes = date.getMinutes();
      }
      // element['date'] = this.getDateFormat1(date);
      element['inst_upload'] = '1';
      element['field_user_created_by'] = this.appConfig.getLocalData('userId');
      // element['time'] = this.tConvert(`${date.getHours()}:${minutes}`);
    });
    this.adminService.bulkUploadInstitutes(this.uploadedListArray).subscribe((data: any) => {

      const datas = {
        institute_bulk_upload_ok: 'institute-bulk',
        totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
        errorLength: data && data.length ? data.length : 0,
      };

      if (datas['errorLength'] == 0) {
        this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Institute details have been successfully uploaded.' : '', 'Bulk Upload Success');
        if (this.appConfig.getLocalData('roles') == 'hr') {
          this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST, { id: 2 });
        }
        if (this.appConfig.getLocalData('roles') == 'administrator') {
          this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST, { id: 2 });
        }
      } else {
        this.openDialog1(ShortlistBoxComponent, datas);
        this.passNotUploadedListToPreview(data, this.instituteErrorStatus);
      }
    }, (err) => {

    });
  }

  candidateBulkUploadAPI() {
    const date = new Date();
    this.uploadedListArray.forEach(element => {
      let minutes;
      if (date.getMinutes().toString().length === 1) {
        minutes = '0' + date.getMinutes().toString();
      } else {
        minutes = date.getMinutes();
      }
      element['date'] = this.getDateFormat1(date);
      element['is_skip_kyc'] = this.skipKyc && this.skipKyc.value && this.skipKyc.skipKyc ? true : false;
      element['field_user_created_by'] = this.appConfig.getLocalData('userId');
      element['time'] = this.tConvert(`${date.getHours()}:${minutes}`);
    });
    this.adminService.bulkUploadCandidates(this.uploadedListArray).subscribe((data: any) => {
      /* if (result && result.value) {
        this.uploadListToAPI(result && result.skipKyc ? true : false);
      }*/
      const datas = {
        bulk_upload_ok: 'candidate-bulk',
        totalLength: this.uploadedListArray ? this.uploadedListArray.length : 0,
        errorLength: data ? data.length : 0,
        role: this.appConfig.getLocalData('roles')
      };
      // if(datas['totalLength'] - datas['errorLength'] !== 0) {
      if (datas['errorLength'] == 0) {
        if (this.currentRole == 'institute') {
          this.appConfig.successWithTitle('You may now trigger mail to the newly added candidates.', datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Candidate details have been successfully uploaded.' : 'Bulk Upload Success');
        } else {
          this.appConfig.success(datas && datas['totalLength'] ? datas['totalLength'] - datas['errorLength'] + ' Candidate details have been successfully uploaded.' : '', 'Bulk Upload Success');
        }

        if (this.appConfig.getLocalData('roles') == 'hr') {
          this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.HR_DASHBOARD.HR_USER_MANAGEMENT_USERS_LIST, { id: 1 });
        }
        if (this.appConfig.getLocalData('roles') == 'administrator') {
          this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.ADMIN_DASHBOARD.USER_MANAGEMENT_USERS_LIST, { id: 1 });
        }
        if (this.appConfig.getLocalData('roles') == 'institute') {
          this.appConfig.routeNavigationWithQueryParam(CONSTANT.ENDPOINTS.TPO_DASHBOARD.USER_MANAGEMENT_USERS_LIST, { id: 1 });
        }
      } else {
        this.openDialog1(ShortlistBoxComponent, datas);
        this.passNotUploadedListToPreview(data, this.candidateErrorStatus);
      }

    }, (err) => {

    });
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
  removeSelectedCandidate(i) {
    this.uploadedListArray.splice(i, 1);
  }

  backToUpload() {
  }

  uploadText() {
    if (this.selectedTemplate == this.Upload_Candidates) {
      return 'Upload Candidate Details'
    }
    if (this.selectedTemplate == this.Upload_Institutes) {
      return 'Upload Institute Details'
    }
    if (this.selectedTemplate == this.Upload_InterviewPanel) {
      return 'Upload Interview Panel Details'
    }
    if (this.selectedTemplate == this.Upload_CandidateAssigntoInterviewPanel) {
      return 'Upload Candidate Details'
    }
    if (this.selectedTemplate == this.Upload_CandidateAssigneeRemoval) {
      return 'Upload Details'
    }
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
        this.skipKyc = result;
        this.callRespectiveBulkUploadAPI();
      }
    });
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
