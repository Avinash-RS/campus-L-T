import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, NgForm } from '@angular/forms';
import { AppConfigService } from 'src/app/config/app-config.service';
import { CandidateMappersService } from 'src/app/services/candidate-mappers.service';
import { MatDialog } from '@angular/material';
import { ShortlistBoxComponent } from 'src/app/shared/modal-box/shortlist-box/shortlist-box.component';

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
  urlCertificate = [];
  urlOther = [];
  educationDropDownLevel: any = [];
  educationDetailsArr = [];
  certificatDetailsArr = [];
  otherDetailsArr = [];
  resumeFile: any;
  showResumeImgError = false;
  showEducationImgErr = false;
  showCertificateImgErr = false;
  showOtherImgErr = false;
  saveAndSubmitBtnDisable = true;
  selectedDropdownValue = [];
  documentUploadType: any;
  getResumeData: any = '';
  updateDocumentIndex: any;
  updateMode = false;


  resumeUploadForm = new FormGroup({
    resume: new FormControl()
  })
  educationUploadForm: FormGroup;
  certificateUploadForm: FormGroup;
  otherUploadForm: FormGroup;


  constructor(private fb: FormBuilder,
    private appConfig: AppConfigService,
    private candidateService: CandidateMappersService,
    private matDialog: MatDialog) { }

  ngOnInit() {
    this.FormInitialization();
    this.getUploadedDocument();

    var userid = {
      'id': this.appConfig.getLocalData('userId')
    }
    this.candidateService.getEducationDropDown(userid).subscribe((data: any) => {
      this.educationDropDownLevel = data[0][0].education_level;
      this.appConfig.hideLoader();

    }, (err) => {

    });
  }

  getUploadedDocument() {
    var userid = {
      'id': this.appConfig.getLocalData('userId')
    }
    this.candidateService.getUploadedDocument(userid).subscribe((data: any) => {
      this.certificateValuearray = data[0][0].certificate_array;
      this.otherDocValuearray = data[0][0].other_array;
      this.educationValuearray = data[0][0].education_documents;
      this.selectedDropdownValue = [];
      this.getResumeData = data[0][0].resume_details[0];
      if (data[0][0].resume_details[0]) {
        this.updateMode = true;
        this.urlResume = data[0][0].resume_details[0].certificate_url;
      }
      this.appConfig.hideLoader();
      this.FormInitialization();

    }, (err) => {

    });
  }


  educationPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(edu => {
        this.addEducationForm(edu);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addEducationForm(null);
      }
    }
  }

  FormInitialization() {
    this.educationUploadForm = this.fb.group({
      educationUploadArr: this.fb.array([])
    }), this.educationPatch(this.educationValuearray);

    this.certificateUploadForm = this.fb.group({
      certificateUploadArr: this.fb.array([])
    }), this.certificatePatch(this.certificateValuearray);

    this.otherUploadForm = this.fb.group({
      otherUploadArr: this.fb.array([])
    }), this.otherDocPatch(this.otherDocValuearray);
  }

  get eduArr() { return this.educationUploadForm.get('educationUploadArr') as FormArray; }

  addEducationForm(data?: any) {
    this.eduArr.push(this.createItem(data));
  }

  createItem(edu): any {
    if (edu) {
      this.urlEducation.push(edu.certificate_url);
      this.selectedDropdownValue.push(edu.education_level);
      return this.fb.group({

        level: [null, Validators.required],
        repotcard: [null, Validators.required]
      });
    } else {
      return this.fb.group({

        level: [null, Validators.required],
        repotcard: [null, Validators.required]
      });
    }
  }

  removeEducationDoc(i: number) {
    this.urlEducation.splice(i, 1);
    this.eduArr.removeAt(i);
    this.selectedDropdownValue.splice(i, 1);
  }

  certificatePatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(certi => {
        this.addCertificateForm(certi);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addCertificateForm(null);
      }
    }
  }

  get certiArr() { return this.certificateUploadForm.get('certificateUploadArr') as FormArray; }

  addCertificateForm(data?: any) {
    this.certiArr.push(this.createCertificateItem(data));
  }

  createCertificateItem(edu): any {
    if (edu) {
      this.urlCertificate.push(edu.certificate_url);
      return this.fb.group({

        certificateName: [edu.certificate_name, Validators.required],
        certificateFile: [null, Validators.required]
      });
    } else {
      return this.fb.group({

        certificateName: [null, Validators.required],
        certificateFile: [null, Validators.required]
      });
    }
  }


  removeCertificate(i: number) {
    this.urlCertificate.splice(i, 1);
    this.certiArr.removeAt(i);
  }

  otherDocPatch(dataArray) {
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(otherDoc => {
        this.addOtherDocForm(otherDoc);
      });
    } else {
      for (let i = 0; i <= 0; i++) {
        this.addOtherDocForm(null);
      }
    }
  }

  get otherDocArr() { return this.otherUploadForm.get('otherUploadArr') as FormArray; }

  addOtherDocForm(data?: any) {
    this.otherDocArr.push(this.createOtherDocItem(data));
  }

  createOtherDocItem(edu): any {
    if (edu) {
      this.urlOther.push(edu.certificate_url);
      return this.fb.group({

        otherDocName: [edu.description, Validators.required],
        otherDocFile: [null, Validators.required]
      });
    } else {
      return this.fb.group({

        otherDocName: [null, Validators.required],
        otherDocFile: [null, Validators.required]
      });
    }
  }

  removeOtherDoc(i: number) {
    this.urlOther.splice(i, 1);
    this.otherDocArr.removeAt(i);
  }
  stoppropgation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  onSelectFile(event, uploadType, i) {

    this.documentUploadType = uploadType;
    this.updateDocumentIndex = i;
    const fd = new FormData();
    if (uploadType == 'resume') {
      if (event.target.files && (event.target.files[0].type.includes('application/pdf') || event.target.files[0].type.includes('application/msword') || event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jpeg'))) {
        this.showResumeImgError = false;
        if (event.target.files[0].size < 2000000) {
          this.showResumeImgSizeError = false;

          this.urlResume = event.target.files[0].name;
          this.selectedImage = event.target.files[0];
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, uploadType, i);
        } else {
          this.showResumeImgSizeError = true;
        }
      } else {
        this.showResumeImgError = true;
      }
    } else if (uploadType == 'education') {
      if (event.target.files && (event.target.files[0].type.includes('application/pdf') || event.target.files[0].type.includes('application/msword') || event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jpeg'))) {
        this.showEducationImgErr = false;
        if (event.target.files[0].size < 2000000) {
          this.showEducationImgSizeErr = false;
          if (event.target.id == 'file-input-' + i) {
            this.urlEducation[i] = event.target.files[0].name
          }
          this.selectedImage = event.target.files[0];
          fd.append('product_image', this.selectedImage);

          this.uploadImage(fd, uploadType, i);
        } else {
          this.showEducationImgSizeErr = true;
        }
      } else {
        this.showEducationImgErr = true;
      }
    } else if (uploadType == 'certificate') {
      if (event.target.files && (event.target.files[0].type.includes('application/pdf') || event.target.files[0].type.includes('application/msword') || event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jpeg'))) {
        this.showCertificateImgErr = false;
        if (event.target.files[0].size < 2000000) {
          this.showCertificateImgSizeErr = false;

          if (event.target.id == 'file-input-2-' + i) {
            this.urlCertificate[i] = event.target.files[0].name
          }

          this.selectedImage = event.target.files[0];
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, uploadType, i);
        } else {
          this.showCertificateImgSizeErr = true;
        }
      } else {
        this.showCertificateImgErr = true;
      }
    } else if (uploadType == 'other') {
      if (event.target.files && (event.target.files[0].type.includes('application/pdf') || event.target.files[0].type.includes('application/msword') || event.target.files[0].type.includes('image/png') || event.target.files[0].type.includes('image/jpeg'))) {
        this.showOtherImgErr = false;
        if (event.target.files[0].size < 2000000) {
          this.showOtherImgSizeErr = false;

          if (event.target.id == 'file-input-3-' + i) {
            this.urlOther[i] = event.target.files[0].name
          }

          this.selectedImage = event.target.files[0];
          fd.append('product_image', this.selectedImage);
          this.uploadImage(fd, uploadType, i);
        } else {
          this.showOtherImgSizeErr = true;
        }
      } else {
        this.showOtherImgErr = true;
      }
    }
  }

  async uploadImage(file, selectType, i) {

    try {
      this.appConfig.showLoader();
      const data = await (await this.candidateService.uploadCandidateDocument(file)).json();

      // this.candidateService.uploadCandidateDocument(fd).subscribe((data: any) => {

      this.appConfig.hideLoader();

      if (selectType == 'education') {
        var eduObj = {
          'level': this.educationUploadForm.value.educationUploadArr[i].level,
          'uploaded_id': data[0].fileid
        }
        if(this.updateMode) {
          eduObj['id'] = this.educationValuearray.length > 0 ? this.educationValuearray[this.updateDocumentIndex].id : '';
        }
        this.educationDetailsArr.push(eduObj);
      } else if (selectType == 'certificate') {
        var cerObj = {
          'document_name': this.certificateUploadForm.value.certificateUploadArr[i].certificateName,
          'uploaded_id': data[0].fileid
        }
        if(this.updateMode) {
          cerObj['id'] = this.certificateValuearray.length > 0 ? this.certificateValuearray[this.updateDocumentIndex].id : '';
        }
        this.certificatDetailsArr.push(cerObj);
      } else if (selectType == 'other') {
        var otherObj = {
          'document_name': this.otherUploadForm.value.otherUploadArr[i].otherDocName,
          'uploaded_id': data[0].fileid
        }
        if(this.updateMode) {
          otherObj['id'] = this.otherDocValuearray.length > 0 ? this.otherDocValuearray[this.updateDocumentIndex].id : '';
        }
        this.otherDetailsArr.push(otherObj);
      } else {
        this.resumeFile = data[0].fileid
      }

      this.appConfig.success(`Document uploaded successfully`, '');
    } catch (e) {
      this.appConfig.hideLoader();
    }
    // }, (err) => {

    // });
  }

  uploadFile(clickType) {
    if (this.updateMode == false) {
      var documentObj = {
        'user_id': this.appConfig.getLocalData('userId'),
        'save_type': clickType,
        'education_details': this.educationDetailsArr,
        'certificate_description': this.certificatDetailsArr,
        'other_certificate': this.otherDetailsArr,
        'resume_id': this.resumeFile
      }

      this.candidateService.saveUploadDocument(documentObj).subscribe((data: any) => {

        this.appConfig.hideLoader();

        if (clickType == 'submit') {
          this.appConfig.success(`Documents submitted successfully`, '');
        } else {
          this.appConfig.success(`Documents saved successfully`, '');
        }
        this.saveAndSubmitBtnDisable = true;
      }, (err) => {

      });

    } else {
      // this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
      // this.validateAllFields(this.resumeUploadForm);
      // this.validateAllFormArrays(this.educationUploadForm.get('educationUploadArr') as FormArray);
      // this.validateAllFormArrays(this.certificateUploadForm.get('certificateUploadArr') as FormArray);
      // this.validateAllFormArrays(this.otherUploadForm.get('otherUploadArr') as FormArray);
      
      var documentObjj = {};
      documentObjj = {
        'user_id': this.appConfig.getLocalData('userId'),
        'save_type': clickType
      }
      if(this.documentUploadType == 'resume'){
        documentObjj['resume_id'] = this.resumeFile
        documentObjj['resume_json_id'] = this.getResumeData.id;
      }else if(this.documentUploadType == 'education'){
        documentObjj['education_details'] = this.educationDetailsArr;
      }else if(this.documentUploadType == 'certificate'){
        documentObjj['certificate_description'] = this.certificatDetailsArr;
      }else if(this.documentUploadType == 'other'){
        documentObjj['other_certificate'] = this.otherDetailsArr;
      }

      this.candidateService.updateUploadDocument(documentObjj).subscribe((data: any) => {

        this.appConfig.hideLoader();

        if (clickType == 'submit') {
          this.appConfig.success(`Documents updated successfully`, '');
        } else {
          this.appConfig.success(`Documents saved successfully`, '');
        }
        this.saveAndSubmitBtnDisable = true;
      }, (err) => {

      });
    }
  }

  submitDialog(btnType) {
    if(this.updateMode == false){
      if (this.educationUploadForm.valid && this.resumeUploadForm.valid) {
        const data = {
          iconName: '',
          dataToBeShared: {
            confirmText: `Are you sure you want to upload this documents?`,
            type: 'upload-tpo',
            identity: 'upload-doc'
          },
          showText: btnType == 'submit' ? 'The uploaded documents will be submitted to the recruitment team. Further changes will require permission from them' : 'Please confirm, Are you sure you want to upload this documents',
          showConfirm: 'Confirm',
          documentUpload: 'uploadDoc',
          showCancel: 'Cancel',
          showOk: ''
        };
  
        this.openDialog(ShortlistBoxComponent, data, btnType);
      } else {
        this.appConfig.nzNotification('error', 'Not Submitted', 'Please fill all the red highlighted fields to proceed further');
        this.validateAllFields(this.resumeUploadForm);
        this.validateAllFormArrays(this.educationUploadForm.get('educationUploadArr') as FormArray);
        this.validateAllFormArrays(this.certificateUploadForm.get('certificateUploadArr') as FormArray);
        this.validateAllFormArrays(this.otherUploadForm.get('otherUploadArr') as FormArray);
      }
    }else{
      const data = {
        iconName: '',
        dataToBeShared: {
          confirmText: `Are you sure you want to upload this documents?`,
          type: 'upload-tpo',
          identity: 'upload-doc'
        },
        showText: btnType == 'submit' ? 'The uploaded documents will be submitted to the recruitment team. Further changes will require permission from them' : 'Please confirm, Are you sure you want to upload this documents',
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
        this.uploadFile(btnType);
      }
    });
  }

  disableBtn() {
    if(this.updateMode == false){
      if (this.educationUploadForm.valid && this.resumeUploadForm.valid) {
        this.saveAndSubmitBtnDisable = false;
      }
    }else{
      this.saveAndSubmitBtnDisable = false;
    }
    
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
