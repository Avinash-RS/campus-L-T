import { Component, OnInit } from '@angular/core';
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
  url = null;
  showSizeError = {
    image: false,
    size: false
  };
  signatureData: any;
  selectedImage: any;
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
    this.getLocalForm();
    this.onInitSignatureAssign();
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
            url: apiSignature[0]['field_signature'][0]['url'].replace('http://104.211.226.77', ''),
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
    this.apiForm['field_profile_image'][0]['url'] = this.apiForm['field_profile_image'][0]['url'].replace('http://104.211.226.77', '');

    console.log(this.apiForm);
  }

  submitKYCData() {
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

    console.log('request sent', this.apiForm);


    this.candidateService.editUser(this.apiForm).subscribe((data: any) => {
      console.log('success', data);
      this.appConfig.hideLoader();
      this.appConfig.clearLocalDataOne('KYCAPI');
      this.appConfig.clearLocalDataOne('kycForm');
      this.appConfig.nzNotification('success', 'Submitted', 'Your KYC form has been successfully submitted');
      this.appConfig.routeNavigation(CONSTANT.ENDPOINTS.CANDIDATE_DASHBOARD.PROFILE_VIEW_DETAILS);
    }, (err) => {

    });

  }
  onSubmit() {

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
          confirmText: 'Please confirm your submission of KYC Form',
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
    console.log(event.target.files[0]);

    if (event.target.files && event.target.files[0].type.includes('image/') && !event.target.files[0].type.includes('svg')) {
      this.showSizeError.size = false;
      if (event.target.files[0].size < 51000) {
        this.showSizeError.image = false;
        this.selectedImage = event.target.files[0];

        const fd = new FormData();
        fd.append('file', this.selectedImage);
        const file = event.target.files[0].lastModified.toString() + event.target.files[0].name;
        const reader = new FileReader();
        let urls;
        // console.log(reader.readAsBinaryString(event.target.files[0]));

        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event: any) => { // called once readAsDataURL is completed
          urls = event.target.result;
          this.url = urls;
          this.candidateService.signatureUpload(this.selectedImage, file).subscribe((data: any) => {
            console.log(data);

            this.signatureData = {
              target_id: data.fid[0].value,
              alt: 'signature',
              title: '',
              width: 480,
              height: 100,
              localShowUrl: 'http://104.211.226.77' + data.uri[0].url,
              url: data.uri[0].url,
              status: 'true'
            };
            this.appConfig.setLocalData('signature', JSON.stringify(this.signatureData));
            console.log(this.signatureData);

            this.appConfig.hideLoader();

          }, (err) => {

          });

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
    this.url = null;
    this.signatureData = {
      target_id: null,
      alt: 'TESTING',
      title: '',
      width: 480,
      height: 100,
      localShowUrl: 'http://104.211.226.77' + '',
      url: null,
      status: 'true'
    };
    this.appConfig.clearLocalDataOne('signature');
  }
}
