import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, NgForm } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { MatDialog } from '@angular/material';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';
import { LoaderService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-candidate-upload-document',
  templateUrl: './candidate-upload-document.component.html',
  styleUrls: ['./candidate-upload-document.component.scss']
})
export class CandidateUploadDocumentComponent implements OnInit {

  educationValuearray: any = [];
  certificateValuearray: any = [];
  otherDocValuearray: any = [];
  selectedImage: any;
  showResumeImgSizeError = false;
  showEducationImgSizeErr = false;
  showCertificateImgSizeErr = false;
  showOtherImgSizeErr = false;
  urlResume = null;
  urlEducation = [];
  urlCertificate = null;
  urlOther = null;
  educationDropDownLevel: any = [];
  educationDetailsArr = [];
  certificatDetailsArr = [];
  otherDetailsArr = [];
  resumeFile: any;
  showResumeImgError = false;
  showEducationImgErr = false;
  showCertificateImgErr = false;
  showOtherImgErr = false;
  saveAndSubmitBtnDisable = false;
  selectedDropdownValue = [];
  documentUploadType: any;
  getResumeData: any;
  getCertificateData: any;
  getOtherData: any;
  updateDocumentIndex: any;
  updateMode = false;
  filelists: any;
  regex: RegExp = /^[a-zA-Z0-9,.!? ]*$/;
  NewcertificateName = new FormControl('', [Validators.pattern(this.regex), Validators.maxLength(200)]);
  NewOther = new FormControl('', [Validators.pattern(this.regex), Validators.maxLength(200)]);
  resumeUploadForm = new FormGroup({
    resume: new FormControl()
  })
  educationUploadForm: FormGroup;
  certificateUploadForm: FormGroup;
  otherUploadForm: FormGroup;
  savesubmitDisable: any;
  showLevel: any;


  constructor(private fb: FormBuilder,
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
    private loadingService: LoaderService,
    private matDialog: MatDialog) { }

  ngOnInit() {
    this.saveAndSubmitBtnDisable = false;
    this.urlCertificate = null;
    this.urlOther = null;

    this.getUploadedDocument();
    this.listOfDocs();
    let userid = {
      'id': this.appConfig.getLocalData('userId')
    }
  }

  listOfDocs() {
    let apiData = {
      user_id: this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '',
    };
    this.candidateService.getListofDocs(apiData).subscribe((data: any) => {

      this.filelists  = data ? data : [];
    }, (err) => {

    });
  }

  viewDocs(url) {
    let path = url && url['certificate_url'] ? url['certificate_url'] : '';
    window.open(path, '_blank');

  }

  viewDocuments(url) {
    let path = url;
    window.open(path, '_blank');
  }

  getUploadedDocument() {
    var userid = {
      'id': this.appConfig.getLocalData('userId')
    }
    this.candidateService.getUploadedDocument(userid).subscribe((data: any) => {
      this.educationValuearray = data[0][0].education_documents;
      this.selectedDropdownValue = [];
      this.getResumeData = data[0][0].resume_details[0];
      this.getCertificateData = data[0][0].certificate_array[0];
      this.getOtherData = data[0][0].other_array[0];
      if (data[0][0].resume_details[0]) {
        this.urlResume = data[0][0].resume_details[0].filename;
      }
      if (data[0][0].certificate_array[0]) {
        this.urlCertificate = data[0][0].certificate_array[0].filename;
      }
      if (data[0][0].other_array[0]) {
        this.urlOther = data[0][0].other_array[0].filename;
      }
      this.NewcertificateName.patchValue(data[0][0].certificate_array[0] && data[0][0].certificate_array[0]['certificate_name'] ? data[0][0].certificate_array[0]['certificate_name'] : '');
      this.NewOther.patchValue(data[0][0].other_array[0] && data[0][0].other_array[0]['description'] ? data[0][0].other_array[0]['description'] : '');

      // this.FormInitialization();

    }, (err) => {

    });
  }


  stoppropgation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  edudropdownChange(i) {

  }

