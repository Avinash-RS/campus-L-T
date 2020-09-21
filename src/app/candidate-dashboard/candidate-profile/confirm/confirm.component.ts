import { Component, OnInit, HostListener } from '@angular/core';
import { AppConfigService } from 'src/app/config/app-config.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { FormBuilder } from '@angular/forms';
import { CONSTANT } from 'src/app/constants/app-constants.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { MatDialog } from '@angular/material';
import { ModalBoxComponent } from 'src/app/shared/modal-box/modal-box.component';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  apiForm: any;
  agree = false;
  url = null;
  showSizeError = {
    image: false,
    size: false,
    maxsize: '',
    minsize: ''
  };
  signatureData: any;
  selectedImage: any;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.appConfig.getLocalData('confirmClick') == 'true') {
      $event.returnValue = true;
    }
  }
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiServiceService,
    private adminService: AdminServiceService,
    private candidateService: CandidateMappersService,
    private sharedService: SharedServiceService,
    private fb: FormBuilder,
    private matDialog: MatDialog,
  ) {
    // this.appConfig.clearLocalDataOne('signature');
  }

  ngOnInit() {
    if (!this.appConfig.getLocalData('confirmClick')) {
      this.appConfig.setLocalData('confirmClick', 'false');
    }
    this.getLocalForm();
    this.onInitSignatureAssign();

    this.convertEduArrToSingleVar();
  }

  kycTerms() {
    const data = {
      iconName: '',
      sharedData: {
        confirmText: 'Bulk Upload helper video',
        componentData: '',
        type: 'kyc-terms',
        identity: 'kyc-terms'
      },
      showConfirm: 'Confirm',
      showCancel: 'Cancel',
      showOk: ''
    };
    this.appConfig.terms(ModalBoxComponent, data);
  }
  convertEduArrToSingleVar() {
    if (this.apiForm['eduArr']) {
      this.apiForm['eduArr'].forEach((element, i) => {
        if (i == '0') {
          this.apiForm[`field_backlogs`] = element['field_backlogs'];
          this.apiForm[`field_board_university`] = element['field_board_university'];
          this.apiForm[`field_discipline`] = element['field_discipline'];
          this.apiForm[`field_institute`] = element['field_institute'];
          this.apiForm[`field_level`] = element['field_level'];
          this.apiForm[`field_percentage`] = element['field_percentage'];
          this.apiForm[`field_specification`] = element['field_specification'];
          this.apiForm[`field_year_of_passing`] = element['field_year_of_passing'];
        } else {
          const num = i;
          this.apiForm[`field_backlogs${num}`] = element['field_backlogs'];
          this.apiForm[`field_board_university${num}`] = element['field_board_university'];
          this.apiForm[`field_discipline${num}`] = element['field_discipline'];
          this.apiForm[`field_institute${num}`] = element['field_institute'];
          this.apiForm[`field_level${num}`] = element['field_level'];
          this.apiForm[`field_percentage${num}`] = element['field_percentage'];
          this.apiForm[`field_specification${num}`] = element['field_specification'];
          this.apiForm[`field_year_of_passing${num}`] = element['field_year_of_passing'];
        }
      });
    }

    if (this.apiForm['langArr']) {
      this.apiForm['langArr'].forEach((element, i) => {
        if (i == '0') {
          this.apiForm[`field_language`] = element['field_language'];
          this.apiForm[`field_read`] = element['field_read'] && element['field_read'][0]['value'] ? [{ value: '1' }] : [{ value: '0' }];
          this.apiForm[`field_write`] = element['field_write'] && element['field_write'][0]['value'] ? [{ value: '1' }] : [{ value: '0' }];
          this.apiForm[`field_speak`] = element['field_speak'] && element['field_speak'][0]['value'] ? [{ value: '1' }] : [{ value: '0' }];
        } else {
          const num = i;
          this.apiForm[`field_language${num}`] = element['field_language'];
          this.apiForm[`field_read${num}`] = element['field_read'] && element['field_read'][0]['value'] ? [{ value: '1' }] : [{ value: '0' }];
          this.apiForm[`field_write${num}`] = element['field_write'] && element['field_write'][0]['value'] ? [{ value: '1' }] : [{ value: '0' }];
          this.apiForm[`field_speak${num}`] = element['field_speak'] && element['field_speak'][0]['value'] ? [{ value: '1' }] : [{ value: '0' }];
        }
      });
    }

    if (this.apiForm['famArr']) {
      this.apiForm['famArr'].forEach((element, i) => {
        if (i == '0') {
          this.apiForm[`field_name_of_your_family`] = element['field_name_of_your_family'];
          this.apiForm[`field_family_date_of_birth`] = element['field_family_date_of_birth'];
          this.apiForm[`field_relationship`] = element['field_relationship'];
          this.apiForm[`field_occupation`] = element['field_occupation'];
        } else {
          const num = i;
          this.apiForm[`field_name_of_your_family${num}`] = element['field_name_of_your_family'];
          this.apiForm[`field_family_date_of_birth${num}`] = element['field_family_date_of_birth'];
          this.apiForm[`field_relationship${num}`] = element['field_relationship'];
          this.apiForm[`field_occupation${num}`] = element['field_occupation'];
        }
      });
    }
  }

  onInitSignatureAssign() {
    if (!this.appConfig.getLocalData('signature')) {
      if (this.appConfig.getLocalData('field_isformsubmitted') && this.appConfig.getLocalData('field_isformsubmitted') === 'true') {
        const apiSignature = JSON.parse(this.appConfig.getLocalData('KYCAPI'));
        if (apiSignature[0]['field_signature'] && apiSignature[0]['field_signature'][0]['url']) {
          this.url = apiSignature[0]['field_signature'][0]['url'];
          this.signatureData = {
            target_id: apiSignature[0]['field_signature'][0]['target_id'],
            alt: 'signature',
            title: '',
            width: 480,
            height: 100,
            localShowUrl: apiSignature[0]['field_signature'][0]['url'],
            url: apiSignature[0]['field_signature'][0]['url'].replace(`${this.appConfig.imageBaseUrl()}`, ''),
            status: 'true'
          };
          this.appConfig.setLocalData('signature', JSON.stringify(this.signatureData));
        }
      }
    }
    if (this.appConfig.getLocalData('signature')) {
      const urlAssign = JSON.parse(this.appConfig.getLocalData('signature'));
      this.url = urlAssign['localShowUrl'];
    }
  }

  getLocalForm() {
    this.apiForm = JSON.parse(this.appConfig.getLocalData('kycForm'));
    this.apiForm['field_profile_image'][0]['url'] = this.apiForm['field_profile_image'][0]['url'].replace(`${this.appConfig.imageBaseUrl()}`, '');

  }

  submitKYCData() {
    delete this.apiForm['eduArr'];
    delete this.apiForm['langArr'];
    delete this.apiForm['famArr'];
    this.apiForm.field_isformsubmitted = [{ value: true }];
    if (this.appConfig.getLocalData('profileData')) {
      // tslint:disable-next-line: quotemark
      if (this.appConfig.getLocalData('profileData') !== "undefined") {
        let pro = JSON.parse(this.appConfig.getLocalData('profileData'));
        this.apiForm.field_profile_image = [
          {
            target_id: pro && pro['fid'] ? pro['fid'] : 12,
            alt: 'Image',
            title: '',
            width: 210,
            height: 230,
            // target_uuid: pro && pro['uuid'] ? pro['uuid'] : 'abc',
            url: pro && pro['apiUrl'] ? pro['apiUrl'] : '/d8cintana2/sites/default/files/2020-06/filename1_1.jpg',
            status: 'true'
          }
        ];
      }
    }


    this.candidateService.editUser(this.apiForm).subscribe((data: any) => {
      this.appConfig.hideLoader();
      this.appConfig.clearLocalDataOne('KYCAPI');
      this.appConfig.clearLocalDataOne('kycForm');
      this.appConfig.clearLocalDataOne('confirmClick');
      // this.appConfig.nzNotification('success', 'Submitted', 'Your KYC form has been successfully submitted');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.KYC_THANKS);
    }, (err) => {

    });

  }
  onSubmit() {
    if (!this.agree && !this.appConfig.getLocalData('signature')) {
      this.appConfig.nzNotification('error', 'Not Submitted', 'Please upload handwritten signature image and click on the checkbox to proceed further');
    } else {
      if (this.agree) {
        if (this.appConfig.getLocalData('signature')) {
          const signature = JSON.parse(this.appConfig.getLocalData('signature'));
          this.apiForm.field_signature = [{
            target_id: signature['target_id'],
            alt: 'signature',
            title: '',
            width: 480,
            height: 100,
            url: signature.url,
            status: 'true'
          }];

          const data = {
            iconName: '',
            sharedData: {
              confirmText: 'Please confirm to submit your details',
              componentData: '',
              type: 'confirm',
              identity: 'kycSubmit'
            },
            showConfirm: 'Confirm',
            showCancel: 'Cancel',
            showOk: ''
          };
          this.openDialog(ModalBoxComponent, data);
        } else {
          this.appConfig.nzNotification('error', 'Not Submitted', 'Please upload your signature to submit the KYC form');
        }
      } else {
        this.appConfig.nzNotification('error', 'Not Submitted', 'Please agree the terms and conditions and privacy policy by clicking on the checkbox');
      }
    }
  }

  cancel() {
    this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
  }

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    dialogDetails = {
      iconName: data.iconName,
      showCancel: data.showCancel,
      showConfirm: data.showConfirm,
      showOk: data.showOk,
      dataToBeShared: data.sharedData,
    };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: dialogDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitKYCData();
      }
    });
  }


  async onSelectFile(event) {

    if (event.target.files && (event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jp')) && !event.target.files[0].type.includes('svg')) {
      this.showSizeError.size = false;
      // if (event.target.files[0].size > 500000 && event.target.files[0].size < 2000000) {
      if (event.target.files[0].size > 40000) {
        if (event.target.files[0].size < 2000000) {
          this.showSizeError.image = false;
          this.selectedImage = event.target.files[0];

          const fd = new FormData();
          fd.append('file', this.selectedImage);
          const file = event.target.files[0].lastModified.toString() + event.target.files[0].name;
          const reader = new FileReader();
          let urls;

          reader.readAsDataURL(event.target.files[0]); // read file as data url
          reader.onload = (event: any) => { // called once readAsDataURL is completed
            urls = event.target.result;
            this.url = urls;
            this.candidateService.signatureUpload(this.selectedImage, file).subscribe((data: any) => {

              this.signatureData = {
                target_id: data.fid[0].value,
                alt: 'signature',
                title: '',
                width: 480,
                height: 100,
                localShowUrl: `${this.appConfig.imageBaseUrl()}` + data.uri[0].url,
                url: data.uri[0].url,
                status: 'true'
              };
              this.appConfig.setLocalData('signature', JSON.stringify(this.signatureData));

              this.appConfig.hideLoader();

            }, (err) => {

            });

          };
        } else {
          this.showSizeError.image = false;
          this.showSizeError.size = true;
          this.showSizeError.maxsize = 'Maximum File Size: 2MB!';
        }
      } else {
        this.showSizeError.image = false;
        this.showSizeError.size = true;
        this.showSizeError.maxsize = 'Minimum File Size: 40kb!';
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
    this.url = null;
    this.signatureData = {
      target_id: null,
      alt: 'TESTING',
      title: '',
      width: 480,
      height: 100,
      localShowUrl: `${this.appConfig.imageBaseUrl()}` + '',
      url: null,
      status: 'true'
    };
    this.appConfig.clearLocalDataOne('signature');
  }
}