  removeCert(id, label) {
    const apiData = {
      certicate_id: id ? id : '',
      label: label ? label : ''
    }
      let btnType = 'remove';
      const data = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Are you sure you want to upload this documents?`,
          type: 'upload-tpo',
          identity: 'upload-doc'
        },
        showText: btnType == 'remove' ? 'Are you sure you want to remove this document' : '',
        showConfirm: 'Confirm',
        documentUpload: 'uploadDoc',
        showCancel: 'Cancel',
        showOk: ''
      }
      this.openDialog(ShortlistBoxComponent, data, apiData);
  }
  removeCertApi(apiData) {
    this.candidateService.removeCeritficate(apiData).subscribe((data: any)=> {

      this.appConfig.nzNotification('success', 'Removed', 'Document removed successfully');
      this.ngOnInit();
    }, (err)=> {

    });
  }

  onSelectFile(event, uploadType, i) {


    this.documentUploadType = uploadType;
    this.updateDocumentIndex = i;
    const fd = new FormData();
    if (uploadType == 'resume') {
      if (event.target.files && (event.target.files[0].type.includes('application/pdf'))) {
        this.showResumeImgError = false;
        if (event.target.files[0].size < 2000000) {
          this.showResumeImgSizeError = false;
          this.urlResume = event.target.files[0].name;
          this.selectedImage = event.target.files[0];
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', '');
          fd.append('label', 'resume');
          fd.append('level', '');
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, uploadType, i);
        } else {
          this.showResumeImgSizeError = true;
        }
      } else {
        this.showResumeImgError = true;
      }
    } else if (uploadType == 'education') {
      if (event.target.files && event.target.files[0].type.includes('application/pdf')) {
        this.showEducationImgErr = false;
        if (event.target.files[0].size < 2000000) {
          this.showEducationImgSizeErr = false;
          // if (event.target.id == 'files-input-' + i) {
            this.urlEducation = event.target.files[0].name
          // }
          this.selectedImage = event.target.files[0];
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', '');
          fd.append('label', 'education');
          fd.append('level', i);
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, uploadType, i);
        } else {
          this.showLevel = i;
          this.showEducationImgSizeErr = true;
        }
      } else {
        this.showLevel = i;
        this.showEducationImgErr = true;
      }
    } else if (uploadType == 'certificate') {
      if (event.target.files && event.target.files[0].type.includes('application/pdf')) {
        this.showCertificateImgErr = false;
        if (event.target.files[0].size < 2000000) {
          this.showCertificateImgSizeErr = false;

          this.urlCertificate = event.target.files[0].name;
          this.selectedImage = event.target.files[0];
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.NewcertificateName.value ? this.NewcertificateName.value : '');
          fd.append('label', 'certificate');
          fd.append('level', '');
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, uploadType, i);
        } else {
          this.showCertificateImgSizeErr = true;
        }
      } else {
        this.showCertificateImgErr = true;
      }
    } else if (uploadType == 'other') {
      if (event.target.files && event.target.files[0].type.includes('application/pdf')) {
        this.showOtherImgErr = false;
        if (event.target.files[0].size < 2000000) {
          this.showOtherImgSizeErr = false;

          this.urlOther = event.target.files[0].name;
          this.selectedImage = event.target.files[0];
          fd.append('user_id', this.appConfig.getLocalData('userId') ? this.appConfig.getLocalData('userId') : '');
          fd.append('description', this.NewOther.value ? this.NewOther.value : '');
          fd.append('label', 'other');
          fd.append('level', '');
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, uploadType, i);
        } else {
          this.showOtherImgSizeErr = true;
        }
      } else {
        this.showOtherImgErr = true;
      }
    }
    // console.log(this.otherDocArr.controls, 'otherDocFile');

  }

  async uploadImage(file, selectType, i) {

    try {

      this.loadingService.setLoading(true);
      const data = await (await this.candidateService.uploadCandidateDocument(file)).json();
      this.loadingService.setLoading(false);
      // this.candidateService.uploadCandidateDocument(fd).subscribe((data: any) => {
      this.appConfig.nzNotification('success', 'Uploaded', 'Document uploaded successfully');
      this.ngOnInit();
    } catch (e) {
      this.appConfig.nzNotification('error', 'Not Uploaded', 'Try again after sometime...');
      this.loadingService.setLoading(false);
      this.ngOnInit();
    }
    // }, (err) => {

    // });
  }


  submitDialog(btnType) {
    let enable = true;
    const filter = this.educationValuearray.filter((element)=> {
      if (element && !element['cerificate_id']) {
        enable = false;
        return this.appConfig.nzNotification('error', 'Not submitted', `Please upload the mandatory documents in Education section to proceed further`);
       }
     });
     if (!this.getResumeData || !this.getResumeData['cerificate_id']) {
      enable = false;
      this.appConfig.nzNotification('error', 'Not submitted', 'Please upload the Resume documents to proceed further');
    }

    if (enable) {
      let btnType = 'submit';
      const data = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Are you sure you want to upload this documents?`,
          type: 'upload-tpo',
          identity: 'upload-doc'
        },
        showText: btnType == 'submit' ? 'Are you sure you want to submit these documents?' : '',
        showConfirm: 'Confirm',
        documentUpload: 'uploadDoc',
        showCancel: 'Cancel',
        showOk: ''
      };
      this.openDialog(ShortlistBoxComponent, data, btnType);

    }

  }

  openDialog(component, data, btnType) {
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
        if (btnType == 'submit') {
          this.appConfig.nzNotification('success', 'Submitted', 'Documents submitted successfully');
        } else {
          if (btnType && btnType['certicate_id'])
          this.removeCertApi(btnType);
        }
      }
    });
  }

  // To validate all fields after submit
  validateAllFormArrays(formArray: FormArray) {
    formArray.controls.forEach(formGroup => {
      Object.keys(formGroup['controls']).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          // if (control['status'] === 'INVALID') {
          //   this.appConfig.setLocalData('educationalFormSubmitted', 'false');
          // }
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFields(control);
        }
      });

    });
  }


  // To validate all fields after submit
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

}
